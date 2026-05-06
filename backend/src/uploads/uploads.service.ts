import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class UploadsService {
  private readonly logger = new Logger(UploadsService.name);

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    cloudinary.config({
      cloud_name: this.config.get<string>('cloudinary.cloudName'),
      api_key:    this.config.get<string>('cloudinary.apiKey'),
      api_secret: this.config.get<string>('cloudinary.apiSecret'),
    });
  }

  // ── Allowed types ────────────────────────────────────────────────
  private readonly ALLOWED_TYPES: Record<string, string[]> = {
    avatar: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    medical: [
      'image/jpeg', 'image/jpg', 'image/png',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
  };

  private readonly MAX_SIZES: Record<string, number> = {
    avatar:  5  * 1024 * 1024, //  5 MB
    medical: 20 * 1024 * 1024, // 20 MB
  };

  // ── Generate presigned URL ───────────────────────────────────────
  // Frontend uses this URL to upload DIRECTLY to Cloudinary
  // Your server never receives the file bytes
  async getPresignedUrl(
    userId:   string,
    type:     'avatar' | 'medical',
    mimeType: string,
    fileName: string,
    fileSize: number,
  ) {
    // Validate mime type
    if (!this.ALLOWED_TYPES[type]?.includes(mimeType)) {
      throw new BadRequestException(
        type === 'avatar'
          ? 'Only JPEG, PNG and WebP images are allowed for avatars.'
          : 'Allowed types: PDF, Word documents, JPEG, PNG.',
      );
    }

    // Validate file size
    if (fileSize > this.MAX_SIZES[type]) {
      throw new BadRequestException(
        type === 'avatar'
          ? 'Avatar must be smaller than 5 MB.'
          : 'Medical file must be smaller than 20 MB.',
      );
    }

    const isImage      = mimeType.startsWith('image/');
    const resourceType = isImage ? 'image' : 'raw';
    const timestamp    = Math.round(Date.now() / 1000);
    const folder       = type === 'avatar'
      ? `physioai/avatars`
      : `physioai/medical-files/${userId}`;
    const publicId     = type === 'avatar'
      ? `avatar_${userId}`           // overwrites old avatar
      : `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

    // Build params to sign (must match exactly what frontend sends)
    const paramsToSign: Record<string, any> = {
      timestamp,
      folder,
      public_id: publicId,
      ...(type === 'avatar' ? { overwrite: true } : {}),
    };

    // Generate signature using Cloudinary SDK
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      this.config.get<string>('cloudinary.apiSecret')!,
    );

    return {
      // These go to the frontend
      uploadUrl:    `https://api.cloudinary.com/v1_1/${this.config.get('cloudinary.cloudName')}/${resourceType}/upload`,
      apiKey:       this.config.get<string>('cloudinary.apiKey'),
      signature,
      timestamp,
      folder,
      publicId,
      resourceType,
      // Expected final URL (frontend can use this to preview immediately)
      expectedUrl: `https://res.cloudinary.com/${this.config.get('cloudinary.cloudName')}/${resourceType}/upload/${folder}/${publicId}`,
    };
  }

  // ── Confirm upload ───────────────────────────────────────────────
  // Called AFTER frontend uploads directly to Cloudinary
  // Frontend sends back the Cloudinary response so we save it in DB
  async confirmUpload(
    userId:   string,
    type:     'avatar' | 'medical',
    payload: {
      publicId:     string;
      url:          string;
      resourceType: string;
      fileName:     string;
      fileSize:     number;
      mimeType:     string;
    },
  ) {
    // If avatar — delete old one from DB (Cloudinary already overwrote it)
    if (type === 'avatar') {
      await this.prisma.fileUpload.deleteMany({
        where: { userId, folder: 'avatars' },
      });

      // Update user avatarUrl
      await this.prisma.user.update({
        where: { id: userId },
        data:  { avatarUrl: payload.url },
      });

      // Update doctor profile if this user is a doctor
      await this.prisma.doctor.updateMany({
        where: { userId },
        data:  { avatarUrl: payload.url },
      }).catch(() => {});
    }
    const finalUrl = payload.resourceType === 'raw' && payload.url.includes('/raw/upload/')
  ? payload.url.replace('/raw/upload/', '/raw/upload/fl_inline/')
  : payload.url;

    // Save file reference in DB
    const record = await this.prisma.fileUpload.create({
      data: {
        userId,
        url:          finalUrl,
        // url:          payload.url,
        publicId:     payload.publicId,
        resourceType: payload.resourceType,
        folder:       type === 'avatar' ? 'avatars' : 'medical-files',
        fileName:     payload.fileName,
        fileSize:     payload.fileSize,
        mimeType:     payload.mimeType,
      },
    });

    this.logger.log(`Upload confirmed: ${type} for user ${userId} — ${payload.url}`);

    return {
      fileId:   record.id,
      url:      finalUrl,
      fileName: payload.fileName,
      message:  type === 'avatar'
        ? 'Profile photo updated successfully'
        : 'Medical file saved successfully',
    };
  }

  // ── Get user files ───────────────────────────────────────────────
  async getUserFiles(userId: string, folder?: string) {
    const files = await this.prisma.fileUpload.findMany({
      where:   { userId, ...(folder ? { folder } : {}) },
      orderBy: { createdAt: 'desc' },
    });

    return files.map(f => ({
      id:        f.id,
      url:       f.url,
      fileName:  f.fileName,
      mimeType:  f.mimeType,
      fileSize:  f.fileSize,
      folder:    f.folder,
      createdAt: f.createdAt,
    }));
  }

  // ── Delete file ──────────────────────────────────────────────────
  async deleteFile(fileId: string, userId: string) {
    const file = await this.prisma.fileUpload.findUnique({
      where: { id: fileId },
    });
    if (!file)                throw new BadRequestException('File not found');
    if (file.userId !== userId) throw new BadRequestException('Access denied');

    // Delete from Cloudinary
    try {
      await cloudinary.uploader.destroy(file.publicId, {
        resource_type: file.resourceType as any,
      });
    } catch {
      this.logger.warn(`Could not delete from Cloudinary: ${file.publicId}`);
    }

    // Delete from DB
    await this.prisma.fileUpload.delete({ where: { id: fileId } });

    return { deleted: true, fileId };
  }
  
}
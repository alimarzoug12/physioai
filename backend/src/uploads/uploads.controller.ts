import {
  Controller, Post, Get, Delete,
  Body, Param, Query, Req, UseGuards,
} from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('uploads')
@UseGuards(JwtAuthGuard)
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  // ── POST /uploads/presigned-url ──────────────────────────────────
  // Step 1: frontend asks for a signed upload URL
  @Post('presigned-url')
  getPresignedUrl(
    @Req() req: any,
    @Body() body: {
      type:     'avatar' | 'medical';
      mimeType: string;
      fileName: string;
      fileSize: number;
    },
  ) {
    return this.uploadsService.getPresignedUrl(
      req.user.userId,
      body.type,
      body.mimeType,
      body.fileName,
      body.fileSize,
    );
  }

  // ── POST /uploads/confirm ────────────────────────────────────────
  // Step 2: frontend confirms upload after Cloudinary responds
  @Post('confirm')
  confirmUpload(
    @Req() req: any,
    @Body() body: {
      type:         'avatar' | 'medical';
      publicId:     string;
      url:          string;
      resourceType: string;
      fileName:     string;
      fileSize:     number;
      mimeType:     string;
    },
  ) {
    return this.uploadsService.confirmUpload(
      req.user.userId,
      body.type,
      {
        publicId:     body.publicId,
        url:          body.url,
        resourceType: body.resourceType,
        fileName:     body.fileName,
        fileSize:     body.fileSize,
        mimeType:     body.mimeType,
      },
    );
  }

  // ── GET /uploads/my-files ────────────────────────────────────────
  @Get('my-files')
  getMyFiles(
    @Req() req: any,
    @Query('folder') folder?: string,
  ) {
    return this.uploadsService.getUserFiles(req.user.userId, folder);
  }

  // ── DELETE /uploads/:id ──────────────────────────────────────────
  @Delete(':id')
  deleteFile(@Param('id') id: string, @Req() req: any) {
    return this.uploadsService.deleteFile(id, req.user.userId);
  }
}
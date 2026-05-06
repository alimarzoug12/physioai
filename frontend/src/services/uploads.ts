const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function getToken(): string {
  return localStorage.getItem('token') ?? '';
}

export interface UploadResult {
  fileId:   string;
  url:      string;
  fileName: string;
  message:  string;
}

export interface MyFile {
  id:        string;
  url:       string;
  fileName:  string;
  mimeType:  string;
  fileSize:  number;
  folder:    string;
  createdAt: string;
}

// ── Core upload function using presigned URL ─────────────────────────
// 1. Ask backend for presigned URL
// 2. Upload file DIRECTLY to Cloudinary (server never sees file bytes)
// 3. Confirm with backend to save DB record
async function uploadWithPresignedUrl(
  file:        File,
  type:        'avatar' | 'medical',
  onProgress?: (percent: number) => void,
): Promise<UploadResult> {

  // ── Step 1: Get presigned URL from backend ──────────────────────
  const presignRes = await fetch(`${API_URL}/uploads/presigned-url`, {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
    body: JSON.stringify({
      type,
      mimeType: file.type,
      fileName: file.name,
      fileSize: file.size,
    }),
  });

  if (!presignRes.ok) {
    const err = await presignRes.json().catch(() => ({ message: 'Failed to get upload URL' }));
    throw new Error(err.message || 'Failed to get upload URL');
  }

  const presigned = await presignRes.json();
  // presigned = { uploadUrl, apiKey, signature, timestamp, folder, publicId, resourceType }

  // ── Step 2: Upload directly to Cloudinary ──────────────────────
  const formData = new FormData();
  formData.append('file',         file);
  formData.append('api_key',      presigned.apiKey);
  formData.append('signature',    presigned.signature);
  formData.append('timestamp',    String(presigned.timestamp));
  formData.append('folder',       presigned.folder);
  formData.append('public_id',    presigned.publicId);
  if (type === 'avatar') {
    formData.append('overwrite', 'true');
  }

  // Use XHR for progress tracking
  const cloudinaryResponse = await new Promise<any>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    if (onProgress) {
      xhr.upload.onprogress = e => {
        if (e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        const body = JSON.parse(xhr.responseText || '{}');
        reject(new Error(body.error?.message || 'Cloudinary upload failed'));
      }
    };

    xhr.onerror = () => reject(new Error('Network error during upload'));

    xhr.open('POST', presigned.uploadUrl);
    // ⚠️ No Authorization header here — Cloudinary uses signature
    xhr.send(formData);
  });

  // cloudinaryResponse.secure_url  = final CDN URL
  // cloudinaryResponse.public_id   = used for deletion

  // ── Step 3: Confirm with backend — saves to DB ─────────────────
  const confirmRes = await fetch(`${API_URL}/uploads/confirm`, {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
    body: JSON.stringify({
      type,
      publicId:     cloudinaryResponse.public_id,
      url:          cloudinaryResponse.secure_url,
      resourceType: presigned.resourceType,
      fileName:     file.name,
      fileSize:     file.size,
      mimeType:     file.type,
    }),
  });

  if (!confirmRes.ok) {
    const err = await confirmRes.json().catch(() => ({ message: 'Failed to save file record' }));
    throw new Error(err.message || 'Failed to save file record');
  }

  return confirmRes.json();
}

// ── Public API ────────────────────────────────────────────────────────
export const uploadsApi = {

  uploadAvatar: (file: File, onProgress?: (pct: number) => void) =>
    uploadWithPresignedUrl(file, 'avatar', onProgress),

  uploadMedicalFile: (file: File, onProgress?: (pct: number) => void) =>
    uploadWithPresignedUrl(file, 'medical', onProgress),

  getMyFiles: async (folder?: string): Promise<MyFile[]> => {
    const url = `${API_URL}/uploads/my-files${folder ? `?folder=${folder}` : ''}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error('Failed to load files');
    return res.json();
  },

  deleteFile: async (fileId: string): Promise<void> => {
    const res = await fetch(`${API_URL}/uploads/${fileId}`, {
      method:  'DELETE',
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error('Failed to delete file');
  },

  formatFileSize: (bytes: number): string => {
    if (bytes < 1024)        return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  },

  isImage: (mimeType: string) => mimeType.startsWith('image/'),
  isPdf:   (mimeType: string) => mimeType === 'application/pdf',
};
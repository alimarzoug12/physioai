import React, { useRef, useState } from 'react';
import { uploadsApi } from '../services/uploads';

interface Props {
  currentAvatarUrl?: string;
  userName:          string;
  onUploaded:        (newUrl: string) => void;
}

const AvatarUpload: React.FC<Props> = ({ currentAvatarUrl, userName, onUploaded }) => {
  const inputRef              = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    setLoading(true);
    setProgress(0);
    setError('');
    setSuccess('');

    try {
      const result = await uploadsApi.uploadAvatar(file, pct => setProgress(pct));
      onUploaded(result.url);
      setSuccess('Profile photo updated!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
      setPreview(null);
    } finally {
      setLoading(false);
      setProgress(0);
    }

    e.target.value = '';
  };

  const avatarSrc = preview || currentAvatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=3b82f6&color=fff&size=200`;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar with hover overlay */}
      <div className="relative group">
        <img
          src={avatarSrc}
          alt={userName}
          className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
        />
        <button
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="absolute inset-0 rounded-full bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {loading ? (
            <>
              <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin mb-1" />
              <span className="text-white text-sm font-medium">{progress}%</span>
            </>
          ) : (
            <span className="text-white text-3xl">📷</span>
          )}
        </button>
      </div>

      {/* Progress bar */}
      {loading && (
        <div className="w-48 bg-gray-200 h-2 rounded-full overflow-hidden">
          <div
            className="bg-blue-500 h-full rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Upload button */}
      <button
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-xl text-lg font-medium hover:bg-blue-600 transition disabled:opacity-50"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Uploading {progress}%...
          </>
        ) : (
          '📷 Change Profile Photo'
        )}
      </button>

      {success && (
        <p className="text-green-600 text-lg font-medium">✅ {success}</p>
      )}
      {error && (
        <p className="text-red-500 text-lg text-center">{error}</p>
      )}
      <p className="text-gray-400 text-lg">JPEG, PNG or WebP · Max 5 MB</p>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default AvatarUpload;
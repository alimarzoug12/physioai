import React, { useRef, useState } from 'react';
import { uploadsApi, MyFile } from '../services/uploads';

interface Props {
  onFileReady: (file: { url: string; fileName: string; mimeType: string }) => void;
}

const CATEGORY_OPTIONS = [
  { value: 'xray',         label: '🦴 X-Ray'        },
  { value: 'mri',          label: '🧠 MRI Scan'      },
  { value: 'report',       label: '📋 Medical Report' },
  { value: 'prescription', label: '💊 Prescription'   },
  { value: 'general',      label: '📎 Other'          },
];

const MedicalFileUpload: React.FC<Props> = ({ onFileReady }) => {
  const inputRef                    = useRef<HTMLInputElement>(null);
  const [uploading,   setUploading] = useState(false);
  const [progress,    setProgress]  = useState(0);
  const [error,       setError]     = useState('');
  const [uploadedFile, setUploadedFile] = useState<{ url: string; fileName: string } | null>(null);
  const [category,    setCategory]  = useState<any>('general');
  const [showPicker,  setShowPicker]= useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setError('');
    setUploadedFile(null);

    try {
      const result = await uploadsApi.uploadMedicalFile(
        file,
        category,
        // (pct) => setProgress(pct),
      );

      setUploadedFile({ url: result.url, fileName: file.name });
      onFileReady({ url: result.url, fileName: file.name, mimeType: file.type });
      setProgress(100);
    } catch (err: any) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }

    // Reset input so same file can be re-selected
    e.target.value = '';
  };

  return (
    <div className="relative">
      {/* Category picker */}
      {showPicker && (
        <div className="absolute bottom-full mb-2 left-0 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden w-64 z-50">
          <p className="text-gray-500 text-lg font-medium px-4 pt-3 pb-1">
            File category:
          </p>
          {CATEGORY_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => {
                setCategory(opt.value);
                setShowPicker(false);
                inputRef.current?.click();
              }}
              className="w-full text-left px-4 py-3 text-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {/* Main upload button */}
      <button
        onClick={() => setShowPicker(p => !p)}
        disabled={uploading}
        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-3 rounded-xl text-lg transition disabled:opacity-50"
        title="Upload medical file"
      >
        {uploading ? (
          <>
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span>{progress}%</span>
          </>
        ) : (
          <>
            <span className="text-xl">📎</span>
            <span>Attach File</span>
          </>
        )}
      </button>

      {/* Progress bar */}
      {uploading && (
        <div className="absolute bottom-full mb-1 left-0 right-0">
          <div className="bg-gray-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Success state */}
      {uploadedFile && !uploading && (
        <div className="absolute bottom-full mb-2 left-0 bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2 w-72 z-50">
          <span className="text-green-500 text-xl">✅</span>
          <div className="flex-1 min-w-0">
            <p className="text-green-700 text-lg font-medium truncate">
              {uploadedFile.fileName}
            </p>
            <p className="text-green-600 text-sm">Uploaded successfully</p>
          </div>
          <button
            onClick={() => setUploadedFile(null)}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute bottom-full mb-2 left-0 bg-red-50 border border-red-200 rounded-xl p-3 w-72 z-50">
          <p className="text-red-600 text-lg">{error}</p>
          <button
            onClick={() => setError('')}
            className="text-red-400 text-sm mt-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default MedicalFileUpload;
import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, Loader2, X, Image as ImageIcon } from 'lucide-react';
import { uploadImageToImageKit } from '../../services/imagekit';

export function ImageKitUploader({
  value,
  onChange,
  folder = '/lookbook',
  tags = ['lookbook'],
  label = 'Upload Photo',
  helpText = 'Supports PNG, JPG, WEBP, AVIF up to 10MB',
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WEBP, etc.)');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setError('File size must be less than 15MB');
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const result = await uploadImageToImageKit(file, {
        folder,
        tags,
        fileName: file.name.replace(/[^a-zA-Z0-9.-]/g, '_'),
      });

      if (onChange) {
        onChange(result.url);
      }
    } catch (err) {
      console.error('ImageKit upload error:', err);
      setError(err.message || 'Failed to upload photo to ImageKit');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleRemove = () => {
    if (onChange) onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    setError(null);
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-deep-espresso">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput((prev) => !prev)}
          className="text-[11px] text-[#D6204E] hover:underline cursor-pointer"
        >
          {showUrlInput ? 'Switch to file upload' : 'Paste external URL instead'}
        </button>
      </div>

      {showUrlInput ? (
        <div className="flex flex-col gap-1.5">
          <input
            type="url"
            value={value || ''}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder="https://..."
            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#F0CDD7] focus:outline-none focus:border-[#D6204E] focus:ring-1 focus:ring-[#D6204E]"
          />
          <p className="text-[11px] text-[#7A6B70]">
            Paste any direct image link or ImageKit delivery URL.
          </p>
        </div>
      ) : (
        <div>
          {/* Hidden native input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />

          {value ? (
            /* Uploaded Preview State */
            <div className="relative group rounded-2xl border border-[#F0CDD7] bg-[#FFF8FA] p-3 flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-[#F0CDD7] shrink-0">
                <img
                  src={value}
                  alt="Uploaded preview"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-semibold mb-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Uploaded to ImageKit CDN</span>
                </div>
                <p className="text-[11px] text-[#7A6B70] truncate font-mono">
                  {value}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1.5 rounded-lg border border-[#F0CDD7] bg-white hover:bg-[#FFF3F6] text-deep-espresso text-[11px] font-medium transition-colors cursor-pointer"
                >
                  Replace
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Dropzone / Upload Action State */
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-5 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                dragOver
                  ? 'border-[#D6204E] bg-[#FFF0F4]'
                  : 'border-[#F0CDD7] bg-[#FFFDFE] hover:border-[#D6204E] hover:bg-[#FFF8FA]'
              } ${isUploading ? 'pointer-events-none opacity-80' : ''}`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center gap-2 py-2">
                  <Loader2 className="w-7 h-7 text-[#D6204E] animate-spin" />
                  <span className="text-xs font-semibold text-deep-espresso">
                    Uploading directly to ImageKit CDN...
                  </span>
                  <span className="text-[11px] text-[#7A6B70]">
                    Applying compression and responsive transformations
                  </span>
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-[#FFF3F6] border border-[#F0CDD7] flex items-center justify-center text-[#D6204E]">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-deep-espresso">
                      Click to choose a photo <span className="font-normal text-[#7A6B70]">or drag and drop</span>
                    </p>
                    <p className="text-[11px] text-[#7A6B70] mt-0.5">
                      {helpText}
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {error && (
            <div className="mt-2 flex items-start gap-1.5 text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ImageKitUploader;


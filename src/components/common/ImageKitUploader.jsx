import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Image as ImageIcon,

  ArrowRight,
  RefreshCw,
  Copy,
  Check,
  FileCheck,
} from 'lucide-react';
import { uploadImageToImageKit } from '../../services/imagekit';
import {
  compressImage,
  formatBytes,
  validateImageFile,
  COMPRESSION_PRESETS,
} from '../../utils/imageCompressor';

/**
 * Universal ImageKit Uploader with Pre-Upload Compression & Preview Workflow
 *
 * Workflow:
 * Select / Drag Image → Local Client-side Compression → Pre-upload Preview with Size Comparison & Dimensions
 * → Explicit Admin "Confirm & Upload" Action → Upload to ImageKit CDN → Save Form Record
 *
 * Supports single & multiple images, presets for photos/logos/thumbnails, transparency preservation,
 * and memory cleanup.
 */
export function ImageKitUploader({
  value,
  onChange,
  preset = 'photo', // 'photo' | 'logo' | 'thumbnail' | 'banner' | 'lossless'
  compressionOptions,
  folder = '/lookbook',
  tags = ['lookbook'],
  label = 'Upload Photo',
  helpText = 'Supports PNG, JPG, WEBP, AVIF up to 25MB',
  multiple = false,
  maxFiles = 10,
  onNotify,
}) {
  // Staged files waiting for user confirmation before upload:
  // Each item: { id, originalFile, compressedResult, previewUrl, isUploading, uploadError }
  const [stagedFiles, setStagedFiles] = useState([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [pixelDimensions, setPixelDimensions] = useState(null);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const fileInputRef = useRef(null);

  // Revoke object URLs on component unmount
  useEffect(() => {
    return () => {
      stagedFiles.forEach((item) => {
        if (item.previewUrl) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });
    };
  }, [stagedFiles]);

  // Infer preset based on folder or explicit prop
  const effectivePreset = preset || (folder.includes('partner') ? 'logo' : (folder.includes('video') ? 'thumbnail' : 'photo'));

  // Measure natural pixel dimensions of currently saved CDN value
  useEffect(() => {
    if (!value || typeof value !== 'string') {
      setPixelDimensions(null);
      return;
    }
    const img = new Image();
    img.onload = () => {
      setPixelDimensions({
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
      });
    };
    img.onerror = () => {
      setPixelDimensions(null);
    };
    img.src = value;
  }, [value]);

  // Clean up a single staged item's preview URL
  const cleanupStagedItem = (item) => {
    if (item?.previewUrl) {
      URL.revokeObjectURL(item.previewUrl);
    }
  };

  /**
   * Handle incoming file selection: Validate and compress locally, but DO NOT upload yet.
   */
  const handleSelectFiles = async (fileList) => {
    if (!fileList || fileList.length === 0) return;

    setError(null);
    const filesToProcess = Array.from(fileList).slice(0, multiple ? maxFiles : 1);

    // Validate files
    for (const f of filesToProcess) {
      const validation = validateImageFile(f);
      if (!validation.valid) {
        setError(validation.error);
        if (onNotify) onNotify(validation.error, 'error');
        return;
      }
    }

    setIsCompressing(true);

    try {
      const newStaged = [];

      for (const file of filesToProcess) {
        const compressed = await compressImage(file, {
          preset: effectivePreset,
          ...(compressionOptions || {}),
        });

        newStaged.push({
          id: `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          originalFile: file,
          compressedResult: compressed,
          previewUrl: compressed.previewUrl,
          isUploading: false,
          uploadError: null,
        });
      }

      // If single mode, clean up old staged files first
      if (!multiple) {
        stagedFiles.forEach(cleanupStagedItem);
        setStagedFiles(newStaged);
      } else {
        setStagedFiles((prev) => [...prev, ...newStaged]);
      }
    } catch (err) {
      console.error('Image compression error:', err);
      const msg = err.message || 'Failed to compress image';
      setError(msg);
      if (onNotify) onNotify(msg, 'error');
    } finally {
      setIsCompressing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  /**
   * Remove a staged file before upload
   */
  const handleRemoveStaged = (id) => {
    setStagedFiles((prev) => {
      const toRemove = prev.find((item) => item.id === id);
      if (toRemove) cleanupStagedItem(toRemove);
      return prev.filter((item) => item.id !== id);
    });
    setError(null);
  };

  /**
   * Clear all staged files
   */
  const handleClearAllStaged = () => {
    stagedFiles.forEach(cleanupStagedItem);
    setStagedFiles([]);
    setError(null);
  };

  /**
   * Explicit Confirm & Upload Action:
   * Uploads compressed image(s) to ImageKit CDN only upon user confirmation.
   */
  const handleConfirmUpload = async () => {
    if (stagedFiles.length === 0 || isUploading) return;

    setError(null);
    setIsUploading(true);

    try {
      if (!multiple) {
        const item = stagedFiles[0];
        const fileToUpload = item.compressedResult.file;

        const result = await uploadImageToImageKit(fileToUpload, {
          folder,
          tags: [...tags, effectivePreset, 'compressed'],
          fileName: item.compressedResult.fileName,
        });

        // Cleanup local blob memory
        cleanupStagedItem(item);
        setStagedFiles([]);

        // Inform parent form of the new ImageKit CDN URL
        if (onChange) {
          onChange(result.url);
        }

        if (onNotify) {
          onNotify('Image successfully compressed and uploaded to CDN!', 'success');
        }
      } else {
        // Multi-image batch upload
        const uploadedUrls = [];
        for (let i = 0; i < stagedFiles.length; i++) {
          const item = stagedFiles[i];
          const result = await uploadImageToImageKit(item.compressedResult.file, {
            folder,
            tags: [...tags, effectivePreset, 'compressed'],
            fileName: item.compressedResult.fileName,
          });
          cleanupStagedItem(item);
          uploadedUrls.push(result.url);
        }

        setStagedFiles([]);

        if (onChange) {
          onChange(uploadedUrls);
        }

        if (onNotify) {
          onNotify(`Successfully uploaded ${uploadedUrls.length} images to CDN!`, 'success');
        }
      }
    } catch (err) {
      console.error('ImageKit CDN upload error:', err);
      const msg = err.message || 'Failed to upload photo to ImageKit';
      setError(msg);
      if (onNotify) onNotify(msg, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleSelectFiles(files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleRemoveExisting = () => {
    if (onChange) onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    setError(null);
  };

  const handleCopyUrl = (urlToCopy) => {
    if (!urlToCopy) return;
    navigator.clipboard?.writeText(urlToCopy);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  // Check if staged files exist
  const hasStaged = stagedFiles.length > 0;

  return (
    <div className="w-full flex flex-col gap-2 font-sans select-none">
      {/* Header bar with Label & Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-deep-espresso">
            {label}
          </label>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#FFF3F6] text-[#D6204E] border border-[#F0CDD7]">
            {COMPRESSION_PRESETS[effectivePreset]?.label || 'Auto-Optimized'}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowUrlInput((prev) => !prev)}
          className="text-[11px] text-[#D6204E] hover:underline cursor-pointer font-medium"
        >
          {showUrlInput ? 'Switch to file upload' : 'Paste external URL instead'}
        </button>
      </div>

      {/* External URL Mode */}
      {showUrlInput ? (
        <div className="flex flex-col gap-1.5 animate-fade-in">
          <input
            type="url"
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange?.(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#F0CDD7] focus:outline-none focus:border-[#D6204E] focus:ring-1 focus:ring-[#D6204E] bg-white font-mono"
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
            multiple={multiple}
            className="hidden"
            onChange={(e) => {
              if (e.target.files) handleSelectFiles(e.target.files);
            }}
          />

          {/* ========================================================= */}
          {/* STATE 1: Local Compressing in Progress                   */}
          {/* ========================================================= */}
          {isCompressing && (
            <div className="rounded-2xl border-2 border-dashed border-[#D6204E] bg-[#FFF8FA] p-6 text-center animate-fade-in flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-7 h-7 text-[#D6204E] animate-spin" />
              <p className="text-xs font-bold text-deep-espresso">
                Optimizing &amp; compressing image locally...
              </p>
              <p className="text-[11px] text-[#7A6B70]">
                Preserving aspect ratio, tuning pixel density, and stripping unnecessary metadata
              </p>
            </div>
          )}

          {/* ========================================================= */}
          {/* STATE 2: Staged for Upload (Pre-Upload Preview & Review)  */}
          {/* ========================================================= */}
          {!isCompressing && hasStaged && (
            <div className="rounded-2xl border border-[#F0CDD7] bg-[#FCFBFA] p-3.5 sm:p-4 space-y-3 shadow-xs animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-[#F0CDD7]/80">
                <div className="flex items-center gap-1.5">

                  <span className="text-xs font-bold text-deep-espresso">
                    Image Preview
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F8EE] text-[#1EBE5D] border border-[#25D366]/30">
                  Ready to Confirm
                </span>
              </div>

              {/* Single Image Staged Preview */}
              {!multiple && stagedFiles[0] && (
                (() => {
                  const item = stagedFiles[0];
                  const res = item.compressedResult;
                  return (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-white p-3 rounded-xl border border-[#F0CDD7]">
                      {/* Image Thumbnail with Dimensions Badge */}
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-[#FAF8F5] border border-border-warm shrink-0 group">
                        <img
                          src={item.previewUrl}
                          alt="Compressed preview"
                          className="w-full h-full object-cover select-none"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-xs py-0.5 text-center pointer-events-none">
                          <span className="text-[9px] font-mono text-white font-medium">
                            {res.compressedWidth} × {res.compressedHeight} px
                          </span>
                        </div>
                      </div>

                      {/* Compression Metrics Breakdown */}
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <p className="text-xs font-bold text-deep-espresso truncate" title={res.fileName}>
                          {res.fileName}
                        </p>

                        <div className="grid grid-cols-2 xs:grid-cols-3 gap-2 text-[11px]">
                          <div className="bg-[#FAF8F5] p-1.5 rounded-lg border border-stone-200">
                            <span className="text-[10px] text-stone-500 block">Original</span>
                            <span className="font-semibold text-stone-700 font-mono">
                              {formatBytes(res.originalSize)}
                            </span>
                          </div>

                          <div className="bg-[#FFF3F6] p-1.5 rounded-lg border border-[#F0CDD7]">
                            <span className="text-[10px] text-[#D6204E] block">Optimized</span>
                            <span className="font-bold text-[#D6204E] font-mono">
                              {formatBytes(res.compressedSize)}
                            </span>
                          </div>

                          <div className="bg-[#E8F8EE] p-1.5 rounded-lg border border-[#25D366]/30 col-span-2 xs:col-span-1">
                            <span className="text-[10px] text-[#1EBE5D] block">Reduction</span>
                            <span className="font-bold text-[#1EBE5D] font-mono">
                              {res.savedPercent > 0 ? `-${res.savedPercent}%` : 'Lossless'}
                            </span>
                          </div>
                        </div>

                        <p className="hidden sm:block text-[10px] text-[#7A6B70]">
                          Format: <strong className="font-mono text-stone-700 uppercase">{res.format.replace('image/', '')}</strong> · Saved: <strong className="font-mono text-emerald-600">{formatBytes(res.savedBytes)}</strong>
                        </p>
                      </div>
                    </div>
                  );
                })()
              )}

              {/* Multiple Images Staged Preview */}
              {multiple && (
                <div className="space-y-2 max-h-56 overflow-y-auto luxury-scrollbar pr-1">
                  {stagedFiles.map((item) => {
                    const res = item.compressedResult;
                    return (
                      <div key={item.id} className="flex items-center justify-between gap-3 bg-white p-2 rounded-xl border border-[#F0CDD7] text-xs">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img src={item.previewUrl} alt={res.fileName} className="w-10 h-10 rounded-lg object-cover shrink-0 border border-stone-200" />
                          <div className="truncate">
                            <p className="font-bold text-deep-espresso truncate max-w-[180px]">{res.fileName}</p>
                            <span className="text-[10px] text-stone-500 font-mono">
                              {res.compressedWidth}×{res.compressedHeight}px · {formatBytes(res.compressedSize)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#E8F8EE] text-[#1EBE5D]">
                            -{res.savedPercent}%
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveStaged(item.id)}
                            className="p-1 text-stone-400 hover:text-rose-500 rounded cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Explicit Confirmation Action Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="px-3 py-2 text-xs font-semibold text-stone-600 hover:text-deep-espresso border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors cursor-pointer text-center"
                  >
                    Choose Different Image
                  </button>
                  <button
                    type="button"
                    onClick={handleClearAllStaged}
                    disabled={isUploading}
                    className="px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleConfirmUpload}
                  disabled={isUploading}
                  className="bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:pointer-events-none"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Uploading to ImageKit CDN...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4" />
                      <span>Confirm &amp; Upload {multiple ? `All (${stagedFiles.length})` : 'Image'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STATE 3: Already Uploaded Live Preview                    */}
          {/* ========================================================= */}
          {!isCompressing && !hasStaged && value && typeof value === 'string' && (
            <div className="relative group rounded-2xl border border-[#F0CDD7] bg-[#FFF8FA] p-3 flex items-center gap-3 animate-fade-in">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-[#F0CDD7] shrink-0 relative">
                <img
                  src={value}
                  alt="Uploaded photo"
                  className="w-full h-full object-cover select-none"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 mb-1">
                  <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Uploaded<span className="hidden sm:inline"> to CDN</span></span>
                  </div>
                  {pixelDimensions && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FFF3F6] text-[#D6204E] border border-[#F0CDD7] shadow-2xs">
                      {pixelDimensions.width} × {pixelDimensions.height} px
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <p className="text-[11px] text-[#7A6B70] truncate font-mono flex-1">
                    {value}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleCopyUrl(value)}
                    className="p-1 text-stone-400 hover:text-stone-700 transition-colors"
                    title="Copy CDN URL"
                  >
                    {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1.5 rounded-lg border border-[#F0CDD7] bg-white hover:bg-[#FFF3F6] text-deep-espresso text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  Replace
                </button>
                <button
                  type="button"
                  onClick={handleRemoveExisting}
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STATE 4: Empty Initial Dropzone                           */}
          {/* ========================================================= */}
          {!isCompressing && !hasStaged && (!value || typeof value !== 'string') && (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                dragOver
                  ? 'border-[#D6204E] bg-[#FFF0F4]'
                  : 'border-[#F0CDD7] bg-[#FFFDFE] hover:border-[#D6204E] hover:bg-[#FFF8FA]'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-[#FFF3F6] border border-[#F0CDD7] flex items-center justify-center text-[#D6204E]">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-deep-espresso">
                  Choose photo <span className="hidden sm:inline font-normal text-[#7A6B70]">or drag and drop</span>
                </p>
                <p className="text-[11px] text-[#7A6B70] mt-0.5">
                  {helpText}
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-2 flex items-start gap-1.5 text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200 animate-fade-in">
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

import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, X, Check, Loader2, AlertCircle } from 'lucide-react';
import { uploadImageToImageKit } from '../../../../services/imagekit';
import { compressImage } from '../../../../utils/imageCompressor';

/**
 * Format a filename into a clean title (e.g. "loreal-paris.png" -> "Loreal Paris")
 */
function cleanTitleFromFilename(fileName) {
  if (!fileName) return '';
  const base = fileName.replace(/\.[^/.]+$/, '');
  const clean = base.replace(/[-_]+/g, ' ').trim();
  return clean.replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * MultiImageUploader
 * Clean, modern image uploader that stages files locally first with preview + cross icon,
 * and ONLY uploads & compresses them when the user clicks Save.
 */
export function MultiImageUploader({
  folder = '/lookbook',
  preset = 'photo',
  label = 'Photos',
  itemSingular = 'Look',
  itemPlural = 'Looks',
  multiple = true,
  showNameTag = false,
  initialItem = null,
  onSubmit,
  onCancel,
  onNotify,
}) {
  // Staged files waiting to be uploaded on save:
  // Each item: { id, file, previewUrl, name, status: 'staged'|'compressing'|'uploading'|'done'|'error', url?: string }
  const [stagedList, setStagedList] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Revoke object URLs on component unmount
  useEffect(() => {
    return () => {
      stagedList.forEach((item) => {
        if (item.previewUrl && item.previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });
    };
  }, [stagedList]);

  // Stage selected files locally (DO NOT upload yet)
  const handleFiles = (fileList) => {
    const files = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
    if (files.length === 0) return;

    const filesToStage = multiple ? files : [files[0]];

    // In single mode, clean up previous staged preview
    if (!multiple) {
      stagedList.forEach((it) => {
        if (it.previewUrl && it.previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(it.previewUrl);
        }
      });
    }

    const newItems = filesToStage.map((file, idx) => {
      const id = `stage-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 7)}`;
      const previewUrl = URL.createObjectURL(file);
      const name = cleanTitleFromFilename(file.name);
      return {
        id,
        file,
        previewUrl,
        name,
        status: 'staged',
        url: '',
      };
    });

    if (multiple) {
      setStagedList((prev) => [...prev, ...newItems]);
    } else {
      setStagedList(newItems);
    }
  };

  // Remove a staged item with cross icon
  const handleRemove = (itemId) => {
    setStagedList((prev) => {
      const found = prev.find((it) => it.id === itemId);
      if (found?.previewUrl && found.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(found.previewUrl);
      }
      return prev.filter((it) => it.id !== itemId);
    });
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer?.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Triggered when user clicks "Save" -> Compresses and uploads staged files
  const handleSaveAndUpload = async (e) => {
    if (e) e.preventDefault();

    // If editing and no new file was picked, submit the initial item directly
    if (!multiple && stagedList.length === 0 && initialItem?.url) {
      onSubmit?.([initialItem]);
      return;
    }

    if (stagedList.length === 0) {
      onNotify?.('Please select at least one photo.', 'error');
      return;
    }

    setIsUploading(true);
    const total = stagedList.length;
    setUploadProgress({ current: 0, total });

    const results = [];
    const compressionPreset = preset === 'logo' ? 'logo' : 'photo';

    for (let i = 0; i < stagedList.length; i++) {
      const item = stagedList[i];
      setUploadProgress({ current: i + 1, total });

      try {
        // 1. Mark item as compressing
        setStagedList((prev) =>
          prev.map((it) => (it.id === item.id ? { ...it, status: 'compressing' } : it))
        );

        // 2. Client-side compression
        const compressed = await compressImage(item.file, {
          preset: compressionPreset,
          maxWidth: preset === 'logo' ? 1200 : 1800,
          maxHeight: preset === 'logo' ? 1200 : 1800,
          quality: preset === 'logo' ? 0.9 : 0.84,
          outputFormat: 'webp',
        });

        // 3. Mark item as uploading to ImageKit CDN
        setStagedList((prev) =>
          prev.map((it) => (it.id === item.id ? { ...it, status: 'uploading' } : it))
        );

        const cleanExtName = item.file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
        const uploadResult = await uploadImageToImageKit(compressed.file, {
          fileName: `${preset}_${Date.now()}_${cleanExtName}.webp`,
          folder,
          tags: [preset, 'admin-save'],
        });

        if (!uploadResult?.url) {
          throw new Error('Upload succeeded but no delivery URL was returned.');
        }

        // 4. Mark item as done
        setStagedList((prev) =>
          prev.map((it) =>
            it.id === item.id ? { ...it, status: 'done', url: uploadResult.url } : it
          )
        );

        results.push({
          url: uploadResult.url,
          name: item.name,
          alt: item.name,
        });
      } catch (err) {
        console.error(`Failed to upload ${item.name}:`, err);
        setStagedList((prev) =>
          prev.map((it) =>
            it.id === item.id ? { ...it, status: 'error', errorMsg: err.message } : it
          )
        );
        onNotify?.(`Failed to upload ${item.name}: ${err.message}`, 'error');
      }
    }

    setIsUploading(false);

    if (results.length > 0) {
      onSubmit?.(results);
    }
  };

  const hasStaged = stagedList.length > 0;
  const hasExisting = !hasStaged && initialItem && initialItem.url;
  const doneCount = stagedList.filter((it) => it.status === 'done').length;

  return (
    <div className="space-y-3 select-none">
      {/* Header bar: Label & clean status pill showing count */}
      <div className="flex items-center justify-between">
        <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-deep-espresso">
          {label}
        </label>

        {/* Clean status indicator for how many images are staged / uploaded */}
        {isUploading ? (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1 animate-pulse">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Uploading {uploadProgress.current} of {uploadProgress.total}...</span>
          </span>
        ) : doneCount > 0 ? (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#E8F8EE] text-[#1EBE5D] border border-[#25D366]/30 flex items-center gap-1">
            <Check className="w-3 h-3" />
            <span>{doneCount} of {stagedList.length} uploaded</span>
          </span>
        ) : hasStaged ? (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FFF3F6] text-[#D6204E] border border-[#F0CDD7]">
            {stagedList.length} {stagedList.length === 1 ? 'image' : 'images'} selected
          </span>
        ) : null}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files);
          e.target.value = '';
        }}
        className="hidden"
      />

      {/* Dropzone (shown when empty or in multiple mode to add more) */}
      {(!hasExisting || multiple) && (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
            isDragging
              ? 'border-[#D6204E] bg-[#FFF0F4]'
              : 'border-[#F0CDD7] bg-[#FFFDFE] hover:border-[#D6204E] hover:bg-[#FFF8FA]'
          }`}
        >
          <div className="w-9 h-9 rounded-full bg-[#FFF3F6] border border-[#F0CDD7] flex items-center justify-center text-[#D6204E]">
            <UploadCloud className="w-4 h-4" />
          </div>
          <p className="text-xs font-semibold text-deep-espresso">
            {multiple
              ? stagedList.length > 0
                ? 'Choose more photos or drop here'
                : 'Choose photos or drop here'
              : 'Choose photo or drop here'}
          </p>
        </div>
      )}

      {/* Pre-existing single item (when editing an existing item and no new file staged) */}
      {hasExisting && !hasStaged && (
        <div className="flex items-center gap-3 p-2.5 rounded-xl border border-[#F0CDD7] bg-[#FFF8FA]">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-white border border-[#F0CDD7] shrink-0">
            <img
              src={initialItem.url}
              alt={initialItem.name || label}
              className="w-full h-full object-contain p-1"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-deep-espresso truncate">
              {initialItem.name || 'Current Photo'}
            </p>
            <p className="text-[10px] text-stone-500 font-mono truncate">{initialItem.url}</p>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-2.5 py-1 text-xs font-semibold text-deep-espresso bg-white hover:bg-stone-50 border border-stone-200 rounded-lg cursor-pointer shrink-0"
          >
            Change
          </button>
        </div>
      )}

      {/* Local Preview Grid of Staged Photos (Before saving, with Cross Icon) */}
      {hasStaged && (
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5 pt-1">
          {stagedList.map((item) => (
            <div
              key={item.id}
              className="relative rounded-xl border border-[#F0CDD7] bg-white overflow-hidden shadow-2xs group flex flex-col"
            >
              <div className="relative aspect-square w-full bg-[#FAF8F5] flex items-center justify-center overflow-hidden">
                <img
                  src={item.previewUrl}
                  alt={item.name}
                  className={`w-full h-full ${
                    preset === 'logo' ? 'object-contain p-2' : 'object-cover'
                  }`}
                />

                {/* Status Overlays during Save */}
                {item.status === 'compressing' && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-white gap-1">
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span className="text-[9px] font-semibold">Optimizing...</span>
                  </div>
                )}

                {item.status === 'uploading' && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-white gap-1">
                    <Loader2 className="w-4 h-4 animate-spin text-[#FFF3F6]" />
                    <span className="text-[9px] font-semibold">Uploading...</span>
                  </div>
                )}

                {item.status === 'done' && (
                  <div className="absolute top-1 left-1 bg-emerald-500/90 text-white rounded-full p-0.5 shadow-xs">
                    <Check className="w-3 h-3" />
                  </div>
                )}

                {item.status === 'error' && (
                  <div className="absolute inset-0 bg-rose-900/60 flex flex-col items-center justify-center text-white p-1 text-center">
                    <AlertCircle className="w-4 h-4 text-rose-200 mb-0.5" />
                    <span className="text-[9px] leading-tight text-rose-100">Failed</span>
                  </div>
                )}

                {/* Cross Icon to remove image (only enabled when not actively uploading) */}
                {!isUploading && (
                  <button
                    type="button"
                    onClick={() => handleRemove(item.id)}
                    className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-black transition-colors cursor-pointer"
                    title="Remove photo"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Optional Name Tag for Logos */}
              {showNameTag && item.name && (
                <div className="p-1.5 bg-[#FFFDFE] border-t border-[#F0CDD7]/60 text-center">
                  <span className="text-[10px] font-bold text-deep-espresso truncate block">
                    {item.name}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Save Action Bar */}
      <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isUploading}
            className="px-3.5 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 border border-stone-200 rounded-xl hover:bg-stone-50 cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
        )}

        <button
          type="button"
          onClick={handleSaveAndUpload}
          disabled={isUploading || (!hasStaged && !hasExisting)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-deep-espresso hover:bg-stone-800 disabled:opacity-50 disabled:pointer-events-none rounded-xl shadow-xs cursor-pointer active:scale-95 transition-all"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>
                Uploading ({uploadProgress.current}/{uploadProgress.total})...
              </span>
            </>
          ) : (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>
                {!multiple
                  ? `Save ${itemSingular}`
                  : stagedList.length > 1
                  ? `Save ${stagedList.length} ${itemPlural}`
                  : `Save ${itemSingular}`}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default MultiImageUploader;

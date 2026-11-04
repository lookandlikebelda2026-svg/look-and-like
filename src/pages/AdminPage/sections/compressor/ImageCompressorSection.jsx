import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  Sliders,
  Download,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  FileImage,

} from 'lucide-react';
import { compressImage, formatBytes, getImageDimensions } from '../../../../utils/imageCompressor';
import { uploadImageToImageKit } from '../../../../services/imagekit';

const DIMENSION_PRESETS = [
  { label: 'Original Dimensions (No Resize)', width: 0, height: 0 },
  { label: '1920px Full-HD (Lookbook Hero)', width: 1920, height: 1920 },
  { label: '1200px Editorial (Gallery Card)', width: 1200, height: 1200 },
  { label: '800px Mobile Responsive', width: 800, height: 800 },
  { label: '400px Brand Logo / Thumbnail', width: 400, height: 400 },
];

/**
 * ImageCompressorSection
 * High performance client-side image compression studio for admin users
 */
export function ImageCompressorSection({ onNotify }) {
  const [sourceFile, setSourceFile] = useState(null);
  const [sourcePreview, setSourcePreview] = useState(null);
  const [sourceDimensions, setSourceDimensions] = useState(null);

  // Settings
  const [maxWidth, setMaxWidth] = useState(1920);
  const [quality, setQuality] = useState(82);
  const [format, setFormat] = useState('image/webp'); // 'image/webp' | 'image/jpeg' | 'image/png'

  // Compression Output
  const [result, setResult] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Direct ImageKit Upload State
  const [isUploadingCdn, setIsUploadingCdn] = useState(false);
  const [uploadedCdnUrl, setUploadedCdnUrl] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const fileInputRef = useRef(null);

  // Handle incoming file selection
  const handleSelectFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      onNotify?.('Please select a valid image file (PNG, JPG, WebP, etc.)', 'error');
      return;
    }

    setSourceFile(file);
    setUploadedCdnUrl('');
    setIsCopied(false);

    // Create local object URL for preview
    const url = URL.createObjectURL(file);
    setSourcePreview(url);

    try {
      const dims = await getImageDimensions(file);
      setSourceDimensions(dims);
    } catch (e) {
      setSourceDimensions(null);
    }
  };

  // Re-compress whenever file or settings change
  useEffect(() => {
    if (!sourceFile) {
      setResult(null);
      return;
    }

    let isCurrent = true;
    setIsCompressing(true);

    const timer = setTimeout(async () => {
      try {
        const compressed = await compressImage(sourceFile, {
          maxWidth: maxWidth || undefined,
          maxHeight: maxWidth || undefined,
          quality: quality / 100,
          format,
        });

        if (isCurrent) {
          setResult(compressed);
          setIsCompressing(false);
        }
      } catch (err) {
        if (isCurrent) {
          setIsCompressing(false);
          onNotify?.(`Compression failed: ${err.message}`, 'error');
        }
      }
    }, 150);

    return () => {
      isCurrent = false;
      clearTimeout(timer);
    };
  }, [sourceFile, maxWidth, quality, format]);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (sourcePreview) URL.revokeObjectURL(sourcePreview);
    };
  }, [sourcePreview]);

  // Download compressed file
  const handleDownload = () => {
    if (!result?.blob || !result?.file) return;

    const link = document.createElement('a');
    link.href = URL.createObjectURL(result.blob);
    link.download = result.file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    onNotify?.(`Downloaded "${result.file.name}"`, 'success');
  };

  // Upload compressed file directly to ImageKit CDN
  const handleUploadToCdn = async () => {
    if (!result?.file) return;

    setIsUploadingCdn(true);
    setUploadedCdnUrl('');

    try {
      const res = await uploadImageToImageKit(result.file, {
        folder: '/compressed',
        tags: ['compressed', 'optimized'],
        fileName: result.file.name,
      });

      setUploadedCdnUrl(res.url);
      onNotify?.('Image successfully uploaded to ImageKit CDN!', 'success');
    } catch (err) {
      onNotify?.(`Failed to upload to ImageKit: ${err.message}`, 'error');
    } finally {
      setIsUploadingCdn(false);
    }
  };

  // Copy CDN URL to clipboard
  const handleCopyUrl = async () => {
    if (!uploadedCdnUrl) return;
    try {
      await navigator.clipboard.writeText(uploadedCdnUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
      onNotify?.('CDN URL copied to clipboard!', 'info');
    } catch (e) {
      onNotify?.('Failed to copy URL', 'error');
    }
  };

  const handleReset = () => {
    setSourceFile(null);
    setSourcePreview(null);
    setSourceDimensions(null);
    setResult(null);
    setUploadedCdnUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0CDD7]">
        <div>
          <div className="flex items-center gap-2">
            <Minimize2 className="w-5 h-5 text-[#D6204E]" />
            <h3 className="font-serif text-lg sm:text-xl font-bold text-deep-espresso">
              Studio Image Compressor
            </h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#FFF3F6] text-[#D6204E] border border-[#F0CDD7]">
              Client-Side WebP / JPG
            </span>
          </div>
          <p className="text-xs text-[#7A6B70] mt-1">
            Downscale, optimize pixel resolution and compress high-res salon photos in-browser before publishing to the Lookbook.
          </p>
        </div>

        {sourceFile && (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-xs font-medium text-stone-600 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Upload Another Photo</span>
          </button>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleSelectFile(file);
        }}
      />

      {!sourceFile ? (
        /* Empty Dropzone State */
        <div
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files?.[0];
            if (file) handleSelectFile(file);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-10 sm:p-16 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-4 ${
            dragOver
              ? 'border-[#D6204E] bg-[#FFF0F4]'
              : 'border-[#F0CDD7] bg-white hover:border-[#D6204E] hover:bg-[#FFF8FA]'
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-[#FFF3F6] border border-[#F0CDD7] flex items-center justify-center text-[#D6204E] shadow-sm">
            <UploadCloud className="w-8 h-8" />
          </div>

          <div className="max-w-md">
            <h4 className="font-serif text-base sm:text-lg font-bold text-deep-espresso">
              Select or Drop an Image to Compress
            </h4>
            <p className="text-xs text-[#7A6B70] mt-1.5">
              Supports ultra-high resolution DSLR photos, iPhone HEIC/PNG/JPG up to 25MB.
              Displays exact pixel dimensions and optimizes for zero-lag mobile loading.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D6204E] text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all active:scale-95"
          >
            <span>Browse Image File</span>
          </button>
        </div>
      ) : (
        /* Compressor Studio: Controls + Side-by-Side Comparison */
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#F0CDD7] shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-deep-espresso">
              <Sliders className="w-4 h-4 text-[#D6204E]" />
              <span>Compression &amp; Pixel Dimension Controls</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Max Dimension Preset */}
              <div>
                <label className="block text-xs font-bold text-deep-espresso mb-1">
                  Target Max Width (Pixels)
                </label>
                <select
                  value={maxWidth}
                  onChange={(e) => setMaxWidth(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#D6204E]/40 bg-white"
                >
                  {DIMENSION_PRESETS.map((p) => (
                    <option key={p.width} value={p.width}>
                      {p.label}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-stone-500 mt-1">
                  Limits the maximum dimension while keeping the exact aspect ratio.
                </p>
              </div>

              {/* Quality Slider */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-deep-espresso">
                    Compression Quality: <span className="text-[#D6204E]">{quality}%</span>
                  </label>
                  <span className="text-[10px] text-stone-500">
                    {quality >= 85 ? 'Studio High' : quality >= 70 ? 'Balanced' : 'High Efficiency'}
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="98"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-[#D6204E] cursor-pointer mt-1.5"
                />
                <div className="flex justify-between text-[9px] text-stone-400 mt-1">
                  <span>Smallest File (20%)</span>
                  <span>Balanced (80%)</span>
                  <span>Lossless (98%)</span>
                </div>
              </div>

              {/* Format Selector */}
              <div>
                <label className="block text-xs font-bold text-deep-espresso mb-1">
                  Target Output Format
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'image/webp', label: 'WebP', note: 'Best Web' },
                    { id: 'image/jpeg', label: 'JPEG', note: 'Standard' },
                    { id: 'image/png', label: 'PNG', note: 'Lossless' },
                  ].map((fmt) => (
                    <button
                      key={fmt.id}
                      type="button"
                      onClick={() => setFormat(fmt.id)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold flex flex-col items-center transition-all cursor-pointer ${
                        format === fmt.id
                          ? 'bg-[#D6204E] text-white shadow-2xs'
                          : 'bg-stone-50 text-stone-700 border border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <span>{fmt.label}</span>
                      <span className="text-[9px] font-normal opacity-80">{fmt.note}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Before & After Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Original Card */}
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs flex flex-col">
              <div className="p-3.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
                  Original Source Image
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-stone-200 text-stone-700">
                  {formatBytes(sourceFile.size)}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col items-center justify-center bg-stone-100/60 min-h-[260px] relative">
                {sourcePreview && (
                  <img
                    src={sourcePreview}
                    alt="Original preview"
                    className="max-h-[300px] w-auto max-w-full object-contain rounded-lg shadow-sm"
                  />
                )}
              </div>

              <div className="p-3.5 border-t border-stone-200 bg-white grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-stone-500 block font-sans">Resolution:</span>
                  <span className="font-bold text-deep-espresso">
                    {sourceDimensions
                      ? `${sourceDimensions.width} × ${sourceDimensions.height} px`
                      : 'Calculating...'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 block font-sans">File Size:</span>
                  <span className="font-bold text-stone-700">{formatBytes(sourceFile.size)}</span>
                </div>
              </div>
            </div>

            {/* Compressed Output Card */}
            <div className="bg-white rounded-2xl border-2 border-[#D6204E]/40 overflow-hidden shadow-sm flex flex-col">
              <div className="p-3.5 bg-[#FFF3F6] border-b border-[#F0CDD7] flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D6204E] flex items-center gap-1.5">

                  Compressed &amp; Optimized Image
                </span>
                {result && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-2xs">
                    Saved {result.savedPercent}% ({formatBytes(result.savedBytes)})
                  </span>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col items-center justify-center bg-[#FFF8FA] min-h-[260px] relative">
                {isCompressing ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 text-[#D6204E] animate-spin" />
                    <span className="text-xs font-semibold text-deep-espresso">
                      Compressing image...
                    </span>
                  </div>
                ) : result?.dataUrl ? (
                  <img
                    src={result.dataUrl}
                    alt="Compressed output preview"
                    className="max-h-[300px] w-auto max-w-full object-contain rounded-lg shadow-sm"
                  />
                ) : null}
              </div>

              <div className="p-3.5 border-t border-[#F0CDD7] bg-white grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-stone-500 block font-sans">New Resolution:</span>
                  <span className="font-bold text-emerald-600">
                    {result ? `${result.compressedWidth} × ${result.compressedHeight} px` : '...'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 block font-sans">Compressed Size:</span>
                  <span className="font-bold text-emerald-600">
                    {result ? formatBytes(result.compressedSize) : '...'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Hub */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#F0CDD7] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-center sm:text-left">
              <h5 className="text-xs font-bold text-deep-espresso">
                Ready to Publish or Save
              </h5>
              <p className="text-[11px] text-[#7A6B70]">
                Download optimized file to your device or upload straight to ImageKit CDN.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={handleDownload}
                disabled={!result || isCompressing}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-300 hover:border-deep-espresso bg-white text-xs font-semibold text-deep-espresso transition-all hover:bg-stone-50 disabled:opacity-50 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Optimized File</span>
              </button>

              <button
                type="button"
                onClick={handleUploadToCdn}
                disabled={!result || isCompressing || isUploadingCdn}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#D6204E] hover:bg-[#B81942] text-xs font-semibold text-white shadow-xs hover:shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isUploadingCdn ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading to CDN...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Upload to ImageKit CDN</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ImageKit Delivery URL Result Banner */}
          {uploadedCdnUrl && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
              <div className="flex items-center gap-2 min-w-0">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-emerald-900">
                    Live on ImageKit CDN
                  </p>
                  <p className="text-[11px] font-mono text-emerald-700 truncate max-w-md lg:max-w-xl">
                    {uploadedCdnUrl}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyUrl}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-emerald-300 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer shrink-0"
              >
                {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Copied!' : 'Copy CDN URL'}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ImageCompressorSection;


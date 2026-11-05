import React, { useState, useRef } from 'react';
import {
  Check,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  UploadCloud,
  Image as ImageIcon,
  X,
  Loader2,
  Sparkles,
  Layers,
} from 'lucide-react';
import { uploadImageToImageKit } from '../../../../services/imagekit';
import { compressImage } from '../../../../utils/imageCompressor';
import {
  MAIN_SERVICE_CATEGORIES,
} from '../../../../constants/services';

function SingleCategoryPhotoUploader({
  image = null,
  onImageChange,
  label = 'Cover Photo (1 Max)',
  onNotify,
  folder = '/services',
}) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const currentUrl = typeof image === 'string' ? image : image?.url || '';

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const compressed = await compressImage(file, {
        preset: 'photo',
        maxWidth: 1600,
        maxHeight: 1600,
        quality: 0.85,
        outputFormat: 'webp',
      });

      const uploadResult = await uploadImageToImageKit(compressed.file, {
        fileName: `service_${Date.now()}_${file.name.replace(/\.[^/.]+$/, '')}.webp`,
        folder,
        tags: ['service-photo'],
      });

      if (uploadResult?.url) {
        onImageChange({
          url: uploadResult.url,
          path: uploadResult.filePath || '',
          alt: file.name.replace(/\.[^/.]+$/, ''),
        });
        onNotify?.('Category photo uploaded!', 'success');
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      onNotify?.(err.message || 'Failed to upload photo.', 'error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-1 whitespace-nowrap">
        <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-deep-espresso flex items-center gap-1 shrink-0">
          <ImageIcon className="w-3.5 h-3.5 text-[#D6204E]" />
          <span>{label}</span>
        </label>
        <span className="text-[10px] text-stone-400 shrink-0">1 photo</span>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {currentUrl ? (
        <div className="relative w-full max-w-xs h-32 rounded-xl overflow-hidden border border-[#F0CDD7] bg-[#FFF3F6] group shadow-xs">
          <img src={currentUrl} alt={label} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1 bg-white text-xs font-semibold text-deep-espresso rounded-lg hover:bg-stone-100 cursor-pointer shadow-xs"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => onImageChange(null)}
              className="px-2.5 py-1 bg-rose-600 text-xs font-semibold text-white rounded-lg hover:bg-rose-700 cursor-pointer shadow-xs"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-dashed border-[#F0CDD7] bg-[#FFF3F6] hover:bg-[#FFE8EF] text-[#D6204E] font-semibold text-xs transition-colors cursor-pointer disabled:opacity-60 shadow-2xs"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Uploading photo...</span>
            </>
          ) : (
            <>
              <UploadCloud className="w-4 h-4" />
              <span>Upload Category Photo</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}

/**
 * ServiceForm Component
 * Inline modal/drawer form adhering to 4 main categories, 1 category image, 0 plan images, no placeholders, single line text.
 */
export function ServiceForm({
  isEditing,
  formData,
  onChange,
  onSubmit,
  onCancel,
  onNotify,
}) {
  const plans = formData.plans || [];

  const handleApplyPreset = (preset) => {
    onChange({
      ...formData,
      name: preset.name,
      description: preset.description,
      startingPrice: preset.startingPrice,
    });
  };

  const handleAddPlan = () => {
    const newPlan = {
      id: `plan-${Date.now()}-${plans.length + 1}`,
      name: '',
      description: '',
      images: [],
      startingPrice: 0,
      subplans: [
        { id: `subplan-${Date.now()}-basic`, name: 'Basic', price: 999 },
        { id: `subplan-${Date.now()}-mid`, name: 'Mid', price: 1499 },
        { id: `subplan-${Date.now()}-adv`, name: 'Advanced', price: 1999 },
      ],
    };
    onChange({ ...formData, plans: [...plans, newPlan] });
  };

  const handleUpdatePlan = (index, field, value) => {
    const updated = [...plans];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...formData, plans: updated });
  };

  const handleDeletePlan = (index) => {
    const updated = [...plans];
    updated.splice(index, 1);
    onChange({ ...formData, plans: updated });
  };

  const handleAddSubplan = (planIdx) => {
    const updated = [...plans];
    const subplans = updated[planIdx].subplans || [];
    const newSub = {
      id: `subplan-${Date.now()}-${subplans.length + 1}`,
      name: '',
      price: 0,
    };
    updated[planIdx] = { ...updated[planIdx], subplans: [...subplans, newSub] };
    onChange({ ...formData, plans: updated });
  };

  const handleUpdateSubplan = (planIdx, subIdx, field, value) => {
    const updated = [...plans];
    const subplans = [...(updated[planIdx].subplans || [])];
    subplans[subIdx] = {
      ...subplans[subIdx],
      [field]: field === 'price' ? Number(value) || 0 : value,
    };
    updated[planIdx] = { ...updated[planIdx], subplans };
    onChange({ ...formData, plans: updated });
  };

  const handleDeleteSubplan = (planIdx, subIdx) => {
    const updated = [...plans];
    const subplans = [...(updated[planIdx].subplans || [])];
    subplans.splice(subIdx, 1);
    updated[planIdx] = { ...updated[planIdx], subplans };
    onChange({ ...formData, plans: updated });
  };

  const currentCategoryImg = formData.images?.[0] || null;

  return (
    <form onSubmit={onSubmit} className="bg-white rounded-2xl border border-stone-200 p-3 sm:p-5 space-y-3.5">
      {/* 4 Main Categories Presets (No redundant input field) */}
      <div>
        <div className="flex items-center justify-between mb-1.5 whitespace-nowrap">
          <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-deep-espresso">
            Category <span className="text-rose-500">*</span>
          </label>
          <span className="text-[10px] text-stone-400">4 Categories</span>
        </div>
        <div className="grid grid-cols-4 gap-1">
          {MAIN_SERVICE_CATEGORIES.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className={`px-1 py-1.5 text-[10px] sm:text-xs font-bold rounded-lg border text-center transition-all cursor-pointer truncate ${
                (formData.name || 'Hair Care').toLowerCase() === preset.name.toLowerCase()
                  ? 'bg-[#FFF3F6] text-[#D6204E] border-[#F0CDD7] ring-1 ring-[#D6204E]/30 font-bold'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-[11px] sm:text-xs font-bold text-deep-espresso mb-1">
          Description (Optional)
        </label>
        <textarea
          rows={2}
          value={formData.description || ''}
          onChange={(e) => onChange({ ...formData, description: e.target.value })}
          className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-stone-200 bg-white"
        />
      </div>

      <div>
        <label className="block text-[11px] sm:text-xs font-bold text-deep-espresso mb-1">
          Starting Price (₹)
        </label>
        <input
          type="number"
          min="0"
          value={formData.startingPrice || ''}
          onChange={(e) => onChange({ ...formData, startingPrice: Number(e.target.value) || 0 })}
          className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-stone-200 bg-white"
        />
      </div>

      {/* Category Cover Image (Exactly 1, Upload only) */}
      <SingleCategoryPhotoUploader
        image={currentCategoryImg}
        onImageChange={(newImg) =>
          onChange({ ...formData, images: newImg ? [newImg] : [] })
        }
        label="Cover Photo (1 Max)"
        onNotify={onNotify}
        folder="/services"
      />

      {/* Plans Section (No images for plans) */}
      <div className="pt-2.5 border-t border-stone-100 space-y-2.5">
        <div className="flex items-center justify-between whitespace-nowrap">
          <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-deep-espresso flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-[#D6204E]" />
            <span>Plans &amp; Subplans ({plans.length})</span>
          </h4>
          <button
            type="button"
            onClick={handleAddPlan}
            className="inline-flex items-center gap-0.5 text-[11px] font-bold text-[#D6204E] hover:underline cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>Add Plan</span>
          </button>
        </div>

        {plans.length > 0 && (
          <div className="space-y-2.5">
            {plans.map((plan, pIdx) => (
              <div key={plan.id || pIdx} className="bg-[#FAF8F5] p-2.5 rounded-xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-deep-espresso">
                    Plan #{pIdx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeletePlan(pIdx)}
                    className="p-1 text-stone-400 hover:text-rose-600 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-deep-espresso mb-0.5">
                      Plan Name
                    </label>
                    <input
                      type="text"
                      required
                      value={plan.name || ''}
                      onChange={(e) => handleUpdatePlan(pIdx, 'name', e.target.value)}
                      className="w-full px-2 py-1 text-xs rounded-lg border border-stone-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-deep-espresso mb-0.5">
                      Starting Price (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={plan.startingPrice || ''}
                      onChange={(e) => handleUpdatePlan(pIdx, 'startingPrice', Number(e.target.value) || 0)}
                      className="w-full px-2 py-1 text-xs rounded-lg border border-stone-200 bg-white"
                    />
                  </div>
                </div>

                {/* Subplans List (No images) */}
                <div className="space-y-1 pt-1 border-t border-stone-200">
                  <div className="flex items-center justify-between whitespace-nowrap">
                    <span className="text-[10px] font-semibold text-stone-600">
                      Options ({plan.subplans?.length || 0})
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAddSubplan(pIdx)}
                      className="text-[10px] font-bold text-[#D6204E] hover:underline cursor-pointer"
                    >
                      + Add Option
                    </button>
                  </div>

                  {(plan.subplans || []).map((sub, sIdx) => (
                    <div key={sub.id || sIdx} className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-stone-200">
                      <span className="text-[9px] font-bold text-stone-400 w-3 text-center shrink-0">
                        #{sIdx + 1}
                      </span>
                      <input
                        type="text"
                        required
                        value={sub.name || ''}
                        onChange={(e) => handleUpdateSubplan(pIdx, sIdx, 'name', e.target.value)}
                        className="flex-1 min-w-0 px-2 py-1 text-xs rounded-lg border border-stone-200 bg-white"
                      />
                      <div className="relative w-20 shrink-0">
                        <span className="absolute left-1.5 top-1 text-[10px] text-stone-400">₹</span>
                        <input
                          type="number"
                          required
                          min="0"
                          value={sub.price ?? ''}
                          onChange={(e) => handleUpdateSubplan(pIdx, sIdx, 'price', e.target.value)}
                          className="w-full pl-4 pr-1 py-1 text-xs font-bold text-[#D6204E] rounded-lg border border-stone-200 bg-white"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteSubplan(pIdx, sIdx)}
                        className="p-1 text-stone-400 hover:text-rose-600 cursor-pointer shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-2 pt-2.5 border-t border-stone-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 border border-stone-200 rounded-xl hover:bg-stone-50 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center gap-1 px-4 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-[#D6204E] to-[#B81942] rounded-xl shadow-xs cursor-pointer"
        >
          <Check className="w-3.5 h-3.5" />
          <span>{isEditing ? 'Save Changes' : 'Create Service'}</span>
        </button>
      </div>
    </form>
  );
}

export default ServiceForm;

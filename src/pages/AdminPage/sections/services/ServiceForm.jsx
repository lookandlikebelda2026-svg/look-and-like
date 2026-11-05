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
import { normalizeServiceImages } from '../../../../constants/services';

const PRESET_SUGGESTIONS = [
  { name: 'Skin Care', description: 'Facials, Cleanups, Anti-Aging & More', startingPrice: 1999 },
  { name: 'Hair Care', description: 'Haircuts, Styling, Spa, Smoothening & More', startingPrice: 1499 },
  { name: 'Nail Care', description: 'Manicure, Pedicure, Nail Art & More', startingPrice: 999 },
  { name: 'Make Up', description: 'Bridal, Party, HD Makeup & More', startingPrice: 3999 },
  { name: 'Spa Wellness', description: 'Japanese warm oil head spa and aromatic body therapy', startingPrice: 1899 },
];

/**
 * Reusable Multiple Image Manager Component
 */
function MultipleImageManager({
  images = [],
  onAddImage,
  onRemoveImage,
  label = 'Photos',
  onNotify,
  folder = '/services',
}) {
  const [urlInput, setUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleAddUrl = (e) => {
    e.preventDefault();
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      onNotify?.('Please enter a valid image URL starting with http:// or https://', 'error');
      return;
    }
    onAddImage({ url: trimmed, path: '', alt: label });
    setUrlInput('');
  };

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
        onAddImage({
          url: uploadResult.url,
          path: uploadResult.filePath || '',
          alt: file.name.replace(/\.[^/.]+$/, ''),
        });
        onNotify?.('Photo uploaded!', 'success');
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
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-deep-espresso flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-[#D6204E]" />
          <span>{label} ({images.length})</span>
        </label>
      </div>

      {images.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 bg-[#FAF8F5] rounded-xl border border-stone-200">
          {images.map((img, idx) => {
            const imgUrl = typeof img === 'string' ? img : img.url;
            return (
              <div
                key={idx}
                className="relative w-14 h-14 rounded-lg overflow-hidden border border-stone-200 bg-white group shrink-0 shadow-2xs"
              >
                <img
                  src={imgUrl}
                  alt={img.alt || `Photo ${idx + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <button
                  type="button"
                  onClick={() => onRemoveImage(idx)}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex-1 min-w-[180px] flex items-center gap-1">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Paste image URL (https://...)"
            className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-stone-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#D6204E]"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            disabled={!urlInput.trim()}
            className="px-2.5 py-1.5 text-xs font-semibold text-deep-espresso bg-stone-100 hover:bg-stone-200 disabled:opacity-40 rounded-lg cursor-pointer transition-colors"
          >
            Add
          </button>
        </div>

        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#D6204E] bg-[#FFF3F6] hover:bg-[#FFE8EF] border border-[#F0CDD7] rounded-lg transition-colors cursor-pointer disabled:opacity-60"
          >
            {isUploading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <UploadCloud className="w-3.5 h-3.5" />
            )}
            <span>Upload</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * ServiceForm Component
 * Adapts to hierarchical Service -> Plans -> Subplans structure.
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

  // Service Images
  const handleAddServiceImage = (newImg) => {
    onChange({
      ...formData,
      images: [...(formData.images || []), newImg],
    });
  };

  const handleRemoveServiceImage = (idx) => {
    const updated = [...(formData.images || [])];
    updated.splice(idx, 1);
    onChange({ ...formData, images: updated });
  };

  // Plans Management
  const handleAddPlan = () => {
    const newPlanId = `plan-${Date.now()}-${plans.length + 1}`;
    const newPlan = {
      id: newPlanId,
      name: '',
      description: '',
      images: [],
      startingPrice: 0,
      subplans: [
        { id: `sub-${Date.now()}-basic`, name: 'Basic', price: 999 },
        { id: `sub-${Date.now()}-mid`, name: 'Mid', price: 1499 },
        { id: `sub-${Date.now()}-adv`, name: 'Advanced', price: 1999 },
      ],
    };
    onChange({ ...formData, plans: [...plans, newPlan] });
  };

  const handleUpdatePlan = (pIdx, field, val) => {
    const updated = [...plans];
    if (updated[pIdx]) {
      updated[pIdx] = { ...updated[pIdx], [field]: val };
      onChange({ ...formData, plans: updated });
    }
  };

  const handleDeletePlan = (pIdx) => {
    const planName = plans[pIdx]?.name || `Plan #${pIdx + 1}`;
    if (!window.confirm(`Delete plan "${planName}"?`)) return;
    const updated = [...plans];
    updated.splice(pIdx, 1);
    onChange({ ...formData, plans: updated });
    onNotify?.(`Removed "${planName}".`, 'info');
  };

  const handleMovePlan = (pIdx, dir) => {
    const targetIdx = pIdx + dir;
    if (targetIdx < 0 || targetIdx >= plans.length) return;
    const updated = [...plans];
    const [moved] = updated.splice(pIdx, 1);
    updated.splice(targetIdx, 0, moved);
    onChange({ ...formData, plans: updated });
  };

  // Subplans Management
  const handleAddSubplan = (pIdx) => {
    const updated = [...plans];
    if (updated[pIdx]) {
      const subs = updated[pIdx].subplans || [];
      const newSub = { id: `sub-${Date.now()}-${subs.length + 1}`, name: '', price: 0 };
      updated[pIdx] = { ...updated[pIdx], subplans: [...subs, newSub] };
      onChange({ ...formData, plans: updated });
    }
  };

  const handleUpdateSubplan = (pIdx, sIdx, field, val) => {
    const updated = [...plans];
    if (updated[pIdx]?.subplans?.[sIdx]) {
      const subs = [...updated[pIdx].subplans];
      subs[sIdx] = {
        ...subs[sIdx],
        [field]: field === 'price' ? Number(val) || 0 : val,
      };
      updated[pIdx] = { ...updated[pIdx], subplans: subs };
      onChange({ ...formData, plans: updated });
    }
  };

  const handleDeleteSubplan = (pIdx, sIdx) => {
    const subName = plans[pIdx]?.subplans?.[sIdx]?.name || 'subplan';
    if (!window.confirm(`Delete "${subName}"?`)) return;
    const updated = [...plans];
    if (updated[pIdx]?.subplans) {
      const subs = [...updated[pIdx].subplans];
      subs.splice(sIdx, 1);
      updated[pIdx] = { ...updated[pIdx], subplans: subs };
      onChange({ ...formData, plans: updated });
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="mb-8 p-5 sm:p-7 rounded-3xl bg-white border border-[#F0CDD7] shadow-md space-y-6"
    >
      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
        <div>
          <h4 className="text-base font-serif font-bold text-deep-espresso">
            {isEditing ? 'Edit Service' : 'Add New Service'}
          </h4>
          <p className="text-xs text-[#7A6B70] mt-0.5">
            Configure service details, hierarchical plans, and subplan pricing.
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="text-stone-400 hover:text-stone-700 text-xs font-semibold cursor-pointer"
        >
          Cancel
        </button>
      </div>

      {/* SECTION 1: Service Primary Details */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-deep-espresso uppercase tracking-wider">
              Service Name <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] text-stone-400">Suggestions:</span>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {PRESET_SUGGESTIONS.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition-all cursor-pointer ${
                  formData.name === p.name
                    ? 'bg-[#FFF3F6] text-[#D6204E] border-[#F0CDD7] shadow-2xs'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>

          <input
            type="text"
            required
            value={formData.name || ''}
            onChange={(e) => onChange({ ...formData, name: e.target.value })}
            placeholder="e.g. Skin Care"
            className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#D6204E]/40"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-deep-espresso mb-1">
            Service Description
          </label>
          <textarea
            rows={2}
            value={formData.description || ''}
            onChange={(e) => onChange({ ...formData, description: e.target.value })}
            placeholder="Service overview description..."
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#D6204E]/40"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-deep-espresso mb-1">
            Service Starting Price (₹)
          </label>
          <input
            type="number"
            min="0"
            value={formData.startingPrice || ''}
            onChange={(e) => onChange({ ...formData, startingPrice: Number(e.target.value) || 0 })}
            placeholder="1999"
            className="w-full px-3.5 py-2 text-xs font-semibold text-deep-espresso rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#D6204E]/40"
          />
        </div>

        {/* Service Images */}
        <MultipleImageManager
          images={formData.images || []}
          onAddImage={handleAddServiceImage}
          onRemoveImage={handleRemoveServiceImage}
          label="Service Images"
          onNotify={onNotify}
          folder="/services"
        />
      </div>

      {/* SECTION 2: Plans & Subplans Management */}
      <div className="space-y-4 pt-4 border-t border-stone-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#D6204E]" />
            <h5 className="font-serif text-sm font-bold text-deep-espresso">
              Plans &amp; Subplans ({plans.length})
            </h5>
          </div>
          <button
            type="button"
            onClick={handleAddPlan}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-deep-espresso hover:bg-stone-800 rounded-xl cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Plan</span>
          </button>
        </div>

        {plans.length === 0 ? (
          <p className="text-xs text-stone-400 italic">No plans configured yet. Click Add Plan to create one.</p>
        ) : (
          <div className="space-y-4">
            {plans.map((plan, pIdx) => {
              const subplans = plan.subplans || [];
              return (
                <div key={plan.id || pIdx} className="p-4 rounded-2xl bg-[#FFFCFB] border border-[#F0CDD7] space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#F0CDD7]/50">
                    <span className="text-xs font-bold text-[#D6204E]">
                      Plan #{pIdx + 1}: {plan.name || 'Untitled Plan'}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMovePlan(pIdx, -1)}
                        disabled={pIdx === 0}
                        className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-20 cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMovePlan(pIdx, 1)}
                        disabled={pIdx === plans.length - 1}
                        className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-20 cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePlan(pIdx)}
                        className="p-1 text-stone-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        required
                        value={plan.name || ''}
                        onChange={(e) => handleUpdatePlan(pIdx, 'name', e.target.value)}
                        placeholder="Plan Name (e.g. Signature Radiance Glow Facial)"
                        className="w-full px-3 py-1.5 text-xs font-semibold rounded-lg border border-stone-200 bg-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <textarea
                        rows={1}
                        value={plan.description || ''}
                        onChange={(e) => handleUpdatePlan(pIdx, 'description', e.target.value)}
                        placeholder="Plan description..."
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-stone-600 mb-0.5">
                        Plan Starting Price (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={plan.startingPrice || ''}
                        onChange={(e) => handleUpdatePlan(pIdx, 'startingPrice', Number(e.target.value) || 0)}
                        placeholder="1999"
                        className="w-full px-3 py-1.5 text-xs font-semibold rounded-lg border border-stone-200 bg-white"
                      />
                    </div>
                  </div>

                  {/* Subplans nested in plan */}
                  <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase text-deep-espresso">
                        Subplan Options ({subplans.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAddSubplan(pIdx)}
                        className="text-[11px] font-semibold text-[#D6204E] hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Option</span>
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      {subplans.map((sub, sIdx) => (
                        <div key={sub.id || sIdx} className="flex items-center gap-2">
                          <input
                            type="text"
                            required
                            value={sub.name || ''}
                            onChange={(e) => handleUpdateSubplan(pIdx, sIdx, 'name', e.target.value)}
                            placeholder="Option Name (e.g. Basic)"
                            className="flex-1 px-2.5 py-1 text-xs rounded-lg border border-stone-200 bg-white"
                          />
                          <div className="relative w-28">
                            <span className="absolute left-2 top-1 text-xs text-stone-400">₹</span>
                            <input
                              type="number"
                              required
                              min="0"
                              value={sub.price || ''}
                              onChange={(e) => handleUpdateSubplan(pIdx, sIdx, 'price', e.target.value)}
                              placeholder="Price"
                              className="w-full pl-5 pr-2 py-1 text-xs font-semibold rounded-lg border border-stone-200 bg-white"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteSubplan(pIdx, sIdx)}
                            className="p-1 text-stone-400 hover:text-rose-600 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Plan Images */}
                  <MultipleImageManager
                    images={plan.images || []}
                    onAddImage={(newImg) => {
                      const updated = [...plans];
                      updated[pIdx] = {
                        ...updated[pIdx],
                        images: [...(updated[pIdx].images || []), newImg],
                      };
                      onChange({ ...formData, plans: updated });
                    }}
                    onRemoveImage={(imgIdx) => {
                      const updated = [...plans];
                      const curImgs = [...(updated[pIdx].images || [])];
                      curImgs.splice(imgIdx, 1);
                      updated[pIdx] = { ...updated[pIdx], images: curImgs };
                      onChange({ ...formData, plans: updated });
                    }}
                    label="Plan Photos"
                    onNotify={onNotify}
                    folder="/services/plans"
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2 pt-4 border-t border-stone-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 border border-stone-200 rounded-xl hover:bg-stone-50 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#D6204E] to-[#B81942] hover:from-[#B81942] hover:to-[#961234] rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <Check className="w-4 h-4" />
          <span>{isEditing ? 'Save Changes' : 'Create Service'}</span>
        </button>
      </div>
    </form>
  );
}

export default ServiceForm;

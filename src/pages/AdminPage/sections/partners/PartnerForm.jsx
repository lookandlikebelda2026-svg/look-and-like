import React, { useState, useEffect } from 'react';
import { Briefcase, Check } from 'lucide-react';
import { ImageKitUploader } from '../../../../components/common/ImageKitUploader';

/**
 * Add / Edit Brand Partner Form
 */
export function PartnerForm({
  isEditing,
  formData,
  onChange,
  onSubmit,
  onCancel,
  onNotify,
}) {
  const [pixelSize, setPixelSize] = useState(null);

  useEffect(() => {
    if (!formData.logoUrl) {
      setPixelSize(null);
      return;
    }
    const img = new Image();
    img.onload = () => setPixelSize(`${img.naturalWidth} × ${img.naturalHeight} px`);
    img.onerror = () => setPixelSize(null);
    img.src = formData.logoUrl;
  }, [formData.logoUrl]);
  return (
    <form
      onSubmit={onSubmit}
      className="mb-6 p-4 sm:p-5 rounded-2xl bg-white border border-[#F0CDD7] shadow-sm space-y-4"
    >
      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
        <h5 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#D6204E]">
          {isEditing ? 'Edit Brand Partner' : 'Add New Brand Partner'}
        </h5>
        <button
          type="button"
          onClick={onCancel}
          className="text-stone-400 hover:text-stone-700 text-xs font-semibold cursor-pointer"
        >
          Cancel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Live Preview Column */}
        <div className="flex flex-col items-center justify-center border border-dashed border-stone-300 rounded-xl bg-[#FAF8F5] p-3 min-h-[140px]">
          {formData.logoUrl ? (
            <div className="w-32 h-16 bg-white rounded-xl border border-stone-200 p-2 flex items-center justify-center shadow-xs">
              <img
                src={formData.logoUrl}
                alt="Logo preview"
                className="max-h-8 max-w-[100px] object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  if (e.currentTarget.nextElementSibling) {
                    e.currentTarget.nextElementSibling.style.display = 'block';
                  }
                }}
              />
              <span className="hidden text-xs font-bold uppercase text-deep-espresso">
                {formData.name || 'Brand Logo'}
              </span>
            </div>
          ) : (
            <div className="text-center p-3 text-stone-400">
              <Briefcase className="w-8 h-8 mx-auto mb-1 opacity-50" />
              <span className="text-[11px] block">Logo Preview</span>
            </div>
          )}
          <span className="text-[10px] text-stone-500 mt-2 font-medium">
            {formData.name || 'Brand Name'}
          </span>
          {pixelSize && (
            <span className="text-[10px] font-mono text-stone-500 font-medium">
              Logo: <strong className="text-[#D6204E]">{pixelSize}</strong>
            </span>
          )}
        </div>

        {/* Inputs Column */}
        <div className="md:col-span-2 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-deep-espresso mb-1">
                Brand Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => onChange({ ...formData, name: e.target.value })}
                placeholder="e.g. KÉRASTASE"
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#D6204E]/40"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-deep-espresso mb-1">
                Origin / Country
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => onChange({ ...formData, country: e.target.value })}
                placeholder="e.g. Paris"
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#D6204E]/40"
              />
            </div>
          </div>

          <ImageKitUploader
            value={formData.logoUrl}
            onChange={(url) => onChange({ ...formData, logoUrl: url })}
            folder="/partners"
            preset="logo"
            tags={['partners', 'logo']}
            label="Brand Logo Photo"
            helpText="Upload brand logo (SVG, PNG or WEBP with transparency)"
            onNotify={onNotify}
          />

          <div>
            <label className="block text-xs font-bold text-deep-espresso mb-1">
              Treatment Specialty / Protocol
            </label>
            <input
              type="text"
              value={formData.specialty}
              onChange={(e) => onChange({ ...formData, specialty: e.target.value })}
              placeholder="e.g. Molecular Bond Restoration"
              className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#D6204E]/40"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-deep-espresso hover:bg-stone-800 rounded-lg shadow-xs cursor-pointer active:scale-95"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Update Partner' : 'Save Partner'}</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default PartnerForm;


import React from 'react';
import { Check } from 'lucide-react';
import { ImageKitUploader } from '../../../../components/common/ImageKitUploader';

/**
 * Add / Edit Brand Partner Form
 * Clean, compact full-width layout relying on ImageKitUploader's integrated logo preview.
 */
export function PartnerForm({
  isEditing,
  formData,
  onChange,
  onSubmit,
  onCancel,
  onNotify,
}) {
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

      <div className="space-y-3.5">
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
    </form>
  );
}

export default PartnerForm;

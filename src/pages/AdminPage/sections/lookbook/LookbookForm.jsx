import React from 'react';
import { Check } from 'lucide-react';
import { ImageKitUploader } from '../../../../components/common/ImageKitUploader';

/**
 * Add / Edit Lookbook Item Form
 * Clean, compact full-width layout relying on ImageKitUploader's integrated thumbnail preview.
 */
export function LookbookForm({
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
          {isEditing ? 'Edit Lookbook Image' : 'Add New Lookbook Image'}
        </h5>
        <button
          type="button"
          onClick={onCancel}
          className="text-stone-400 hover:text-stone-700 text-xs font-semibold cursor-pointer"
        >
          Cancel
        </button>
      </div>

      <div className="space-y-4">
        <ImageKitUploader
          value={formData.imageUrl}
          onChange={(url) => onChange({ ...formData, imageUrl: url })}
          preset="photo"
          folder="/lookbook"
          tags={['lookbook', 'editorial']}
          label="Lookbook Photo"
          helpText="Upload PNG, JPG or WEBP directly to ImageKit CDN"
          onNotify={onNotify}
        />

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-deep-espresso hover:bg-stone-800 rounded-lg shadow-xs cursor-pointer active:scale-95"
          >
            <Check className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Update Look' : 'Save New Look'}</span>
          </button>
        </div>
      </div>
    </form>
  );
}

export default LookbookForm;

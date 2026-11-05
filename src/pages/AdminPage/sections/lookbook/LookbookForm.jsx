import React from 'react';
import { MultiImageUploader } from '../common/MultiImageUploader';

/**
 * Add / Edit Lookbook Item Form
 * Stages photos locally with cross icon preview, compressing and uploading to ImageKit only when saved.
 */
export function LookbookForm({
  isEditing,
  formData,
  onSubmit,
  onCancel,
  onNotify,
}) {
  return (
    <div className="mb-4 sm:mb-6 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-white border border-[#F0CDD7] shadow-xs space-y-3.5">
      <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
        <h5 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#D6204E]">
          {isEditing ? 'Edit Look' : 'Add Lookbook Photos'}
        </h5>
        <button
          type="button"
          onClick={onCancel}
          className="text-stone-400 hover:text-stone-700 text-xs font-semibold cursor-pointer"
        >
          Cancel
        </button>
      </div>

      <MultiImageUploader
        folder="/lookbook"
        preset="photo"
        label="Lookbook Photos"
        itemSingular="Look"
        itemPlural="Looks"
        multiple={!isEditing}
        initialItem={
          isEditing && formData?.imageUrl
            ? { url: formData.imageUrl, name: formData.alt || 'Look' }
            : null
        }
        onSubmit={onSubmit}
        onCancel={onCancel}
        onNotify={onNotify}
      />
    </div>
  );
}

export default LookbookForm;

import React from 'react';
import { MultiImageUploader } from '../common/MultiImageUploader';

/**
 * Add / Edit Brand Partner Form
 * Stages logo images locally with cross icon preview, compressing and uploading to ImageKit only when saved.
 */
export function PartnerForm({
  isEditing,
  formData,
  onSubmit,
  onCancel,
  onNotify,
}) {
  return (
    <div className="mb-4 sm:mb-6 p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-white border border-[#F0CDD7] shadow-xs space-y-3">
      <div className="flex items-center justify-between border-b border-stone-100 pb-2">
        <h5 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#D6204E] truncate">
          {isEditing ? 'Edit Partner Logo' : 'Add Brand Partners'}
        </h5>
        <button
          type="button"
          onClick={onCancel}
          className="text-stone-400 hover:text-stone-700 text-xs font-semibold cursor-pointer shrink-0"
        >
          Cancel
        </button>
      </div>

      <MultiImageUploader
        folder="/partners"
        preset="logo"
        label="Brand Logos"
        itemSingular="Partner"
        itemPlural="Partners"
        multiple={!isEditing}
        showNameTag={false}
        initialItem={
          isEditing && formData?.logoUrl
            ? { url: formData.logoUrl, name: 'Brand Partner' }
            : null
        }
        onSubmit={onSubmit}
        onCancel={onCancel}
        onNotify={onNotify}
      />
    </div>
  );
}

export default PartnerForm;

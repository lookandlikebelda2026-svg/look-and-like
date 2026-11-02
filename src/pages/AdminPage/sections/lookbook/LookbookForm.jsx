import React from 'react';
import { Image as ImageIcon, Check } from 'lucide-react';
import { ImageKitUploader } from '../../../../components/common/ImageKitUploader';

/**
 * Add / Edit Lookbook Item Form
 */
export function LookbookForm({
  isEditing,
  formData,
  onChange,
  onSubmit,
  onCancel,
}) {
  const PRESET_SAMPLES = [
    {
      name: 'Bridal Glow',
      imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
      alt: 'Editorial Glow Treatment',
    },
    {
      name: 'Hair Studio',
      imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
      alt: 'Haute Salon Styling',
    },
  ];

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Live Preview Column */}
        <div className="flex flex-col items-center justify-center border border-dashed border-stone-300 rounded-xl bg-stone-50 p-2 min-h-[140px] overflow-hidden">
          {formData.imageUrl ? (
            <img
              src={formData.imageUrl}
              alt="Preview"
              className="w-full h-36 object-cover rounded-lg shadow-2xs"
              onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/400x500/F0CDD7/D6204E?text=Invalid+Image+URL';
              }}
            />
          ) : (
            <div className="text-center p-3 text-stone-400">
              <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
              <span className="text-[11px] block">Image Preview</span>
            </div>
          )}
        </div>

        {/* Inputs Column */}
        <div className="md:col-span-2 space-y-3">
          <ImageKitUploader
            value={formData.imageUrl}
            onChange={(url) => onChange({ ...formData, imageUrl: url })}
            folder="/lookbook"
            tags={['lookbook', 'editorial']}
            label="Lookbook Photo"
            helpText="Upload PNG, JPG or WEBP directly to ImageKit CDN"
          />

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-stone-500">Preset Samples:</span>
            {PRESET_SAMPLES.map((preset, index) => (
              <React.Fragment key={preset.name}>
                {index > 0 && <span>·</span>}
                <button
                  type="button"
                  onClick={() => onChange({
                    ...formData,
                    imageUrl: preset.imageUrl,
                    alt: preset.alt,
                  })}
                  className="text-[10px] text-[#D6204E] hover:underline cursor-pointer"
                >
                  {preset.name}
                </button>
              </React.Fragment>
            ))}
          </div>

          <div>
            <label className="block text-xs font-bold text-deep-espresso mb-1">
              Alt &amp; Styling Description
            </label>
            <input
              type="text"
              value={formData.alt}
              onChange={(e) => onChange({ ...formData, alt: e.target.value })}
              placeholder="e.g. Bespoke bridal veil & floral crown styling"
              className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#D6204E]/40"
            />
          </div>

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
      </div>
    </form>
  );
}

export default LookbookForm;


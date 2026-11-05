import React, { useState } from 'react';
import { Plus, RotateCcw, Image as ImageIcon } from 'lucide-react';
import { LookbookForm } from './LookbookForm';
import { LookbookCard } from './LookbookCard';

/**
 * Section for managing Lookbook Editorial Images ("Get Inspired")
 */
export function LookbookSection({
  inspiredImages = [],
  saveInspiredImages,
  resetInspiredImages,
  onNotify,
}) {
  const [editingInspired, setEditingInspired] = useState(null);
  const [isAddingInspired, setIsAddingInspired] = useState(false);
  const [inspiredForm, setInspiredForm] = useState({ imageUrl: '', alt: '' });

  const handleOpenAdd = () => {
    setInspiredForm({ imageUrl: '', alt: '' });
    setIsAddingInspired(true);
    setEditingInspired(null);
  };

  const handleOpenEdit = (item, index) => {
    setEditingInspired({ item, index });
    setIsAddingInspired(false);
    setInspiredForm({
      imageUrl: item.imageUrl || '',
      alt: item.alt || '',
    });
  };

  const handleCloseForm = () => {
    setIsAddingInspired(false);
    setEditingInspired(null);
  };

  const handleSaveForm = (items) => {
    if (!items || items.length === 0) {
      onNotify?.('Please provide at least one photo.', 'error');
      return;
    }

    if (editingInspired !== null) {
      const single = items[0];
      const updatedList = [...inspiredImages];
      updatedList[editingInspired.index] = {
        id: editingInspired.item.id || `inspired-${Date.now()}`,
        imageUrl: single.imageUrl || single.url,
        alt: single.alt || single.name || 'Look & Like Lookbook Look',
      };
      saveInspiredImages(updatedList);
      onNotify?.('Lookbook updated!', 'success');
    } else {
      const newItems = items.map((item, idx) => ({
        id: `inspired-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
        imageUrl: item.imageUrl || item.url,
        alt: item.alt || item.name || 'Look & Like Lookbook Look',
      }));
      const updatedList = [...inspiredImages, ...newItems];
      saveInspiredImages(updatedList);
      onNotify?.(
        `${newItems.length} ${newItems.length === 1 ? 'look' : 'looks'} added!`,
        'success'
      );
    }

    handleCloseForm();
  };

  const handleDelete = (index) => {
    if (window.confirm('Delete this lookbook image?')) {
      const updatedList = inspiredImages.filter((_, i) => i !== index);
      saveInspiredImages(updatedList);
      onNotify?.('Image deleted.', 'info');
    }
  };

  const handleMove = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= inspiredImages.length) return;
    const updatedList = [...inspiredImages];
    const [moved] = updatedList.splice(index, 1);
    updatedList.splice(targetIdx, 0, moved);
    saveInspiredImages(updatedList);
  };

  const handleReset = () => {
    if (window.confirm('Clear all lookbook editorial images?')) {
      resetInspiredImages();
      onNotify?.('Cleared lookbook.', 'info');
    }
  };

  const isFormOpen = isAddingInspired || editingInspired !== null;

  return (
    <div>
      {/* Action Bar */}
      <div className="flex items-center justify-between gap-2 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-[#F0CDD7]">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-serif text-base sm:text-lg font-bold text-deep-espresso truncate">
              Lookbook Photos
            </h4>
            <span className="text-[10px] sm:text-[11px] font-semibold text-[#D6204E] bg-[#FFF3F6] border border-[#F0CDD7] px-2 py-0.5 rounded-full shrink-0">
              {inspiredImages.length} {inspiredImages.length === 1 ? 'Look' : 'Looks'}
            </span>
          </div>
          <p className="hidden sm:block text-xs text-[#7A6B70] mt-0.5">
            Images display in the inspiration masonry and peek carousel.
          </p>
        </div>

        {/* Hide Add button when form/model is open */}
        {!isFormOpen && (
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#D6204E] to-[#B81942] hover:from-[#B81942] hover:to-[#961234] rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Look</span>
            </button>
          </div>
        )}
      </div>

      {/* Add / Edit Form */}
      {isFormOpen && (
        <LookbookForm
          isEditing={editingInspired !== null}
          formData={inspiredForm}
          onSubmit={handleSaveForm}
          onCancel={handleCloseForm}
          onNotify={onNotify}
        />
      )}

      {/* Looks Grid or Empty State (Do not render empty state card when form is open) */}
      {inspiredImages.length === 0 ? (
        !isFormOpen && (
          <div className="text-center py-12 sm:py-16 px-4 bg-white rounded-2xl sm:rounded-3xl border border-dashed border-stone-200 shadow-2xs">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#FFF3F6] border border-[#F0CDD7] flex items-center justify-center mx-auto mb-3 text-[#D6204E]">
              <ImageIcon className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h5 className="font-serif text-base sm:text-lg font-bold text-deep-espresso mb-1">
              No Lookbook Photos Yet
            </h5>
            <p className="text-xs text-[#7A6B70] max-w-sm mx-auto mb-4">
              Add high-res editorial looks to inspire parlour clients.
            </p>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 text-xs font-bold text-white bg-[#D6204E] hover:bg-[#B81942] rounded-xl shadow-xs cursor-pointer transition-transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Look</span>
            </button>
          </div>
        )
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-2.5 sm:gap-4">
          {inspiredImages.map((look, idx) => (
            <LookbookCard
              key={look.id || idx}
              look={look}
              index={idx}
              totalCount={inspiredImages.length}
              onMove={handleMove}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default LookbookSection;

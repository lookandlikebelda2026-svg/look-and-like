import React, { useState } from 'react';
import { Plus, RotateCcw } from 'lucide-react';
import { LookbookForm } from './LookbookForm';
import { LookbookCard } from './LookbookCard';

/**
 * Section for managing Lookbook Editorial Images ("Get Inspired")
 */
export function LookbookSection({
  inspiredImages,
  saveInspiredImages,
  resetInspiredImages,
  onNotify,
}) {
  const [editingInspired, setEditingInspired] = useState(null); // null or { index, item }
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

  const handleSaveForm = (e) => {
    e.preventDefault();
    if (!inspiredForm.imageUrl.trim()) {
      onNotify?.('Please provide an Image URL.', 'error');
      return;
    }

    const newItem = {
      id: editingInspired ? editingInspired.item.id : `inspired-${Date.now()}`,
      imageUrl: inspiredForm.imageUrl.trim(),
      alt: inspiredForm.alt.trim() || 'Look & Like Lookbook Look',
    };

    let updatedList;
    if (editingInspired !== null) {
      updatedList = [...inspiredImages];
      updatedList[editingInspired.index] = newItem;
      onNotify?.('Lookbook image updated successfully!', 'success');
    } else {
      updatedList = [...inspiredImages, newItem];
      onNotify?.('New lookbook image added successfully!', 'success');
    }

    saveInspiredImages(updatedList);
    handleCloseForm();
  };

  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this lookbook image?')) {
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
    if (window.confirm('Reset all Get Inspired images to original default collection?')) {
      resetInspiredImages();
      onNotify?.('Reset to default lookbook images.', 'info');
    }
  };

  const isFormOpen = isAddingInspired || editingInspired !== null;

  return (
    <div>
      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-[#F0CDD7]">
        <div>
          <h4 className="font-serif text-lg font-bold text-deep-espresso">
            Lookbook Editorial Images
          </h4>
          <p className="text-xs text-[#7A6B70] mt-0.5">
            These images automatically adapt into the responsive 4-column masonry and mobile peek carousel.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl transition-all cursor-pointer"
            title="Reset to default lookbook"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#D6204E] to-[#B81942] hover:from-[#B81942] hover:to-[#961234] rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Look</span>
          </button>
        </div>
      </div>

      {/* Add / Edit Form */}
      {isFormOpen && (
        <LookbookForm
          isEditing={editingInspired !== null}
          formData={inspiredForm}
          onChange={setInspiredForm}
          onSubmit={handleSaveForm}
          onCancel={handleCloseForm}
          onNotify={onNotify}
        />
      )}

      {/* Looks Grid - Full Area Responsive Multi-Column */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-5">
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
    </div>
  );
}

export default LookbookSection;


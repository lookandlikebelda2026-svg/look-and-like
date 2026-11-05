import React, { useState } from 'react';
import { Plus, RotateCcw, Briefcase } from 'lucide-react';
import { PartnerForm } from './PartnerForm';
import { PartnerCard } from './PartnerCard';

/**
 * Section for managing Brand Partner logos ("Trusted Beauty Partners")
 */
export function PartnersSection({
  partners = [],
  savePartners,
  resetPartners,
  onNotify,
}) {
  const [editingPartner, setEditingPartner] = useState(null); // null or { index, item }
  const [isAddingPartner, setIsAddingPartner] = useState(false);
  const [partnerForm, setPartnerForm] = useState({
    name: '',
    logoUrl: '',
    specialty: '',
    country: '',
  });

  const handleOpenAdd = () => {
    setPartnerForm({
      name: '',
      logoUrl: '',
      specialty: '',
      country: '',
    });
    setIsAddingPartner(true);
    setEditingPartner(null);
  };

  const handleOpenEdit = (partner, index) => {
    setEditingPartner({ partner, index });
    setIsAddingPartner(false);
    setPartnerForm({
      name: partner.name || '',
      logoUrl: partner.logoUrl || '',
      specialty: partner.specialty || '',
      country: partner.country || '',
    });
  };

  const handleCloseForm = () => {
    setIsAddingPartner(false);
    setEditingPartner(null);
  };

  const handleSaveForm = (e) => {
    e.preventDefault();
    if (!partnerForm.name.trim()) {
      onNotify?.('Please provide a Brand Name.', 'error');
      return;
    }
    if (!partnerForm.logoUrl.trim()) {
      onNotify?.('Please provide a Logo URL.', 'error');
      return;
    }

    const newItem = {
      name: partnerForm.name.trim(),
      logoUrl: partnerForm.logoUrl.trim(),
      specialty: partnerForm.specialty.trim() || 'Hair & Beauty Care',
      country: partnerForm.country.trim() || 'Atelier',
    };

    let updatedList;
    if (editingPartner !== null) {
      updatedList = [...partners];
      updatedList[editingPartner.index] = newItem;
      onNotify?.('Brand partner updated successfully!', 'success');
    } else {
      updatedList = [...partners, newItem];
      onNotify?.('New brand partner added successfully!', 'success');
    }

    savePartners(updatedList);
    handleCloseForm();
  };

  const handleDelete = (index) => {
    const item = partners[index];
    if (window.confirm(`Are you sure you want to remove ${item?.name || 'this partner'}?`)) {
      const updatedList = partners.filter((_, i) => i !== index);
      savePartners(updatedList);
      onNotify?.('Partner brand removed.', 'info');
    }
  };

  const handleMove = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= partners.length) return;
    const updatedList = [...partners];
    const [moved] = updatedList.splice(index, 1);
    updatedList.splice(targetIdx, 0, moved);
    savePartners(updatedList);
  };

  const handleReset = () => {
    if (window.confirm('Clear all brand partners?')) {
      resetPartners();
      onNotify?.('Cleared brand partners.', 'info');
    }
  };

  const isFormOpen = isAddingPartner || editingPartner !== null;

  return (
    <div>
      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-[#F0CDD7]">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-serif text-lg font-bold text-deep-espresso">
              Brand Partner Logos
            </h4>
            <span className="text-[11px] font-semibold text-[#D6204E] bg-[#FFF3F6] border border-[#F0CDD7] px-2 py-0.5 rounded-full">
              {partners.length} {partners.length === 1 ? 'Brand' : 'Brands'}
            </span>
          </div>
          <p className="text-xs text-[#7A6B70] mt-0.5">
            These brands stream across the infinite marquee carousel across the home page.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {partners.length > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl transition-all cursor-pointer"
              title="Clear all brand partners"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#D6204E] to-[#B81942] hover:from-[#B81942] hover:to-[#961234] rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Partner</span>
          </button>
        </div>
      </div>

      {/* Add / Edit Form */}
      {isFormOpen && (
        <PartnerForm
          isEditing={editingPartner !== null}
          formData={partnerForm}
          onChange={setPartnerForm}
          onSubmit={handleSaveForm}
          onCancel={handleCloseForm}
          onNotify={onNotify}
        />
      )}

      {/* Partners Grid or Empty State */}
      {partners.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-dashed border-stone-200 shadow-2xs">
          <div className="w-14 h-14 rounded-2xl bg-[#FFF3F6] border border-[#F0CDD7] flex items-center justify-center mx-auto mb-3 text-[#D6204E]">
            <Briefcase className="w-7 h-7" />
          </div>
          <h5 className="font-serif text-lg font-bold text-deep-espresso mb-1">
            No Brand Partners Added Yet
          </h5>
          <p className="text-xs text-[#7A6B70] max-w-md mx-auto mb-4 leading-relaxed">
            All demo brand partners have been removed. Click below to add your first salon brand partner.
          </p>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#D6204E] hover:bg-[#B81942] rounded-xl shadow-sm cursor-pointer transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Partner</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-5">
          {partners.map((partner, idx) => (
            <PartnerCard
              key={`${partner.name}-${idx}`}
              partner={partner}
              index={idx}
              totalCount={partners.length}
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

export default PartnersSection;

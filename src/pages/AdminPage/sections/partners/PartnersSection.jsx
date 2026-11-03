import React, { useState } from 'react';
import { Plus, RotateCcw } from 'lucide-react';
import { PartnerForm } from './PartnerForm';
import { PartnerCard } from './PartnerCard';

/**
 * Section for managing Brand Partner logos & carousel items
 */
export function PartnersSection({
  partners,
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

  const handleOpenEdit = (item, index) => {
    setEditingPartner({ item, index });
    setIsAddingPartner(false);
    setPartnerForm({
      name: item.name || '',
      logoUrl: item.logoUrl || '',
      specialty: item.specialty || '',
      country: item.country || '',
    });
  };

  const handleCloseForm = () => {
    setIsAddingPartner(false);
    setEditingPartner(null);
  };

  const handleSaveForm = (e) => {
    e.preventDefault();
    if (!partnerForm.name.trim() || !partnerForm.logoUrl.trim()) {
      onNotify?.('Brand name and Logo URL are required.', 'error');
      return;
    }

    const newItem = {
      name: partnerForm.name.trim(),
      logoUrl: partnerForm.logoUrl.trim(),
      specialty: partnerForm.specialty.trim() || 'Luxury Beauty Treatments',
      country: partnerForm.country.trim() || 'Global',
    };

    let updatedList;
    if (editingPartner !== null) {
      updatedList = [...partners];
      updatedList[editingPartner.index] = newItem;
      onNotify?.('Partner brand updated successfully!', 'success');
    } else {
      updatedList = [...partners, newItem];
      onNotify?.('New partner brand added successfully!', 'success');
    }

    savePartners(updatedList);
    handleCloseForm();
  };

  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to remove this brand partner?')) {
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
    if (window.confirm('Reset brand partners to original default partner brands?')) {
      resetPartners();
      onNotify?.('Reset to default brand partners.', 'info');
    }
  };

  const isFormOpen = isAddingPartner || editingPartner !== null;

  return (
    <div>
      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-[#F0CDD7]">
        <div>
          <h4 className="font-serif text-lg font-bold text-deep-espresso">
            Brand Partner Logos &amp; Specialties
          </h4>
          <p className="text-xs text-[#7A6B70] mt-0.5">
            These brands stream across the infinite marquee carousel across the home page.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl transition-all cursor-pointer"
            title="Reset to default brands"
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

      {/* Partners Grid - Full Area Responsive Multi-Column */}
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
    </div>
  );
}

export default PartnersSection;


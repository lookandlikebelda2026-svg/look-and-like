import React, { useState } from 'react';
import { Plus, RotateCcw, Briefcase } from 'lucide-react';
import { PartnerForm } from './PartnerForm';
import { PartnerCard } from './PartnerCard';
import { deleteImageFromImageKit } from '../../../../services/imagekit';

/**
 * Section for managing Brand Partner logos ("Trusted Beauty Partners")
 */
export function PartnersSection({
  partners = [],
  loading = false,
  savePartners,
  resetPartners,
  onNotify,
}) {
  const [editingPartner, setEditingPartner] = useState(null);
  const [isAddingPartner, setIsAddingPartner] = useState(false);
  const [partnerForm, setPartnerForm] = useState({
    name: '',
    logoUrl: '',
  });

  const handleOpenAdd = () => {
    setPartnerForm({
      name: '',
      logoUrl: '',
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
    });
  };

  const handleCloseForm = () => {
    setIsAddingPartner(false);
    setEditingPartner(null);
  };

  const handleSaveForm = (items) => {
    if (!items || items.length === 0) {
      onNotify?.('Please provide at least one brand logo.', 'error');
      return;
    }

    if (editingPartner !== null) {
      const single = items[0];
      const oldUrl = editingPartner.partner?.logoUrl;
      const oldFileId = editingPartner.partner?.fileId;
      const newUrl = single.logoUrl || single.url;

      // If the logo was replaced, delete old logo from ImageKit
      if (oldUrl && newUrl && oldUrl !== newUrl) {
        deleteImageFromImageKit(oldFileId || oldUrl);
      }

      const updatedList = [...partners];
      updatedList[editingPartner.index] = {
        ...editingPartner.partner,
        logoUrl: newUrl,
        fileId: single.fileId || editingPartner.partner?.fileId || '',
        name: `Partner ${editingPartner.index + 1}`,
      };
      savePartners(updatedList);
      onNotify?.('Brand partner updated!', 'success');
    } else {
      const newItems = items.map((item, idx) => ({
        id: `partner-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
        name: `Partner ${partners.length + idx + 1}`,
        logoUrl: item.logoUrl || item.url,
        fileId: item.fileId || '',
        specialty: 'Hair & Beauty Care',
        country: 'Atelier',
      }));
      const updatedList = [...partners, ...newItems];
      savePartners(updatedList);
      onNotify?.(
        `${newItems.length} brand ${newItems.length === 1 ? 'partner' : 'partners'} added!`,
        'success'
      );
    }

    handleCloseForm();
  };

  const handleDelete = (index) => {
    const item = partners[index];
    const label = `Partner #${index + 1}`;
    if (window.confirm(`Remove ${label}?`)) {
      if (item?.logoUrl) {
        deleteImageFromImageKit(item.fileId || item.logoUrl);
      }
      const updatedList = partners.filter((_, i) => i !== index);
      savePartners(updatedList);
      onNotify?.(`Removed ${label}.`, 'info');
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
    if (window.confirm('Clear all brand partners? This will also remove logos from ImageKit.')) {
      partners.forEach((p) => {
        if (p?.logoUrl) deleteImageFromImageKit(p.fileId || p.logoUrl);
      });
      resetPartners();
      onNotify?.('Cleared brand partners.', 'info');
    }
  };

  const isFormOpen = isAddingPartner || editingPartner !== null;

  return (
    <div>
      {/* Action Bar */}
      <div className="flex items-center justify-between gap-2 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-[#F0CDD7]">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-serif text-base sm:text-lg font-bold text-deep-espresso truncate">
              Brand Partners
            </h4>
            <span className="text-[10px] sm:text-[11px] font-semibold text-[#D6204E] bg-[#FFF3F6] border border-[#F0CDD7] px-2 py-0.5 rounded-full shrink-0">
              {partners.length} {partners.length === 1 ? 'Brand' : 'Brands'}
            </span>
          </div>
          <p className="hidden sm:block text-xs text-[#7A6B70] mt-0.5">
            Brand logos featured on the home page marquee.
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
              <span>Add Partner</span>
            </button>
          </div>
        )}
      </div>

      {/* Add / Edit Form */}
      {isFormOpen && (
        <PartnerForm
          isEditing={editingPartner !== null}
          formData={partnerForm}
          onSubmit={handleSaveForm}
          onCancel={handleCloseForm}
          onNotify={onNotify}
        />
      )}

      {/* Partners Grid or Empty State (Do not render empty state card when form is open) */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-[#FFF3F6] border border-[#F0CDD7] animate-pulse" />
          ))}
        </div>
      ) : partners.length === 0 ? (
        !isFormOpen && (
          <div className="text-center py-12 sm:py-16 px-4 bg-white rounded-2xl sm:rounded-3xl border border-dashed border-stone-200 shadow-2xs">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#FFF3F6] border border-[#F0CDD7] flex items-center justify-center mx-auto mb-3 text-[#D6204E]">
              <Briefcase className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h5 className="font-serif text-base sm:text-lg font-bold text-deep-espresso mb-1">
              No Brand Partners Yet
            </h5>
            <p className="text-xs text-[#7A6B70] max-w-sm mx-auto mb-4">
              Upload parlour product and beauty brand partner logos.
            </p>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 text-xs font-bold text-white bg-[#D6204E] hover:bg-[#B81942] rounded-xl shadow-xs cursor-pointer transition-transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Partner</span>
            </button>
          </div>
        )
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-2.5 sm:gap-4">
          {partners.map((partner, idx) => (
            <PartnerCard
              key={partner.id || `${partner.name}-${idx}`}
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

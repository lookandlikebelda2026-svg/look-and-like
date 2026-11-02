import React, { useState } from 'react';
import { 
  X, Image as ImageIcon, Briefcase, Plus, Trash2, Edit3, 
  ArrowUp, ArrowDown, RotateCcw, Check, ExternalLink, Sparkles
} from 'lucide-react';
import { LotusIcon } from '../icons';
import { useContentStorage } from '../../services/contentStorage';
import { ImageKitUploader } from '../common/ImageKitUploader';

export function ManagementPanelModal({ isOpen, onClose, onNotify }) {
  const { 
    inspiredImages, 
    partners, 
    saveInspiredImages, 
    resetInspiredImages, 
    savePartners, 
    resetPartners 
  } = useContentStorage();

  const [activeTab, setActiveTab] = useState('inspired'); // 'inspired' | 'partners'

  // Sub-modal states for adding/editing
  const [editingInspired, setEditingInspired] = useState(null); // null or { index, item }
  const [isAddingInspired, setIsAddingInspired] = useState(false);
  const [inspiredForm, setInspiredForm] = useState({ imageUrl: '', alt: '' });

  const [editingPartner, setEditingPartner] = useState(null); // null or { index, item }
  const [isAddingPartner, setIsAddingPartner] = useState(false);
  const [partnerForm, setPartnerForm] = useState({ name: '', logoUrl: '', specialty: '', country: '' });

  if (!isOpen) return null;

  // --- Inspired Look Handlers ---
  const handleOpenAddInspired = () => {
    setInspiredForm({
      imageUrl: '',
      alt: ''
    });
    setIsAddingInspired(true);
  };

  const handleOpenEditInspired = (item, index) => {
    setEditingInspired({ item, index });
    setInspiredForm({
      imageUrl: item.imageUrl || '',
      alt: item.alt || ''
    });
  };

  const handleSaveInspiredForm = (e) => {
    e.preventDefault();
    if (!inspiredForm.imageUrl.trim()) {
      onNotify?.('Please provide an Image URL.', 'error');
      return;
    }

    const newItem = {
      id: editingInspired ? editingInspired.item.id : `inspired-${Date.now()}`,
      imageUrl: inspiredForm.imageUrl.trim(),
      alt: inspiredForm.alt.trim() || 'Look & Like Lookbook Look'
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
    setIsAddingInspired(false);
    setEditingInspired(null);
  };

  const handleDeleteInspired = (index) => {
    if (window.confirm('Are you sure you want to delete this lookbook image?')) {
      const updatedList = inspiredImages.filter((_, i) => i !== index);
      saveInspiredImages(updatedList);
      onNotify?.('Image deleted.', 'info');
    }
  };

  const handleMoveInspired = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= inspiredImages.length) return;
    const updatedList = [...inspiredImages];
    const [moved] = updatedList.splice(index, 1);
    updatedList.splice(targetIdx, 0, moved);
    saveInspiredImages(updatedList);
  };

  const handleResetInspired = () => {
    if (window.confirm('Reset all Get Inspired images to original default collection?')) {
      resetInspiredImages();
      onNotify?.('Reset to default lookbook images.', 'info');
    }
  };

  // --- Partners Handlers ---
  const handleOpenAddPartner = () => {
    setPartnerForm({
      name: '',
      logoUrl: '',
      specialty: '',
      country: ''
    });
    setIsAddingPartner(true);
  };

  const handleOpenEditPartner = (item, index) => {
    setEditingPartner({ item, index });
    setPartnerForm({
      name: item.name || '',
      logoUrl: item.logoUrl || '',
      specialty: item.specialty || '',
      country: item.country || ''
    });
  };

  const handleSavePartnerForm = (e) => {
    e.preventDefault();
    if (!partnerForm.name.trim() || !partnerForm.logoUrl.trim()) {
      onNotify?.('Brand name and Logo URL are required.', 'error');
      return;
    }

    const newItem = {
      name: partnerForm.name.trim(),
      logoUrl: partnerForm.logoUrl.trim(),
      specialty: partnerForm.specialty.trim() || 'Luxury Beauty Treatments',
      country: partnerForm.country.trim() || 'Global'
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
    setIsAddingPartner(false);
    setEditingPartner(null);
  };

  const handleDeletePartner = (index) => {
    if (window.confirm('Are you sure you want to remove this brand partner?')) {
      const updatedList = partners.filter((_, i) => i !== index);
      savePartners(updatedList);
      onNotify?.('Partner brand removed.', 'info');
    }
  };

  const handleMovePartner = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= partners.length) return;
    const updatedList = [...partners];
    const [moved] = updatedList.splice(index, 1);
    updatedList.splice(targetIdx, 0, moved);
    savePartners(updatedList);
  };

  const handleResetPartners = () => {
    if (window.confirm('Reset brand partners to original default partner brands?')) {
      resetPartners();
      onNotify?.('Reset to default brand partners.', 'info');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-border-warm overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-8 py-4 sm:py-5 border-b border-border-warm/70 bg-[#FFF3F6]/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white shadow-xs border border-[#F0CDD7] flex items-center justify-center shrink-0">
              <LotusIcon className="w-5 h-5 text-[#D6204E]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-deep-espresso">
                  Content Management Panel
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#D6204E]/10 text-[#D6204E] border border-[#D6204E]/20">
                  <Sparkles className="w-2.5 h-2.5" /> Live Sync
                </span>
              </div>
              <p className="text-xs text-[#6B5A60]">
                Manage Lookbook gallery and Brand Partner logos in real-time.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-deep-espresso hover:bg-white rounded-full transition-colors cursor-pointer"
            aria-label="Close panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-border-warm bg-white px-5 sm:px-8">
          <button
            type="button"
            onClick={() => {
              setActiveTab('inspired');
              setIsAddingInspired(false);
              setEditingInspired(null);
            }}
            className={`flex items-center gap-2 py-3.5 px-4 font-semibold text-xs sm:text-sm border-b-2 transition-all cursor-pointer ${
              activeTab === 'inspired'
                ? 'border-[#D6204E] text-[#D6204E]'
                : 'border-transparent text-[#6B5A60] hover:text-deep-espresso'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Lookbook Gallery ("Get Inspired")</span>
            <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-stone-100 text-stone-700 font-bold">
              {inspiredImages.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('partners');
              setIsAddingPartner(false);
              setEditingPartner(null);
            }}
            className={`flex items-center gap-2 py-3.5 px-4 font-semibold text-xs sm:text-sm border-b-2 transition-all cursor-pointer ${
              activeTab === 'partners'
                ? 'border-[#D6204E] text-[#D6204E]'
                : 'border-transparent text-[#6B5A60] hover:text-deep-espresso'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Brand Partners Carousel</span>
            <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-stone-100 text-stone-700 font-bold">
              {partners.length}
            </span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#FAF8F5]/40 space-y-6">
          
          {/* =========================================
              TAB 1: GET INSPIRED LOOKBOOK
              ========================================= */}
          {activeTab === 'inspired' && (
            <div>
              {/* Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div>
                  <h4 className="font-serif text-base font-bold text-deep-espresso">
                    Lookbook Editorial Images
                  </h4>
                  <p className="text-xs text-[#7A6B70]">
                    These images automatically adapt into the responsive 4-column masonry and mobile peek carousel.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetInspired}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl transition-all cursor-pointer"
                    title="Reset to default lookbook"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Defaults</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenAddInspired}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#D6204E] to-[#B81942] hover:from-[#B81942] hover:to-[#961234] rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Look</span>
                  </button>
                </div>
              </div>

              {/* Add/Edit Lookbook Form Overlay or Card */}
              {(isAddingInspired || editingInspired !== null) && (
                <form 
                  onSubmit={handleSaveInspiredForm}
                  className="mb-6 p-4 sm:p-5 rounded-2xl bg-white border border-[#F0CDD7] shadow-sm space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <h5 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#D6204E]">
                      {editingInspired ? 'Edit Lookbook Image' : 'Add New Lookbook Image'}
                    </h5>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingInspired(false);
                        setEditingInspired(null);
                      }}
                      className="text-stone-400 hover:text-stone-700 text-xs font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Live Preview Column */}
                    <div className="flex flex-col items-center justify-center border border-dashed border-stone-300 rounded-xl bg-stone-50 p-2 min-h-[140px] overflow-hidden">
                      {inspiredForm.imageUrl ? (
                        <img
                          src={inspiredForm.imageUrl}
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
                        value={inspiredForm.imageUrl}
                        onChange={(url) => setInspiredForm({ ...inspiredForm, imageUrl: url })}
                        folder="/lookbook"
                        tags={['lookbook', 'editorial']}
                        label="Lookbook Photo"
                        helpText="Upload PNG, JPG or WEBP directly to ImageKit CDN"
                      />

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-stone-500">Preset Samples:</span>
                        <button
                          type="button"
                          onClick={() => setInspiredForm({
                            ...inspiredForm,
                            imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
                            alt: 'Editorial Glow Treatment'
                          })}
                          className="text-[10px] text-[#D6204E] hover:underline cursor-pointer"
                        >
                          Bridal Glow
                        </button>
                        <span>·</span>
                        <button
                          type="button"
                          onClick={() => setInspiredForm({
                            ...inspiredForm,
                            imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
                            alt: 'Haute Salon Styling'
                          })}
                          className="text-[10px] text-[#D6204E] hover:underline cursor-pointer"
                        >
                          Hair Studio
                        </button>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-deep-espresso mb-1">
                          Alt &amp; Styling Description
                        </label>
                        <input
                          type="text"
                          value={inspiredForm.alt}
                          onChange={(e) => setInspiredForm({ ...inspiredForm, alt: e.target.value })}
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
                          <span>{editingInspired ? 'Update Look' : 'Save New Look'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              )}

              {/* List of Looks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {inspiredImages.map((look, idx) => (
                  <div
                    key={look.id || idx}
                    className="relative bg-white rounded-2xl border border-border-warm/70 shadow-xs hover:shadow-sm overflow-hidden flex flex-col group transition-all"
                  >
                    {/* Image Thumbnail */}
                    <div className="relative h-44 w-full overflow-hidden bg-stone-100">
                      <img
                        src={look.imageUrl}
                        alt={look.alt}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = 'https://placehold.co/400x500/F0CDD7/D6204E?text=Missing+Image';
                        }}
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/90 backdrop-blur-xs text-deep-espresso border border-border-warm shadow-2xs">
                        Look {idx + 1}
                      </div>

                      {/* Quick Action Overlay */}
                      <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/90 backdrop-blur-xs rounded-full p-1 border border-border-warm shadow-2xs">
                        <button
                          type="button"
                          onClick={() => handleMoveInspired(idx, -1)}
                          disabled={idx === 0}
                          className="p-1 text-stone-600 hover:text-deep-espresso disabled:opacity-20 cursor-pointer"
                          title="Move Left/Up"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveInspired(idx, 1)}
                          disabled={idx === inspiredImages.length - 1}
                          className="p-1 text-stone-600 hover:text-deep-espresso disabled:opacity-20 cursor-pointer"
                          title="Move Right/Down"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Metadata & Actions */}
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <p className="text-xs text-deep-espresso font-medium line-clamp-2 mb-3">
                        {look.alt || 'No description provided'}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                        <a
                          href={look.imageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-stone-500 hover:text-[#D6204E] flex items-center gap-1"
                        >
                          <span>Full URL</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditInspired(look, idx)}
                            className="p-1.5 text-stone-600 hover:text-[#D6204E] hover:bg-[#FFF3F6] rounded-lg transition-colors cursor-pointer"
                            title="Edit look"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteInspired(idx)}
                            className="p-1.5 text-stone-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete look"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================
              TAB 2: BRAND PARTNERS
              ========================================= */}
          {activeTab === 'partners' && (
            <div>
              {/* Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div>
                  <h4 className="font-serif text-base font-bold text-deep-espresso">
                    Brand Partner Logos &amp; Specialties
                  </h4>
                  <p className="text-xs text-[#7A6B70]">
                    These brands stream across the infinite marquee carousel across the home page.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetPartners}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl transition-all cursor-pointer"
                    title="Reset to default brands"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Defaults</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenAddPartner}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#D6204E] to-[#B81942] hover:from-[#B81942] hover:to-[#961234] rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Partner</span>
                  </button>
                </div>
              </div>

              {/* Add/Edit Partner Form */}
              {(isAddingPartner || editingPartner !== null) && (
                <form 
                  onSubmit={handleSavePartnerForm}
                  className="mb-6 p-4 sm:p-5 rounded-2xl bg-white border border-[#F0CDD7] shadow-sm space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <h5 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#D6204E]">
                      {editingPartner ? 'Edit Brand Partner' : 'Add New Brand Partner'}
                    </h5>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingPartner(false);
                        setEditingPartner(null);
                      }}
                      className="text-stone-400 hover:text-stone-700 text-xs font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Live Preview Column */}
                    <div className="flex flex-col items-center justify-center border border-dashed border-stone-300 rounded-xl bg-[#FAF8F5] p-3 min-h-[140px]">
                      {partnerForm.logoUrl ? (
                        <div className="w-32 h-16 bg-white rounded-xl border border-stone-200 p-2 flex items-center justify-center shadow-xs">
                          <img
                            src={partnerForm.logoUrl}
                            alt="Logo preview"
                            className="max-h-8 max-w-[100px] object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              if (e.currentTarget.nextElementSibling) {
                                e.currentTarget.nextElementSibling.style.display = 'block';
                              }
                            }}
                          />
                          <span className="hidden text-xs font-bold uppercase text-deep-espresso">
                            {partnerForm.name || 'Brand Logo'}
                          </span>
                        </div>
                      ) : (
                        <div className="text-center p-3 text-stone-400">
                          <Briefcase className="w-8 h-8 mx-auto mb-1 opacity-50" />
                          <span className="text-[11px] block">Logo Preview</span>
                        </div>
                      )}
                      <span className="text-[10px] text-stone-500 mt-2 font-medium">
                        {partnerForm.name || 'Brand Name'}
                      </span>
                    </div>

                    {/* Inputs Column */}
                    <div className="md:col-span-2 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-deep-espresso mb-1">
                            Brand Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={partnerForm.name}
                            onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })}
                            placeholder="e.g. KÉRASTASE"
                            className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#D6204E]/40"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-deep-espresso mb-1">
                            Origin / Country
                          </label>
                          <input
                            type="text"
                            value={partnerForm.country}
                            onChange={(e) => setPartnerForm({ ...partnerForm, country: e.target.value })}
                            placeholder="e.g. Paris"
                            className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#D6204E]/40"
                          />
                        </div>
                      </div>

                      <ImageKitUploader
                        value={partnerForm.logoUrl}
                        onChange={(url) => setPartnerForm({ ...partnerForm, logoUrl: url })}
                        folder="/partners"
                        tags={['partners', 'logo']}
                        label="Brand Logo Photo"
                        helpText="Upload brand logo (SVG, PNG or WEBP with transparency)"
                      />

                      <div>
                        <label className="block text-xs font-bold text-deep-espresso mb-1">
                          Treatment Specialty / Protocol
                        </label>
                        <input
                          type="text"
                          value={partnerForm.specialty}
                          onChange={(e) => setPartnerForm({ ...partnerForm, specialty: e.target.value })}
                          placeholder="e.g. Molecular Bond Restoration"
                          className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#D6204E]/40"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-deep-espresso hover:bg-stone-800 rounded-lg shadow-xs cursor-pointer active:scale-95"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{editingPartner ? 'Update Partner' : 'Save Partner'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              )}

              {/* Partners Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
                {partners.map((partner, idx) => (
                  <div
                    key={`${partner.name}-${idx}`}
                    className="relative bg-white rounded-2xl border border-border-warm/70 shadow-xs hover:shadow-sm p-4 flex flex-col justify-between group transition-all"
                  >
                    <div>
                      {/* Logo Preview Tile */}
                      <div className="h-16 w-full rounded-xl bg-[#FAF8F5] border border-border-warm/40 p-2 flex items-center justify-center mb-3">
                        <img
                          src={partner.logoUrl}
                          alt={partner.name}
                          className="max-h-8 max-w-[110px] object-contain filter contrast-125 group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            if (e.currentTarget.nextElementSibling) {
                              e.currentTarget.nextElementSibling.style.display = 'block';
                            }
                          }}
                        />
                        <span className="hidden text-xs font-bold uppercase text-deep-espresso">
                          {partner.name}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-deep-espresso uppercase truncate">
                          {partner.name}
                        </span>
                        {partner.country && (
                          <span className="text-[10px] text-[#D6204E] font-semibold uppercase tracking-wider">
                            {partner.country}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-500 line-clamp-1 mb-2">
                        {partner.specialty || 'Luxury Partner'}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                      <div className="flex items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => handleMovePartner(idx, -1)}
                          disabled={idx === 0}
                          className="p-1 text-stone-500 hover:text-deep-espresso disabled:opacity-20 cursor-pointer"
                          title="Move Left"
                        >
                          <ArrowUp className="w-3 h-3 rotate-[-90deg]" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMovePartner(idx, 1)}
                          disabled={idx === partners.length - 1}
                          className="p-1 text-stone-500 hover:text-deep-espresso disabled:opacity-20 cursor-pointer"
                          title="Move Right"
                        >
                          <ArrowDown className="w-3 h-3 rotate-[-90deg]" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEditPartner(partner, idx)}
                          className="p-1.5 text-stone-600 hover:text-[#D6204E] hover:bg-[#FFF3F6] rounded-lg transition-colors cursor-pointer"
                          title="Edit partner"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePartner(idx)}
                          className="p-1.5 text-stone-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete partner"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-8 py-3.5 border-t border-border-warm bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Changes persist to browser storage and sync in real time.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 text-xs font-semibold text-deep-espresso bg-stone-100 hover:bg-stone-200 rounded-xl transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}


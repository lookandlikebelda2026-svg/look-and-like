import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  UploadCloud,
  Image as ImageIcon,
  X,
  Loader2,
  Sparkles,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { useContentStorage } from '../../../../services/contentStorage';
import { Layout } from '../../layout';
import { uploadImageToImageKit } from '../../../../services/imagekit';
import { compressImage } from '../../../../utils/imageCompressor';
import { normalizeService, normalizeServiceImages } from '../../../../constants/services';

const PRESET_SUGGESTIONS = [
  {
    name: 'Skin Care',
    description: 'Facials, Cleanups, Anti-Aging & Bio-Active Cellular Treatments',
    startingPrice: 1999,
  },
  {
    name: 'Hair Care',
    description: 'Haircuts, Styling, Japanese Spa, Couture Balayage & Smoothening',
    startingPrice: 1499,
  },
  {
    name: 'Nail Care',
    description: 'Manicure, Pedicure, Russian BIAB & Couture Sculpted Extensions',
    startingPrice: 999,
  },
  {
    name: 'Make Up',
    description: 'Bridal, Party, HD Airbrush & Editorial Haute Glamour',
    startingPrice: 3999,
  },
  {
    name: 'Spa Wellness',
    description: 'Japanese Warm Oil Head Spa, Heated Therapy & Aromatic Body Rituals',
    startingPrice: 1899,
  },
];

/**
 * Reusable Multiple Image Manager Component for Service & Plan Images
 * Adheres strictly to: ServiceImage { url: string; path: string; alt: string }
 */
function MultipleImageManager({
  images = [],
  onAddImage,
  onRemoveImage,
  label = 'Photos',
  onNotify,
  folder = '/services',
}) {
  const [urlInput, setUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleAddUrl = (e) => {
    e.preventDefault();
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      onNotify?.('Please enter a valid image URL starting with http:// or https://', 'error');
      return;
    }
    onAddImage({
      url: trimmed,
      path: '',
      alt: label,
    });
    setUrlInput('');
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const compressed = await compressImage(file, {
        preset: 'photo',
        maxWidth: 1600,
        maxHeight: 1600,
        quality: 0.85,
        outputFormat: 'webp',
      });

      const uploadResult = await uploadImageToImageKit(compressed.file, {
        fileName: `service_${Date.now()}_${file.name.replace(/\.[^/.]+$/, '')}.webp`,
        folder,
        tags: ['service-photo'],
      });

      if (uploadResult?.url) {
        onAddImage({
          url: uploadResult.url,
          path: uploadResult.filePath || '',
          alt: file.name.replace(/\.[^/.]+$/, ''),
        });
        onNotify?.('Photo uploaded successfully!', 'success');
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      onNotify?.(err.message || 'Failed to upload photo. You can paste an image URL instead.', 'error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-deep-espresso flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-[#D6204E]" />
          <span>{label} ({images.length})</span>
        </label>
        <span className="text-[11px] text-stone-400">Upload photo or paste URL</span>
      </div>

      {/* Thumbnails Grid */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2.5 p-2.5 bg-[#FAF8F5] rounded-2xl border border-stone-200/80">
          {images.map((img, idx) => {
            const imgUrl = typeof img === 'string' ? img : img.url;
            return (
              <div
                key={idx}
                className="relative w-16 h-16 rounded-xl overflow-hidden border border-stone-200 bg-white group shrink-0 shadow-2xs"
              >
                <img
                  src={imgUrl}
                  alt={img.alt || `Photo ${idx + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <button
                  type="button"
                  onClick={() => onRemoveImage(idx)}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer"
                  title="Remove photo"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex-1 min-w-[200px] flex items-center gap-1.5">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Paste image URL (https://...)"
            className="flex-1 px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#D6204E]"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            disabled={!urlInput.trim()}
            className="px-3 py-2 text-xs font-semibold text-deep-espresso bg-stone-100 hover:bg-stone-200 disabled:opacity-40 rounded-xl cursor-pointer transition-colors whitespace-nowrap"
          >
            Add URL
          </button>
        </div>

        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#D6204E] bg-[#FFF3F6] hover:bg-[#FFE8EF] border border-[#F0CDD7] rounded-xl transition-colors cursor-pointer disabled:opacity-60 whitespace-nowrap shadow-2xs"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload Photo</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Dedicated Page for Creating or Editing a Salon Service with Nested Plans & Subplans
 * Implements the exact Service data model single source of truth.
 */
export function ServiceFormPage({ onNotify }) {
  const navigate = useNavigate();
  const { serviceId } = useParams();
  const {
    servicesData,
    saveServicesData,
    inspiredImages,
    partners,
    videos,
  } = useContentStorage();

  const isEditing = Boolean(serviceId && serviceId !== 'new');

  const [formData, setFormData] = useState({
    id: `service-${Date.now()}`,
    name: '',
    description: '',
    images: [],
    startingPrice: 0,
    plans: [
      {
        id: `plan-${Date.now()}-1`,
        name: '',
        description: '',
        images: [],
        startingPrice: 0,
        subplans: [
          { id: `subplan-${Date.now()}-1`, name: 'Basic', price: 999 },
          { id: `subplan-${Date.now()}-2`, name: 'Mid', price: 1499 },
          { id: `subplan-${Date.now()}-3`, name: 'Advanced', price: 1999 },
        ],
      },
    ],
    createdAt: null,
    updatedAt: null,
  });

  // Initialize form data when editing
  useEffect(() => {
    if (!isEditing || !Array.isArray(servicesData) || servicesData.length === 0) return;

    let matched = servicesData.find(
      (s) => s.id === serviceId || String(s.id) === String(serviceId)
    );
    if (!matched && !isNaN(Number(serviceId))) {
      matched = servicesData[Number(serviceId)];
    }

    if (matched) {
      const normalized = normalizeService(matched);
      if (normalized) {
        setFormData({
          id: normalized.id,
          name: normalized.name || '',
          description: normalized.description || '',
          images: normalized.images || [],
          startingPrice: Number(normalized.startingPrice) || 0,
          plans: Array.isArray(normalized.plans) && normalized.plans.length > 0
            ? JSON.parse(JSON.stringify(normalized.plans))
            : [
                {
                  id: `plan-${Date.now()}-1`,
                  name: '',
                  description: '',
                  images: [],
                  startingPrice: 0,
                  subplans: [
                    { id: `subplan-${Date.now()}-1`, name: 'Basic', price: 999 },
                  ],
                },
              ],
          createdAt: normalized.createdAt,
          updatedAt: normalized.updatedAt,
        });
      }
    }
  }, [isEditing, serviceId, servicesData]);

  // Apply Quick Preset Suggestion
  const handleApplyPreset = (preset) => {
    setFormData((prev) => ({
      ...prev,
      name: preset.name,
      description: preset.description,
      startingPrice: preset.startingPrice,
    }));
  };

  // --- SERVICE IMAGES ---
  const handleAddServiceImage = (newImg) => {
    setFormData((prev) => ({
      ...prev,
      images: [...(prev.images || []), newImg],
    }));
  };

  const handleRemoveServiceImage = (idx) => {
    setFormData((prev) => {
      const updated = [...(prev.images || [])];
      updated.splice(idx, 1);
      return { ...prev, images: updated };
    });
  };

  // Auto-calculate service starting price from lowest plan starting price
  const handleAutoCalculateServicePrice = () => {
    const plans = formData.plans || [];
    const validPrices = plans
      .map((p) => Number(p.startingPrice))
      .filter((pr) => !isNaN(pr) && pr > 0);

    if (validPrices.length === 0) {
      onNotify?.('Please configure starting prices for your plans first.', 'info');
      return;
    }

    const minPrice = Math.min(...validPrices);
    setFormData((prev) => ({ ...prev, startingPrice: minPrice }));
    onNotify?.(`Set service starting price to lowest plan price: ₹${minPrice.toLocaleString('en-IN')}`, 'success');
  };

  // --- PLANS MANAGEMENT ---
  const handleAddPlan = () => {
    const plans = formData.plans || [];
    const newPlanId = `plan-${Date.now()}-${plans.length + 1}`;
    const newPlan = {
      id: newPlanId,
      name: '',
      description: '',
      images: [],
      startingPrice: 0,
      subplans: [
        { id: `subplan-${Date.now()}-basic`, name: 'Basic', price: 999 },
        { id: `subplan-${Date.now()}-mid`, name: 'Mid', price: 1499 },
        { id: `subplan-${Date.now()}-adv`, name: 'Advanced', price: 1999 },
      ],
    };
    setFormData((prev) => ({
      ...prev,
      plans: [...plans, newPlan],
    }));
  };

  const handleUpdatePlan = (planIdx, field, value) => {
    const plans = [...(formData.plans || [])];
    if (plans[planIdx]) {
      plans[planIdx] = {
        ...plans[planIdx],
        [field]: value,
      };
      setFormData((prev) => ({ ...prev, plans }));
    }
  };

  const handleDeletePlan = (planIdx) => {
    const targetPlan = formData.plans?.[planIdx];
    const planName = targetPlan?.name || `Plan #${planIdx + 1}`;

    if (!window.confirm(`Are you sure you want to delete "${planName}"? All its associated subplans will be removed.`)) {
      return;
    }

    const plans = [...(formData.plans || [])];
    plans.splice(planIdx, 1);
    setFormData((prev) => ({ ...prev, plans }));
    onNotify?.(`Removed "${planName}".`, 'info');
  };

  const handleMovePlan = (planIdx, direction) => {
    const plans = [...(formData.plans || [])];
    const targetIdx = planIdx + direction;
    if (targetIdx < 0 || targetIdx >= plans.length) return;
    const [moved] = plans.splice(planIdx, 1);
    plans.splice(targetIdx, 0, moved);
    setFormData((prev) => ({ ...prev, plans }));
  };

  // Auto-calculate plan starting price from lowest subplan price
  const handleAutoCalculatePlanPrice = (planIdx) => {
    const plans = [...(formData.plans || [])];
    const plan = plans[planIdx];
    if (!plan) return;

    const subplans = plan.subplans || [];
    const prices = subplans
      .map((s) => Number(s.price))
      .filter((pr) => !isNaN(pr) && pr > 0);

    if (prices.length === 0) {
      onNotify?.('Please enter prices for your subplans first.', 'info');
      return;
    }

    const minPrice = Math.min(...prices);
    plan.startingPrice = minPrice;
    setFormData((prev) => ({ ...prev, plans }));
    onNotify?.(`Set plan starting price to ₹${minPrice.toLocaleString('en-IN')}`, 'success');
  };

  // --- PLAN IMAGES ---
  const handleAddPlanImage = (planIdx, newImg) => {
    const plans = [...(formData.plans || [])];
    if (plans[planIdx]) {
      plans[planIdx] = {
        ...plans[planIdx],
        images: [...(plans[planIdx].images || []), newImg],
      };
      setFormData((prev) => ({ ...prev, plans }));
    }
  };

  const handleRemovePlanImage = (planIdx, imgIdx) => {
    const plans = [...(formData.plans || [])];
    if (plans[planIdx]) {
      const updated = [...(plans[planIdx].images || [])];
      updated.splice(imgIdx, 1);
      plans[planIdx] = {
        ...plans[planIdx],
        images: updated,
      };
      setFormData((prev) => ({ ...prev, plans }));
    }
  };

  // --- SUBPLANS MANAGEMENT ---
  const handleAddSubplan = (planIdx) => {
    const plans = [...(formData.plans || [])];
    if (plans[planIdx]) {
      const subplans = plans[planIdx].subplans || [];
      const newSub = {
        id: `subplan-${Date.now()}-${subplans.length + 1}`,
        name: '',
        price: 0,
      };
      plans[planIdx] = {
        ...plans[planIdx],
        subplans: [...subplans, newSub],
      };
      setFormData((prev) => ({ ...prev, plans }));
    }
  };

  const handleUpdateSubplan = (planIdx, subIdx, field, value) => {
    const plans = [...(formData.plans || [])];
    if (plans[planIdx]?.subplans?.[subIdx]) {
      const subplans = [...plans[planIdx].subplans];
      subplans[subIdx] = {
        ...subplans[subIdx],
        [field]: field === 'price' ? Number(value) || 0 : value,
      };
      plans[planIdx] = {
        ...plans[planIdx],
        subplans,
      };
      setFormData((prev) => ({ ...prev, plans }));
    }
  };

  const handleDeleteSubplan = (planIdx, subIdx) => {
    const plans = [...(formData.plans || [])];
    const sub = plans[planIdx]?.subplans?.[subIdx];
    const subName = sub?.name || `Option #${subIdx + 1}`;

    if (!window.confirm(`Delete subplan "${subName}"?`)) {
      return;
    }

    if (plans[planIdx]?.subplans) {
      const subplans = [...plans[planIdx].subplans];
      subplans.splice(subIdx, 1);
      plans[planIdx] = {
        ...plans[planIdx],
        subplans,
      };
      setFormData((prev) => ({ ...prev, plans }));
      onNotify?.(`Deleted "${subName}".`, 'info');
    }
  };

  // --- FORM SUBMIT HANDLER ---
  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    if (!formData.name?.trim()) {
      onNotify?.('Please provide a service name (e.g. Skin Care).', 'error');
      return;
    }

    const plans = formData.plans || [];
    if (plans.length === 0) {
      onNotify?.('Please configure at least one plan for this service.', 'error');
      return;
    }

    for (let pIdx = 0; pIdx < plans.length; pIdx++) {
      const plan = plans[pIdx];
      if (!plan.name?.trim()) {
        onNotify?.(`Plan #${pIdx + 1} is missing a name. Please provide a plan name.`, 'error');
        return;
      }
      const subplans = plan.subplans || [];
      if (subplans.length === 0) {
        onNotify?.(`Plan "${plan.name}" must contain at least one subplan option.`, 'error');
        return;
      }
      for (let sIdx = 0; sIdx < subplans.length; sIdx++) {
        const sub = subplans[sIdx];
        if (!sub.name?.trim()) {
          onNotify?.(`Plan "${plan.name}": Subplan #${sIdx + 1} needs a name (e.g. Basic).`, 'error');
          return;
        }
        if (typeof sub.price !== 'number' || sub.price < 0) {
          onNotify?.(`Plan "${plan.name}": Subplan "${sub.name}" requires a valid numeric price.`, 'error');
          return;
        }
      }
    }

    const now = new Date().toISOString();

    // Clean and strictly format to Service interface
    const cleanPlans = plans.map((p, pIdx) => {
      const cleanSubplans = (p.subplans || []).map((s, sIdx) => ({
        id: s.id || `subplan-${Date.now()}-${sIdx}`,
        name: s.name.trim(),
        price: Number(s.price) || 0,
      }));

      // Calculate starting price for plan if not provided
      let planStart = Number(p.startingPrice);
      if (isNaN(planStart) || planStart <= 0) {
        const prices = cleanSubplans.map((s) => s.price).filter((pr) => pr > 0);
        planStart = prices.length > 0 ? Math.min(...prices) : 0;
      }

      return {
        id: p.id || `plan-${Date.now()}-${pIdx}`,
        name: p.name.trim(),
        description: p.description?.trim() || '',
        images: normalizeServiceImages(p.images, p.name.trim()),
        startingPrice: planStart,
        subplans: cleanSubplans,
      };
    });

    // Calculate service starting price if not provided
    let serviceStart = Number(formData.startingPrice);
    if (isNaN(serviceStart) || serviceStart <= 0) {
      const pPrices = cleanPlans.map((p) => p.startingPrice).filter((pr) => pr > 0);
      serviceStart = pPrices.length > 0 ? Math.min(...pPrices) : 0;
    }

    const cleanService = {
      id: formData.id || `service-${Date.now()}`,
      name: formData.name.trim(),
      description: formData.description?.trim() || '',
      images: normalizeServiceImages(formData.images, formData.name.trim()),
      startingPrice: serviceStart,
      plans: cleanPlans,
      createdAt: formData.createdAt || now,
      updatedAt: now,
    };

    const currentList = Array.isArray(servicesData) ? [...servicesData] : [];
    let updatedList;

    if (isEditing) {
      let foundIdx = currentList.findIndex(
        (s) => s.id === serviceId || String(s.id) === String(serviceId)
      );
      if (foundIdx === -1 && !isNaN(Number(serviceId))) {
        foundIdx = Number(serviceId);
      }
      if (foundIdx !== -1 && currentList[foundIdx]) {
        currentList[foundIdx] = cleanService;
        updatedList = currentList;
      } else {
        updatedList = [...currentList, cleanService];
      }
      onNotify?.(`Updated "${cleanService.name}" successfully!`, 'success');
    } else {
      updatedList = [...currentList, cleanService];
      onNotify?.(`Created "${cleanService.name}" with ${cleanPlans.length} plans!`, 'success');
    }

    saveServicesData(updatedList);
    navigate('/admin?tab=services');
  };

  const handleCancel = () => {
    navigate('/admin?tab=services');
  };

  const plans = formData.plans || [];

  return (
    <Layout
      activeTab="services"
      title={isEditing ? `Edit Service: ${formData.name || 'Service'}` : 'New Salon Service'}
      counts={{
        services: Array.isArray(servicesData) ? servicesData.length : 0,
        lookbook: inspiredImages?.length || 0,
        partners: partners?.length || 0,
        videos: videos?.length || 0,
      }}
    >
      <div className="max-w-6xl mx-auto pb-16">
        {/* Navigation & Action Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-[#F0CDD7]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl transition-all cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Services</span>
            </button>

            <div className="h-4 w-px bg-stone-300 hidden sm:block" />

            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400">
                Service Management / {isEditing ? 'Edit Service' : 'Create Service'}
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-deep-espresso leading-tight">
                {formData.name || (isEditing ? 'Edit Service' : 'Add New Service')}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 border border-stone-200 rounded-xl hover:bg-stone-50 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#D6204E] to-[#B81942] hover:from-[#B81942] hover:to-[#961234] rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>{isEditing ? 'Save Changes' : 'Save Service'}</span>
            </button>
          </div>
        </div>

        {/* 2-Column Responsive Workspace */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* PRIMARY COLUMN: Service Information & Plans */}
            <div className="lg:col-span-2 space-y-6">
              {/* CARD 1: SERVICE INFORMATION */}
              <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs p-5 sm:p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                  <div className="w-8 h-8 rounded-xl bg-[#FFF3F6] border border-[#F0CDD7] flex items-center justify-center text-[#D6204E] shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-deep-espresso">
                      Service Information
                    </h3>
                    <p className="text-[11px] text-[#7A6B70]">
                      Primary service category identity and high-level description.
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-deep-espresso uppercase tracking-wider">
                      Service Name <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] text-stone-400">Quick presets:</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-2.5">
                    {PRESET_SUGGESTIONS.map((p) => (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => handleApplyPreset(p)}
                        className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition-all cursor-pointer ${
                          formData.name === p.name
                            ? 'bg-[#FFF3F6] text-[#D6204E] border-[#F0CDD7] shadow-2xs font-bold'
                            : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                        }`}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Skin Care"
                    className="w-full px-4 py-2.5 text-xs font-semibold text-deep-espresso rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#D6204E]/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-deep-espresso mb-1">
                    Service Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="e.g. Facials, Cleanups, Anti-Aging & Bio-Active Cellular Treatments"
                    className="w-full px-4 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#D6204E]/40"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-deep-espresso uppercase tracking-wider">
                        Starting Price (₹)
                      </label>
                      <button
                        type="button"
                        onClick={handleAutoCalculateServicePrice}
                        className="text-[11px] font-semibold text-[#D6204E] hover:underline cursor-pointer"
                      >
                        ✦ Auto-fill from plans
                      </button>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs font-bold text-stone-400">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={formData.startingPrice || ''}
                        onChange={(e) => setFormData({ ...formData, startingPrice: Number(e.target.value) || 0 })}
                        placeholder="1999"
                        className="w-full pl-8 pr-4 py-2 text-xs font-semibold text-deep-espresso rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#D6204E]/40"
                      />
                    </div>
                  </div>
                </div>

                {/* Service Images Section */}
                <div className="pt-2 border-t border-stone-100">
                  <MultipleImageManager
                    images={formData.images || []}
                    onAddImage={handleAddServiceImage}
                    onRemoveImage={handleRemoveServiceImage}
                    label="Service Cover Images"
                    onNotify={onNotify}
                    folder="/services"
                  />
                </div>
              </div>

              {/* CARD 2: PLANS & SUBPLANS MANAGEMENT */}
              <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs p-5 sm:p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#FFF3F6] border border-[#F0CDD7] flex items-center justify-center text-[#D6204E] shrink-0">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-base font-bold text-deep-espresso">
                          Plans &amp; Subplans Management
                        </h3>
                        <span className="text-[10px] font-bold text-[#D6204E] bg-[#FFF3F6] border border-[#F0CDD7] px-2 py-0.5 rounded-full">
                          {plans.length} {plans.length === 1 ? 'Plan' : 'Plans'}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#7A6B70]">
                        Each service contains multiple plans, and each plan contains customizable subplans with prices.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddPlan}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-deep-espresso hover:bg-stone-800 rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Plan</span>
                  </button>
                </div>

                {/* Plans List */}
                {plans.length === 0 ? (
                  <div className="text-center py-10 px-4 rounded-2xl bg-[#FAF8F5] border border-dashed border-stone-300">
                    <Layers className="w-7 h-7 text-[#D6204E] mx-auto mb-2 opacity-80" />
                    <p className="text-xs font-semibold text-stone-700">No plans added to this service yet.</p>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      Add treatments like &ldquo;Signature Radiance Glow Facial&rdquo; with Basic, Mid &amp; Advanced tiers.
                    </p>
                    <button
                      type="button"
                      onClick={handleAddPlan}
                      className="mt-3 inline-flex items-center gap-1 px-4 py-2 text-xs font-bold text-white bg-[#D6204E] hover:bg-[#B81942] rounded-xl cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add First Plan</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {plans.map((plan, planIdx) => {
                      const subplans = plan.subplans || [];
                      return (
                        <div
                          key={plan.id || planIdx}
                          className="p-4 sm:p-5 rounded-2xl bg-[#FFFCFB] border border-[#F0CDD7] shadow-2xs space-y-4"
                        >
                          {/* Plan Header & Action Bar */}
                          <div className="flex items-center justify-between pb-3 border-b border-[#F0CDD7]/60 flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FFF3F6] text-[#D6204E] border border-[#F0CDD7]">
                                Plan #{planIdx + 1}
                              </span>
                              <span className="text-xs font-bold text-deep-espresso truncate max-w-[240px]">
                                {plan.name || 'Untitled Plan'}
                              </span>
                              {plan.startingPrice > 0 && (
                                <span className="font-sans text-xs font-bold text-[#D6204E]">
                                  From ₹{Number(plan.startingPrice).toLocaleString('en-IN')}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1">
                              {/* Reorder Buttons */}
                              <div className="flex items-center bg-white rounded-lg p-0.5 border border-stone-200">
                                <button
                                  type="button"
                                  onClick={() => handleMovePlan(planIdx, -1)}
                                  disabled={planIdx === 0}
                                  className="p-1 text-stone-500 hover:text-deep-espresso disabled:opacity-20 cursor-pointer"
                                  title="Move Plan Up"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMovePlan(planIdx, 1)}
                                  disabled={planIdx === plans.length - 1}
                                  className="p-1 text-stone-500 hover:text-deep-espresso disabled:opacity-20 cursor-pointer"
                                  title="Move Plan Down"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleDeletePlan(planIdx)}
                                className="p-1.5 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                title="Delete Plan"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Plan Primary Fields */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="sm:col-span-2">
                              <label className="block text-xs font-bold text-deep-espresso mb-1">
                                Plan Name <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="text"
                                required
                                value={plan.name || ''}
                                onChange={(e) => handleUpdatePlan(planIdx, 'name', e.target.value)}
                                placeholder="e.g. Signature Radiance Glow Facial"
                                className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#D6204E]"
                              />
                            </div>

                            <div className="sm:col-span-2">
                              <label className="block text-xs font-bold text-deep-espresso mb-1">
                                Plan Description
                              </label>
                              <textarea
                                rows={2}
                                value={plan.description || ''}
                                onChange={(e) => handleUpdatePlan(planIdx, 'description', e.target.value)}
                                placeholder="Brief treatment procedure details..."
                                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#D6204E]"
                              />
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="text-xs font-bold text-deep-espresso uppercase tracking-wider">
                                  Plan Starting Price (₹)
                                </label>
                                <button
                                  type="button"
                                  onClick={() => handleAutoCalculatePlanPrice(planIdx)}
                                  className="text-[10px] font-semibold text-[#D6204E] hover:underline cursor-pointer"
                                >
                                  ✦ From lowest subplan
                                </button>
                              </div>
                              <div className="relative">
                                <span className="absolute left-3 top-2 text-xs font-bold text-stone-400">₹</span>
                                <input
                                  type="number"
                                  min="0"
                                  value={plan.startingPrice || ''}
                                  onChange={(e) => handleUpdatePlan(planIdx, 'startingPrice', Number(e.target.value) || 0)}
                                  placeholder="1999"
                                  className="w-full pl-7 pr-3 py-1.5 text-xs font-semibold rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#D6204E]"
                                />
                              </div>
                            </div>
                          </div>

                          {/* SUBPLANS MANAGEMENT (Hierarchical Inside Plan) */}
                          <div className="p-3.5 bg-white rounded-xl border border-stone-200/90 space-y-3">
                            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                              <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-deep-espresso flex items-center gap-1.5">
                                  <span>Subplan Pricing Options ({subplans.length})</span>
                                </label>
                                <span className="text-[10px] text-stone-400">
                                  e.g. Basic, Mid, Advanced tiers with independent pricing
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleAddSubplan(planIdx)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-[#D6204E] bg-[#FFF3F6] hover:bg-[#FFE8EF] border border-[#F0CDD7] rounded-lg transition-colors cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Add Subplan</span>
                              </button>
                            </div>

                            {/* Subplans Row List */}
                            <div className="space-y-2">
                              {subplans.map((sub, subIdx) => (
                                <div
                                  key={sub.id || subIdx}
                                  className="flex items-center gap-2 p-2 rounded-lg bg-[#FAF8F5] border border-stone-200/70"
                                >
                                  <span className="text-[11px] font-bold text-stone-400 w-5 text-center">
                                    #{subIdx + 1}
                                  </span>

                                  {/* Subplan Name */}
                                  <input
                                    type="text"
                                    required
                                    value={sub.name || ''}
                                    onChange={(e) => handleUpdateSubplan(planIdx, subIdx, 'name', e.target.value)}
                                    placeholder="Option Name (e.g. Basic, Mid, Advanced)"
                                    className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-stone-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#D6204E]"
                                  />

                                  {/* Subplan Price */}
                                  <div className="relative w-32">
                                    <span className="absolute left-2.5 top-1.5 text-xs font-bold text-stone-400">₹</span>
                                    <input
                                      type="number"
                                      required
                                      min="0"
                                      value={sub.price || ''}
                                      onChange={(e) => handleUpdateSubplan(planIdx, subIdx, 'price', e.target.value)}
                                      placeholder="Price"
                                      className="w-full pl-6 pr-2 py-1.5 text-xs font-semibold rounded-lg border border-stone-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#D6204E]"
                                    />
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => handleDeleteSubplan(planIdx, subIdx)}
                                    className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer rounded-lg hover:bg-rose-50"
                                    title="Delete option"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Plan Multiple Images */}
                          <div className="pt-2 border-t border-stone-100">
                            <MultipleImageManager
                              images={plan.images || []}
                              onAddImage={(newImg) => handleAddPlanImage(planIdx, newImg)}
                              onRemoveImage={(imgIdx) => handleRemovePlanImage(planIdx, imgIdx)}
                              label={`Plan #${planIdx + 1} Photos`}
                              onNotify={onNotify}
                              folder="/services/plans"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* SIDEBAR COLUMN: Save & Actions */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-stone-200/90 p-5 space-y-4 shadow-xs">
                <div className="border-b border-stone-100 pb-3">
                  <h4 className="font-serif text-sm font-bold text-deep-espresso">
                    Service Status &amp; Save
                  </h4>
                  <p className="text-[11px] text-[#7A6B70]">
                    Save updates to Firestore and immediately refresh all client pages.
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center text-stone-600">
                    <span>Service:</span>
                    <strong className="text-deep-espresso">{formData.name || 'Untitled'}</strong>
                  </div>
                  <div className="flex justify-between items-center text-stone-600">
                    <span>Configured Plans:</span>
                    <strong className="text-deep-espresso">{plans.length}</strong>
                  </div>
                  <div className="flex justify-between items-center text-stone-600">
                    <span>Total Subplans:</span>
                    <strong className="text-[#D6204E]">
                      {plans.reduce((acc, p) => acc + (p.subplans?.length || 0), 0)}
                    </strong>
                  </div>
                  <div className="flex justify-between items-center text-stone-600">
                    <span>Starting Price:</span>
                    <strong className="font-sans text-[#D6204E]">
                      ₹{Number(formData.startingPrice || 0).toLocaleString('en-IN')}
                    </strong>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 space-y-2">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold text-white bg-gradient-to-r from-[#D6204E] to-[#B81942] hover:from-[#B81942] hover:to-[#961234] rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
                  >
                    <Check className="w-4 h-4" />
                    <span>{isEditing ? 'Save Changes' : 'Create Service'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCancel}
                    className="w-full py-2.5 px-4 text-xs font-semibold text-stone-600 hover:text-stone-900 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default ServiceFormPage;

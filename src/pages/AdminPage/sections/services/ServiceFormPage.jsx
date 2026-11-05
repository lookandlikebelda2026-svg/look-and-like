import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
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
} from 'lucide-react';
import { useContentStorage } from '../../../../services/contentStorage';
import { Layout } from '../../layout';
import { uploadImageToImageKit } from '../../../../services/imagekit';
import { compressImage } from '../../../../utils/imageCompressor';
import {
  MAIN_SERVICE_CATEGORIES,
  normalizeService,
  normalizeServiceImages,
} from '../../../../constants/services';

/**
 * Single Image Uploader Component for Main Category
 * Exactly 1 image is shown / stored for each main category.
 * Only photo upload is allowed (no external URL input).
 */
function SingleImageUploader({
  image = null,
  onImageChange,
  label = 'Cover Photo (1 Max)',
  onNotify,
  folder = '/services',
}) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const currentUrl = typeof image === 'string' ? image : image?.url || '';

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
        onImageChange({
          url: uploadResult.url,
          path: uploadResult.filePath || '',
          alt: file.name.replace(/\.[^/.]+$/, ''),
        });
        onNotify?.('Category photo uploaded successfully!', 'success');
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      onNotify?.(err.message || 'Failed to upload photo.', 'error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-1 whitespace-nowrap">
        <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-deep-espresso flex items-center gap-1 shrink-0">
          <ImageIcon className="w-3.5 h-3.5 text-[#D6204E]" />
          <span>{label}</span>
        </label>
        <span className="text-[10px] text-stone-400 shrink-0">1 photo</span>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {currentUrl ? (
        <div className="relative w-full max-w-xs h-32 sm:h-40 rounded-2xl overflow-hidden border border-[#F0CDD7] bg-[#FFF3F6] group shadow-xs">
          <img
            src={currentUrl}
            alt={label}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1 bg-white text-xs font-semibold text-deep-espresso rounded-xl hover:bg-stone-100 cursor-pointer shadow-xs"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => onImageChange(null)}
              className="px-2.5 py-1 bg-rose-600 text-xs font-semibold text-white rounded-xl hover:bg-rose-700 cursor-pointer shadow-xs"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-dashed border-[#F0CDD7] bg-[#FFF3F6] hover:bg-[#FFE8EF] text-[#D6204E] font-semibold text-xs transition-colors cursor-pointer disabled:opacity-60 shadow-2xs"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Uploading photo...</span>
            </>
          ) : (
            <>
              <UploadCloud className="w-4 h-4" />
              <span>Upload Category Photo</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}

/**
 * Dedicated Page for Creating or Editing a Parlour Service with Nested Plans & Subplans
 * 4 Main Categories: Hair Care, Nail Care, Skin Care, Make Up.
 * Clean single-line labels, compact phone inputs, zero placeholders, no URL input for photos.
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
    name: 'Hair Care',
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
          name: normalized.name || 'Hair Care',
          description: normalized.description || '',
          images: normalized.images?.slice(0, 1) || [],
          startingPrice: Number(normalized.startingPrice) || 0,
          plans: Array.isArray(normalized.plans) && normalized.plans.length > 0
            ? JSON.parse(JSON.stringify(normalized.plans)).map((p) => ({ ...p, images: [] }))
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

  // Apply Quick Preset Suggestion (4 Main Categories)
  const handleApplyPreset = (preset) => {
    setFormData((prev) => ({
      ...prev,
      name: preset.name,
      description: preset.description,
      startingPrice: preset.startingPrice,
    }));
  };

  // --- SERVICE IMAGE (Exactly 1) ---
  const handleServiceImageChange = (newImg) => {
    setFormData((prev) => ({
      ...prev,
      images: newImg ? [newImg] : [],
    }));
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
    onNotify?.(`Starting price set to ₹${minPrice.toLocaleString('en-IN')}`, 'success');
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

    if (!window.confirm(`Delete "${planName}"?`)) {
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
      onNotify?.('Please enter prices for subplans first.', 'info');
      return;
    }

    const minPrice = Math.min(...prices);
    plan.startingPrice = minPrice;
    setFormData((prev) => ({ ...prev, plans }));
    onNotify?.(`Plan price set to ₹${minPrice.toLocaleString('en-IN')}`, 'success');
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

    const categoryName = formData.name?.trim() || 'Hair Care';

    const plans = formData.plans || [];
    if (plans.length === 0) {
      onNotify?.('Please configure at least one plan.', 'error');
      return;
    }

    for (let pIdx = 0; pIdx < plans.length; pIdx++) {
      const plan = plans[pIdx];
      if (!plan.name?.trim()) {
        onNotify?.(`Plan #${pIdx + 1} is missing a name.`, 'error');
        return;
      }
      const subplans = plan.subplans || [];
      if (subplans.length === 0) {
        onNotify?.(`Plan "${plan.name}" must contain at least one subplan.`, 'error');
        return;
      }
      for (let sIdx = 0; sIdx < subplans.length; sIdx++) {
        const sub = subplans[sIdx];
        if (!sub.name?.trim()) {
          onNotify?.(`Plan "${plan.name}": Subplan #${sIdx + 1} needs a name.`, 'error');
          return;
        }
        if (typeof sub.price !== 'number' || sub.price < 0) {
          onNotify?.(`Plan "${plan.name}": Subplan "${sub.name}" requires a valid price.`, 'error');
          return;
        }
      }
    }

    const now = new Date().toISOString();

    // Clean plans without any images
    const cleanPlans = plans.map((p, pIdx) => {
      const cleanSubplans = (p.subplans || []).map((s, sIdx) => ({
        id: s.id || `subplan-${Date.now()}-${sIdx}`,
        name: s.name.trim(),
        price: Number(s.price) || 0,
      }));

      let planStart = Number(p.startingPrice);
      if (isNaN(planStart) || planStart <= 0) {
        const prices = cleanSubplans.map((s) => s.price).filter((pr) => pr > 0);
        planStart = prices.length > 0 ? Math.min(...prices) : 0;
      }

      return {
        id: p.id || `plan-${Date.now()}-${pIdx}`,
        name: p.name.trim(),
        description: p.description?.trim() || '',
        images: [],
        startingPrice: planStart,
        subplans: cleanSubplans,
      };
    });

    let serviceStart = Number(formData.startingPrice);
    if (isNaN(serviceStart) || serviceStart <= 0) {
      const pPrices = cleanPlans.map((p) => p.startingPrice).filter((pr) => pr > 0);
      serviceStart = pPrices.length > 0 ? Math.min(...pPrices) : 0;
    }

    // Exactly 1 image for main category
    const cleanImages = normalizeServiceImages(formData.images, categoryName).slice(0, 1);

    const cleanService = {
      id: formData.id || `service-${Date.now()}`,
      name: categoryName,
      description: formData.description?.trim() || '',
      images: cleanImages,
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
      onNotify?.(`Updated "${cleanService.name}"!`, 'success');
    } else {
      updatedList = [...currentList, cleanService];
      onNotify?.(`Created "${cleanService.name}"!`, 'success');
    }

    saveServicesData(updatedList);
    navigate('/admin?tab=services');
  };

  const handleCancel = () => {
    navigate('/admin?tab=services');
  };

  const plans = formData.plans || [];
  const currentCategoryImg = formData.images?.[0] || null;

  return (
    <Layout
      activeTab="services"
      title={isEditing ? (formData.name ? `Edit: ${formData.name}` : 'Edit Service') : 'Add Service'}
      onBack={handleCancel}
      headerActions={
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleCancel}
            className="px-2.5 py-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-[#D6204E] to-[#B81942] hover:from-[#B81942] hover:to-[#961234] rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>
        </div>
      }
      counts={{
        services: Array.isArray(servicesData) ? servicesData.length : 0,
        lookbook: inspiredImages?.length || 0,
        partners: partners?.length || 0,
        videos: videos?.length || 0,
      }}
    >
      <div className="max-w-6xl mx-auto pb-24 lg:pb-12">
        <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 sm:gap-6 items-start">
            {/* PRIMARY COLUMN: Service Information & Plans */}
            <div className="lg:col-span-2 space-y-3.5 sm:space-y-5">
              {/* CARD 1: MAIN CATEGORY INFORMATION */}
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-xs p-3 sm:p-5 space-y-3">
                <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
                  <div className="w-6 h-6 rounded-lg bg-[#FFF3F6] border border-[#F0CDD7] flex items-center justify-center text-[#D6204E] shrink-0">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="font-serif text-xs sm:text-base font-bold text-deep-espresso">
                    Main Service Category
                  </h3>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5 whitespace-nowrap">
                    <label className="text-[11px] sm:text-xs font-bold text-deep-espresso uppercase tracking-wider">
                      Category <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] text-stone-400">4 Categories</span>
                  </div>

                  {/* 4 Main Categories Presets - Only the buttons, no redundant empty text field */}
                  <div className="grid grid-cols-4 gap-1 sm:gap-1.5">
                    {MAIN_SERVICE_CATEGORIES.map((cat) => {
                      const isSelected = formData.name.toLowerCase() === cat.name.toLowerCase();
                      return (
                        <button
                          key={cat.name}
                          type="button"
                          onClick={() => handleApplyPreset(cat)}
                          className={`px-1 py-2 text-[10px] sm:text-xs font-bold rounded-xl border text-center transition-all cursor-pointer truncate ${
                            isSelected
                              ? 'bg-[#FFF3F6] text-[#D6204E] border-[#F0CDD7] ring-1 ring-[#D6204E]/30 shadow-2xs'
                              : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                          }`}
                        >
                          {cat.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-deep-espresso mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#D6204E]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1 whitespace-nowrap">
                    <label className="text-[11px] sm:text-xs font-bold text-deep-espresso uppercase tracking-wider">
                      Starting Price (₹)
                    </label>
                    <button
                      type="button"
                      onClick={handleAutoCalculateServicePrice}
                      className="text-[10px] font-semibold text-[#D6204E] hover:underline cursor-pointer"
                    >
                      ✦ Auto-calculate
                    </button>
                  </div>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1.5 text-xs font-bold text-stone-400">₹</span>
                    <input
                      type="number"
                      min="0"
                      value={formData.startingPrice || ''}
                      onChange={(e) => setFormData({ ...formData, startingPrice: Number(e.target.value) || 0 })}
                      className="w-full pl-6 pr-2.5 py-1.5 text-xs font-semibold text-deep-espresso rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#D6204E]"
                    />
                  </div>
                </div>

                {/* Main Category Image Section - Exactly 1 image, photo upload only */}
                <div className="pt-2 border-t border-stone-100">
                  <SingleImageUploader
                    image={currentCategoryImg}
                    onImageChange={handleServiceImageChange}
                    label="Cover Photo (1 Max)"
                    onNotify={onNotify}
                    folder="/services"
                  />
                </div>
              </div>

              {/* CARD 2: PLANS & SUBPLANS MANAGEMENT (NO IMAGES FOR PLANS) */}
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-xs p-3 sm:p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2 flex-nowrap gap-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div className="w-6 h-6 rounded-lg bg-[#FFF3F6] border border-[#F0CDD7] flex items-center justify-center text-[#D6204E] shrink-0">
                      <Layers className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="font-serif text-xs sm:text-base font-bold text-deep-espresso truncate">
                      Plans &amp; Subplans
                    </h3>
                    <span className="text-[10px] font-semibold text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded-full shrink-0">
                      {plans.length}
                    </span>
                  </div>

                  {plans.length > 0 && (
                    <button
                      type="button"
                      onClick={handleAddPlan}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#D6204E] bg-[#FFF3F6] hover:bg-[#FFE8EF] border border-[#F0CDD7] rounded-xl transition-all cursor-pointer shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Plan</span>
                    </button>
                  )}
                </div>

                {plans.length === 0 ? (
                  <div className="text-center py-6 px-4 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                    <p className="text-xs text-stone-500 mb-2">No price plans added yet.</p>
                    <button
                      type="button"
                      onClick={handleAddPlan}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-[#D6204E] rounded-xl cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add First Plan</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {plans.map((plan, planIdx) => {
                      const subplans = plan.subplans || [];
                      return (
                        <div
                          key={plan.id || planIdx}
                          className="bg-[#FAF8F5] rounded-xl sm:rounded-2xl border border-stone-200/90 p-2.5 sm:p-4 space-y-2.5 relative group"
                        >
                          {/* Plan Top Bar */}
                          <div className="flex items-center justify-between gap-1.5 border-b border-stone-200/60 pb-1.5">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="w-4 h-4 rounded-full bg-[#D6204E] text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                                {planIdx + 1}
                              </span>
                              <span className="text-xs font-bold text-deep-espresso truncate">
                                {plan.name || `Plan #${planIdx + 1}`}
                              </span>
                            </div>

                            <div className="flex items-center gap-0.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleMovePlan(planIdx, -1)}
                                disabled={planIdx === 0}
                                className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-20 cursor-pointer rounded-lg hover:bg-stone-200/60 transition-colors"
                                title="Move up"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMovePlan(planIdx, 1)}
                                disabled={planIdx === plans.length - 1}
                                className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-20 cursor-pointer rounded-lg hover:bg-stone-200/60 transition-colors"
                                title="Move down"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeletePlan(planIdx)}
                                className="p-1 text-stone-400 hover:text-rose-600 cursor-pointer rounded-lg hover:bg-rose-50 transition-colors"
                                title="Delete plan"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Plan Fields */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[11px] font-bold text-deep-espresso mb-1">
                                Plan Name <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="text"
                                required
                                value={plan.name || ''}
                                onChange={(e) => handleUpdatePlan(planIdx, 'name', e.target.value)}
                                className="w-full px-2.5 py-1.5 text-xs font-semibold rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#D6204E]"
                              />
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-1 whitespace-nowrap">
                                <label className="text-[11px] font-bold text-deep-espresso">
                                  Starting Price (₹)
                                </label>
                                <button
                                  type="button"
                                  onClick={() => handleAutoCalculatePlanPrice(planIdx)}
                                  className="text-[10px] font-semibold text-[#D6204E] hover:underline cursor-pointer"
                                >
                                  ✦ Auto
                                </button>
                              </div>
                              <div className="relative">
                                <span className="absolute left-2.5 top-1.5 text-xs font-bold text-stone-400">₹</span>
                                <input
                                  type="number"
                                  min="0"
                                  value={plan.startingPrice || ''}
                                  onChange={(e) => handleUpdatePlan(planIdx, 'startingPrice', Number(e.target.value) || 0)}
                                  className="w-full pl-6 pr-2.5 py-1.5 text-xs font-semibold rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#D6204E]"
                                />
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-deep-espresso mb-1">
                              Description (Optional)
                            </label>
                            <input
                              type="text"
                              value={plan.description || ''}
                              onChange={(e) => handleUpdatePlan(planIdx, 'description', e.target.value)}
                              className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#D6204E]"
                            />
                          </div>

                          {/* Subplans List (No images, compact single-row on mobile) */}
                          <div className="pt-1.5 border-t border-stone-200/60 space-y-1.5">
                            <div className="flex items-center justify-between whitespace-nowrap">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-deep-espresso">
                                Options ({subplans.length})
                              </span>
                              <button
                                type="button"
                                onClick={() => handleAddSubplan(planIdx)}
                                className="inline-flex items-center gap-0.5 text-[11px] font-bold text-[#D6204E] hover:underline cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Add Option</span>
                              </button>
                            </div>

                            <div className="space-y-1">
                              {subplans.map((sub, subIdx) => (
                                <div
                                  key={sub.id || subIdx}
                                  className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-stone-200 shadow-2xs"
                                >
                                  <span className="text-[10px] font-bold text-stone-400 w-4 text-center shrink-0">
                                    #{subIdx + 1}
                                  </span>

                                  <input
                                    type="text"
                                    required
                                    value={sub.name || ''}
                                    onChange={(e) =>
                                      handleUpdateSubplan(planIdx, subIdx, 'name', e.target.value)
                                    }
                                    className="flex-1 min-w-0 px-2 py-1 text-xs font-semibold rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#D6204E]"
                                  />

                                  <div className="relative w-20 sm:w-24 shrink-0">
                                    <span className="absolute left-2 top-1 text-xs font-bold text-stone-400">₹</span>
                                    <input
                                      type="number"
                                      min="0"
                                      required
                                      value={sub.price ?? ''}
                                      onChange={(e) =>
                                        handleUpdateSubplan(planIdx, subIdx, 'price', e.target.value)
                                      }
                                      className="w-full pl-5 pr-1.5 py-1 text-xs font-bold text-[#D6204E] rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#D6204E]"
                                    />
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => handleDeleteSubplan(planIdx, subIdx)}
                                    className="p-1 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer rounded-lg hover:bg-rose-50 shrink-0"
                                    title="Delete option"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* SIDEBAR COLUMN: Summary */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 p-4 sm:p-5 space-y-3.5 shadow-xs">
                <div className="border-b border-stone-100 pb-2">
                  <h4 className="font-serif text-sm font-bold text-deep-espresso">
                    Summary
                  </h4>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center text-stone-600">
                    <span>Category:</span>
                    <strong className="text-deep-espresso truncate max-w-[140px]">
                      {formData.name || 'Hair Care'}
                    </strong>
                  </div>
                  <div className="flex justify-between items-center text-stone-600">
                    <span>Cover Photo:</span>
                    <strong className="text-deep-espresso">
                      {formData.images?.length > 0 ? '1 Photo' : 'None'}
                    </strong>
                  </div>
                  <div className="flex justify-between items-center text-stone-600">
                    <span>Plans:</span>
                    <strong className="text-deep-espresso">{plans.length}</strong>
                  </div>
                  <div className="flex justify-between items-center text-stone-600">
                    <span>Subplans:</span>
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
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default ServiceFormPage;

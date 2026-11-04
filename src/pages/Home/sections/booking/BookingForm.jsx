import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Calendar,
  Clock,
  User,
  Phone,
  ArrowRight,
  ArrowLeft,
  Check,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react';
import { BRANCHES } from '../../../../constants/branches';
import { CURATED_MENU_DATA } from '../../../../constants/services';
import { saveBookingToFirebase } from '../../../../services/bookingFirebaseService';
import { WhatsAppIcon } from '../../../../components/icons';

// 5 Core Salon Categories (Pure Typography, No Emojis)
const CATEGORIES = [
  { id: 'hair', label: 'Hair' },
  { id: 'skin', label: 'Skin Care' },
  { id: 'nails', label: 'Nails' },
  { id: 'makeup', label: 'Make Up' },
  { id: 'spa', label: 'Spa' },
];

// Time Slot Windows (Clean Labels, No Emojis)
const TIME_SLOTS = [
  { id: 'morning', label: 'Morning', range: '10:00 AM – 1:00 PM' },
  { id: 'afternoon', label: 'Afternoon', range: '1:00 PM – 5:00 PM' },
  { id: 'evening', label: 'Evening', range: '5:00 PM – 8:00 PM' },
];

/**
 * Generate quick date choices: Today, Tomorrow, Day After
 */
function getQuickDates() {
  const list = [];
  const now = new Date();

  for (let i = 0; i < 3; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const iso = `${year}-${month}-${day}`;

    const label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
    const subLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    list.push({ label, subLabel, iso, isDefault: i === 1 });
  }
  return list;
}

/**
 * Custom Made Luxury Service Dropdown
 * Styled precisely to match Look & Like brand colors (#D6204E, #F0CDD7, #FFF3F6, Deep Espresso #2A1F1B)
 * Smooth floating popover with dedicated luxury rose scrollbar, peek indicator, and zero layout breakage.
 */
function CustomServiceDropdown({ services = [], selectedId, onSelect, category }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const listRef = useRef(null);

  const selectedService = services.find((s) => s.id === selectedId) || services[0];

  // Auto-close when switching category
  useEffect(() => {
    setIsOpen(false);
  }, [category]);

  // Smooth container-isolated scroll to selected item when opened
  useEffect(() => {
    if (isOpen && listRef.current) {
      const selectedBtn = listRef.current.querySelector('[data-selected="true"]');
      if (selectedBtn) {
        selectedBtn.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [isOpen]);

  // Click outside & Escape key listeners
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Dropdown Trigger Header */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between p-2.5 sm:p-3 rounded-2xl bg-white border transition-all cursor-pointer text-left ${
          isOpen
            ? 'border-[#D6204E] ring-2 ring-[#D6204E]/15 shadow-xs'
            : 'border-[#F0CDD7] hover:border-[#D6204E]/70 hover:bg-[#FFF8FA] shadow-2xs'
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="min-w-0 flex-1 pr-2">
          <p className="text-xs sm:text-sm font-bold text-deep-espresso truncate">
            {selectedService?.name || 'Select a ritual'}
          </p>
          <p className="text-[10px] sm:text-[11px] text-[#7A6B70] mt-0.5">
            {selectedService?.duration || 'Standard Session'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-bold font-sans font-price text-[#D6204E] bg-[#FFF3F6] border border-[#F0CDD7]">
            {selectedService?.price}
          </span>
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-200 ${
              isOpen ? 'bg-[#FFF3F6] text-[#D6204E] rotate-180' : 'text-[#D6204E]'
            }`}
          >
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </button>

      {/* Floating Scrollable Dropdown Menu with Luxury Rose Scrollbar */}
      {isOpen && (
        <div
          ref={listRef}
          className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white/98 backdrop-blur-md border border-[#F0CDD7] rounded-2xl shadow-[0_18px_45px_-8px_rgba(42,31,27,0.22)] p-1.5 pr-2 space-y-1 max-h-[225px] sm:max-h-[240px] overflow-y-auto overscroll-contain scroll-smooth touch-pan-y animate-in fade-in zoom-in-95 duration-150 luxury-scrollbar"
        >
          {services.map((srv) => {
            const isSelected = srv.id === selectedId;
            return (
              <button
                key={srv.id}
                type="button"
                data-selected={isSelected ? 'true' : 'false'}
                onClick={() => {
                  onSelect(srv.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between p-2 sm:p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#FFF3F6] text-[#D6204E] font-semibold border border-[#F0CDD7]'
                    : 'bg-white hover:bg-[#FFF8FA] text-deep-espresso border border-transparent hover:border-[#F0CDD7]/50'
                }`}
              >
                <div className="min-w-0 flex-1 pr-2">
                  <div className="flex items-center gap-1.5">
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-[#D6204E] stroke-[2.5] shrink-0" />
                    )}
                    <p className={`text-xs font-bold truncate ${isSelected ? 'text-[#D6204E]' : 'text-deep-espresso'}`}>
                      {srv.name}
                    </p>
                  </div>
                  <p className="text-[10px] text-[#7A6B70] mt-0.5 pl-0.5">
                    {srv.duration}
                  </p>
                </div>

                <span className="text-xs font-sans font-price font-bold text-[#D6204E] shrink-0">
                  {srv.price}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * Professional Luxury Mobile-First Booking Form
 * Fits 100% within mobile viewport without vertical scrolling.
 * Automatically saves to Firestore and redirects directly to WhatsApp.
 */
export function BookingForm({ preselectedCategory, onNotify, onClose }) {
  const quickDates = useMemo(() => getQuickDates(), []);

  // Wizard Step: 1 (Ritual & Studio), 2 (Date & Time), 3 (Guest Info), or 'confirmed'
  const [step, setStep] = useState(1);

  // Form State
  const [category, setCategory] = useState('hair');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [branchId, setBranchId] = useState('belda');

  // Schedule State (Default to Tomorrow)
  const [dateIso, setDateIso] = useState(() => quickDates[1]?.iso || quickDates[0]?.iso);
  const [isCustomDate, setIsCustomDate] = useState(false);
  const [timeSlot, setTimeSlot] = useState('afternoon');

  // Guest State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [generatedWhatsAppUrl, setGeneratedWhatsAppUrl] = useState('');

  // Synchronize preselected category and service from props
  useEffect(() => {
    if (!preselectedCategory) return;

    let targetCat = 'hair';
    let targetService = null;

    if (typeof preselectedCategory === 'object' && preselectedCategory !== null) {
      targetCat = preselectedCategory.category || 'hair';
      targetService = preselectedCategory.service || null;
    } else if (typeof preselectedCategory === 'string') {
      targetCat = preselectedCategory;
    }

    // Normalize category keys
    if (targetCat.includes('skin')) targetCat = 'skin';
    else if (targetCat.includes('hair')) targetCat = 'hair';
    else if (targetCat.includes('nail')) targetCat = 'nails';
    else if (targetCat.includes('makeup') || targetCat.includes('make-up')) targetCat = 'makeup';
    else if (targetCat.includes('spa')) targetCat = 'spa';

    setCategory(targetCat);

    // Resolve service inside category
    const catData = CURATED_MENU_DATA[targetCat] || CURATED_MENU_DATA.hair;
    if (targetService) {
      const search = String(targetService).toLowerCase().trim();
      const matched = catData.items.find(
        (s) =>
          s.id.toLowerCase() === search ||
          s.name.toLowerCase().includes(search) ||
          (s.bookingService && s.bookingService.toLowerCase() === search)
      );
      if (matched) {
        setSelectedServiceId(matched.id);
      } else if (catData.items[0]) {
        setSelectedServiceId(catData.items[0].id);
      }
    } else if (catData.items[0]) {
      setSelectedServiceId(catData.items[0].id);
    }
  }, [preselectedCategory]);

  // Current Category Services List
  const currentCategoryData = CURATED_MENU_DATA[category] || CURATED_MENU_DATA.hair;
  const servicesList = currentCategoryData.items || [];

  // Current Selected Service Object
  const currentService = useMemo(() => {
    return servicesList.find((s) => s.id === selectedServiceId) || servicesList[0] || {
      id: 'custom',
      name: 'Atelier Consultation',
      price: 'Price on Selection',
      duration: '60 Mins',
    };
  }, [servicesList, selectedServiceId]);

  // Ensure selectedServiceId is initialized
  useEffect(() => {
    if (!selectedServiceId && servicesList.length > 0) {
      setSelectedServiceId(servicesList[0].id);
    }
  }, [category, servicesList, selectedServiceId]);

  // Current Selected Branch Object
  const currentBranch = useMemo(() => {
    return BRANCHES.find((b) => b.id === branchId) || BRANCHES[0];
  }, [branchId]);

  // Current Selected Time Slot Object
  const currentTimeSlot = useMemo(() => {
    return TIME_SLOTS.find((t) => t.id === timeSlot) || TIME_SLOTS[1];
  }, [timeSlot]);

  // Human Readable Formatted Date
  const formattedDate = useMemo(() => {
    if (!dateIso) return 'Tomorrow';
    try {
      const parts = dateIso.split('-');
      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      return dateIso;
    }
  }, [dateIso]);

  // Handle Category Change
  const handleCategorySelect = (newCat) => {
    setCategory(newCat);
    const catData = CURATED_MENU_DATA[newCat];
    if (catData?.items?.[0]) {
      setSelectedServiceId(catData.items[0].id);
    }
  };

  // Build Formatted WhatsApp Message (No Emojis, No Artist Name)
  const buildWhatsAppMessage = () => {
    return (
      `Hello Look & Like Salon,\n\n` +
      `I would like to reserve a chair:\n` +
      `• Branch: ${currentBranch.name}\n` +
      `• Category: ${currentCategoryData.title || category.toUpperCase()}\n` +
      `• Service: ${currentService.name} (${currentService.price})\n` +
      `• Date: ${formattedDate} (${dateIso})\n` +
      `• Time Slot: ${currentTimeSlot.label} (${currentTimeSlot.range})\n\n` +
      `Guest Details:\n` +
      `• Name: ${name.trim()}\n` +
      `• WhatsApp: ${phone.trim()}\n` +
      (notes.trim() ? `• Special Note: ${notes.trim()}\n\n` : `\n`) +
      `Please confirm availability. Thank you!`
    );
  };

  // Final Submit: Direct WhatsApp Dispatch & Background Persistence
  const handleFinalSubmit = (e) => {
    if (e) e.preventDefault();

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    // Field-level validation
    const errors = {};
    if (!trimmedName) errors.name = true;
    if (!trimmedPhone || trimmedPhone.replace(/[^0-9]/g, '').length < 8) errors.phone = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      if (errors.name) {
        onNotify?.('Please enter your full name.', 'error');
      } else if (errors.phone) {
        onNotify?.('Please enter a valid WhatsApp mobile number (min 8 digits).', 'error');
      }
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    const messageText = buildWhatsAppMessage();
    const encodedMessage = encodeURIComponent(messageText);
    const cleanNumber = String(currentBranch.whatsAppNumber || '917872624993').replace(/[^0-9]/g, '');
    const whatsAppUrl = `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${encodedMessage}`;

    setGeneratedWhatsAppUrl(whatsAppUrl);

    // 1. Immediately launch WhatsApp synchronously within user gesture (avoids browser popup blocker)
    const isMobile = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = whatsAppUrl;
    } else {
      const opened = window.open(whatsAppUrl, '_blank', 'noopener,noreferrer');
      if (!opened || opened.closed || typeof opened.closed === 'undefined') {
        window.location.href = whatsAppUrl;
      }
    }

    // 2. Persist booking to Firebase asynchronously in background (never blocks UI or WhatsApp redirect)
    saveBookingToFirebase({
      name: trimmedName,
      phone: trimmedPhone,
      notes: notes.trim() || null,
      branch: currentBranch.name,
      branchId: currentBranch.id,
      category,
      service: currentService.name,
      serviceId: currentService.id,
      price: currentService.price,
      duration: currentService.duration,
      date: dateIso,
      dateFormatted: formattedDate,
      timeSlot: `${currentTimeSlot.label} (${currentTimeSlot.range})`,
      status: 'pending',
    }).catch((err) => {
      console.warn('Firebase booking persistence notice:', err);
    });

    setIsSubmitting(false);
    setIsConfirmed(true);
    onNotify?.('Booking created! Opening WhatsApp...', 'success');
  };

  // -------------------------------------------------------------
  // RENDER: Confirmation & Redirect State
  // -------------------------------------------------------------
  if (isConfirmed) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-3 sm:py-5 animate-fade-in select-none">
        {/* WhatsApp Green Icon Badge */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#E8F8EE] border border-[#25D366]/40 text-[#25D366] flex items-center justify-center mb-3 sm:mb-4 shadow-sm">
          <WhatsAppIcon className="w-7 h-7 sm:w-8 sm:h-8" />
        </div>

        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#E8F8EE] text-[#1EBE5D] border border-[#25D366]/30 mb-2">
          WhatsApp Dispatch
        </span>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-deep-espresso">
          Reservation Request Prepared
        </h3>

        <p className="text-xs sm:text-sm text-[#7A6B70] max-w-sm mx-auto mt-1 sm:mt-1.5 leading-relaxed">
          Thank you, <strong className="text-deep-espresso">{name}</strong>. Opening WhatsApp to connect with our concierge. If it didn't open automatically, tap below:
        </p>

        {/* Compact Appointment Details Summary */}
        <div className="w-full max-w-sm my-3 sm:my-4 p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#F0CDD7] text-left text-xs space-y-2 shadow-2xs">
          <div className="flex justify-between items-center">
            <span className="text-stone-500 font-medium">Service:</span>
            <span className="font-bold text-deep-espresso truncate max-w-[200px]">{currentService.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-stone-500 font-medium">Branch:</span>
            <span className="font-semibold text-deep-espresso">{currentBranch.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-stone-500 font-medium">Schedule:</span>
            <span className="font-semibold text-[#D6204E]">{formattedDate} · {currentTimeSlot.label}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="w-full max-w-sm flex flex-col gap-2 pt-1">
          <a
            href={generatedWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold text-xs sm:text-sm py-3 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-center"
          >
            <WhatsAppIcon className="w-4 h-4 fill-white" />
            <span>Open WhatsApp Chat</span>
          </a>

          <button
            type="button"
            onClick={() => {
              if (onClose) onClose();
              setIsConfirmed(false);
              setStep(1);
            }}
            className="w-full py-2.5 text-xs font-semibold text-stone-600 hover:text-deep-espresso rounded-xl border border-stone-200 hover:bg-stone-50 transition-colors cursor-pointer"
          >
            Done &amp; Close
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: 3-Step Wizard Layout (Compact & Zero Scroll)
  // -------------------------------------------------------------
  return (
    <div className="w-full flex flex-col justify-between select-none">
      {/* 1. Header & Stepper Progress Indicator */}
      <div className="mb-3 sm:mb-4 pb-2.5 sm:pb-3 border-b border-[#F0CDD7]/80 pr-9 sm:pr-10">
        <div className="flex items-center gap-2.5 mb-2">
          <h4 className="font-serif text-sm sm:text-base font-bold text-deep-espresso tracking-tight">
            Reserve Your Chair
          </h4>
          <span className="text-[10px] font-semibold text-[#D6204E] bg-[#FFF3F6] px-2 py-0.5 rounded-full border border-[#F0CDD7]">
            Step {step} of 3
          </span>
        </div>

        {/* 3 Step Pills */}
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { s: 1, label: 'Ritual & Branch' },
            { s: 2, label: 'Date & Time' },
            { s: 3, label: 'Your Details' },
          ].map(({ s, label }) => {
            const isActive = step === s;
            const isCompleted = step > s;

            return (
              <button
                key={s}
                type="button"
                onClick={() => {
                  if (isCompleted) setStep(s);
                }}
                disabled={!isCompleted && !isActive}
                className={`flex items-center justify-center gap-1.5 py-1 px-1 text-[9px] sm:text-[10px] font-semibold transition-all cursor-pointer rounded-lg ${
                  isActive
                    ? 'border-b-2 border-[#D6204E] text-[#D6204E] bg-[#FFF8FA]'
                    : isCompleted
                    ? 'bg-[#FFF3F6] text-[#D6204E] border border-[#F0CDD7] hover:bg-[#FFE8EF]'
                    : 'text-stone-400'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-3 h-3 stroke-[2.5]" />
                ) : (
                  <span>{s}.</span>
                )}
                <span className="truncate">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Step Views */}
      <div className="flex flex-col justify-between">
        {/* ============================================================ */}
        {/* STEP 1: Service Category, Specific Ritual & Atelier Branch  */}
        {/* ============================================================ */}
        {step === 1 && (
          <div className="space-y-3 animate-fade-in">
            {/* Category Selector Pills (Clean Typography, No Emojis) */}
            <div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-stone-500 block mb-1.5">
                Category
              </span>
              <div className="grid grid-cols-5 gap-1 sm:gap-1.5">
                {CATEGORIES.map((cat) => {
                  const isCatSelected = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`py-1.5 px-1 rounded-xl text-[11px] sm:text-xs font-bold text-center transition-all cursor-pointer border ${
                        isCatSelected
                          ? 'bg-[#D6204E] text-white border-[#D6204E] shadow-xs'
                          : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                      }`}
                    >
                      <span className="truncate block">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Made Service Dropdown matching Website Brand Colors */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-stone-500">
                  Select Service
                </span>
                <span className="text-[10px] text-stone-400 font-mono">
                  {servicesList.length} rituals available
                </span>
              </div>

              <CustomServiceDropdown
                services={servicesList}
                selectedId={selectedServiceId}
                onSelect={setSelectedServiceId}
                category={category}
              />
            </div>

            {/* Branch Selection Pills */}
            <div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-stone-500 block mb-1.5">
                Select Branch
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {BRANCHES.map((b) => {
                  const isBranchSelected = branchId === b.id;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setBranchId(b.id)}
                      className={`py-2 px-1 rounded-xl border text-center transition-all cursor-pointer ${
                        isBranchSelected
                          ? 'bg-deep-espresso text-white border-deep-espresso shadow-xs'
                          : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <p className="text-[11px] sm:text-xs font-bold truncate leading-tight">
                        {b.name}
                      </p>
                      <p className="text-[9px] opacity-75 truncate mt-0.5">
                        {b.addressShort}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* STEP 2: Date & Time Window (No Artist, No Emojis)            */}
        {/* ============================================================ */}
        {step === 2 && (
          <div className="space-y-3.5 animate-fade-in">
            {/* Quick Date Pills */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#D6204E]" />
                  <span>Select Date</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsCustomDate(!isCustomDate)}
                  className="text-[10px] text-[#D6204E] hover:underline font-semibold cursor-pointer"
                >
                  {isCustomDate ? 'Quick Shortcuts' : 'Pick Calendar Date'}
                </button>
              </div>

              {!isCustomDate ? (
                <div className="grid grid-cols-3 gap-1.5">
                  {quickDates.map((item) => {
                    const isSelected = dateIso === item.iso;
                    return (
                      <button
                        key={item.iso}
                        type="button"
                        onClick={() => setDateIso(item.iso)}
                        className={`py-2.5 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#D6204E] text-white border-[#D6204E] shadow-xs'
                            : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <span className="block text-xs font-bold leading-tight">
                          {item.label}
                        </span>
                        <span className="block text-[10px] opacity-80 mt-0.5">
                          {item.subLabel}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={dateIso}
                    onChange={(e) => setDateIso(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#D6204E]/40 font-mono bg-white"
                  />
                </div>
              )}
            </div>

            {/* Time Slot Window Chips */}
            <div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-stone-500 block mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#D6204E]" />
                <span>Preferred Time Slot</span>
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {TIME_SLOTS.map((slot) => {
                  const isSlotSelected = timeSlot === slot.id;
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setTimeSlot(slot.id)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        isSlotSelected
                          ? 'bg-[#FFF3F6] border-[#D6204E] text-[#D6204E] ring-1 ring-[#D6204E]/50 shadow-2xs'
                          : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <span className="text-xs font-bold block leading-tight">
                        {slot.label}
                      </span>
                      <span className="text-[10px] text-stone-500 block mt-0.5">
                        {slot.range}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selection Overview Bar */}
            <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-border-warm text-xs text-stone-700 flex items-center justify-between">
              <div className="truncate pr-2">
                <span className="font-semibold text-deep-espresso">{currentBranch.name}</span>
                <span className="text-stone-400 mx-1.5">·</span>
                <span className="truncate">{currentService.name}</span>
              </div>
              <span className="font-bold text-[#D6204E] shrink-0 font-sans font-price">
                {currentService.price}
              </span>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* STEP 3: Guest Details & Direct WhatsApp Dispatch             */}
        {/* ============================================================ */}
        {step === 3 && (
          <form onSubmit={handleFinalSubmit} className="space-y-3 animate-fade-in">
            {/* Live Appointment Summary Card */}
            <div className="p-2.5 sm:p-3 rounded-2xl bg-[#FFF3F6] border border-[#F0CDD7] text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-deep-espresso truncate">
                  {currentService.name}
                </span>
                <span className="font-bold text-[#D6204E] font-sans font-price shrink-0">
                  {currentService.price}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#7A6B70]">
                <span>{currentBranch.name}</span>
                <span>{formattedDate} · {currentTimeSlot.label}</span>
              </div>
            </div>

            {/* Guest Name Input */}
            <div>
              <label htmlFor="guest-full-name" className="block text-[10px] sm:text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                Your Full Name <span className="text-[#D6204E]">*</span>
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="guest-full-name"
                  type="text"
                  required
                  placeholder="e.g. Eleanor Vance"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (formErrors.name) setFormErrors((prev) => ({ ...prev, name: false }));
                  }}
                  className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border bg-white focus:outline-none transition-all ${
                    formErrors.name
                      ? 'border-red-500 ring-1 ring-red-500 bg-red-50/20'
                      : 'border-stone-200 focus:ring-2 focus:ring-[#D6204E]/40'
                  }`}
                />
              </div>
              {formErrors.name && (
                <p className="text-[10px] text-red-500 mt-0.5 pl-1">Please enter your full name</p>
              )}
            </div>

            {/* Guest WhatsApp Number Input */}
            <div>
              <label htmlFor="guest-whatsapp-number" className="block text-[10px] sm:text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                WhatsApp Mobile Number <span className="text-[#D6204E]">*</span>
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="guest-whatsapp-number"
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (formErrors.phone) setFormErrors((prev) => ({ ...prev, phone: false }));
                  }}
                  className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border bg-white focus:outline-none font-mono transition-all ${
                    formErrors.phone
                      ? 'border-red-500 ring-1 ring-red-500 bg-red-50/20'
                      : 'border-stone-200 focus:ring-2 focus:ring-[#D6204E]/40'
                  }`}
                />
              </div>
              {formErrors.phone && (
                <p className="text-[10px] text-red-500 mt-0.5 pl-1">Please enter a valid mobile number (min 8 digits)</p>
              )}
            </div>

            {/* Optional Special Request */}
            <div>
              <label htmlFor="booking-notes" className="block text-[10px] sm:text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                Special Request (Optional)
              </label>
              <input
                id="booking-notes"
                type="text"
                placeholder="e.g. Sensitive scalp, bridal consultation..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#D6204E]/40 bg-white"
              />
            </div>
          </form>
        )}

        {/* 3. Navigation Controls Bar */}
        <div className="pt-3 mt-3 border-t border-stone-100 flex items-center gap-2">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="px-3 py-2.5 rounded-xl border border-stone-200 hover:border-stone-300 text-stone-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="flex-1 bg-[#D6204E] hover:bg-[#B81942] text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
            >
              <span>{step === 1 ? 'Continue to Schedule' : 'Continue to Details'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-75"
            >
              <WhatsAppIcon className="w-4 h-4 fill-white" />
              <span>{isSubmitting ? 'Opening WhatsApp...' : 'Book on WhatsApp'}</span>
            </button>
          )}
        </div>
      </div>

    </div>
  );
}

export default BookingForm;

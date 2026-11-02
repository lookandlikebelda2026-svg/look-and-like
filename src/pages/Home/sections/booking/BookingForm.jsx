import React, { useState } from 'react';
import { BRANCHES } from '../../../../constants/branches';
import { BOOKING_SERVICES_LIST } from '../../../../constants/services';
import { saveBookingToFirebase } from '../../../../services/bookingFirebaseService';

export function BookingForm({ preselectedCategory, onNotify, onClose }) {
  const [branch, setBranch] = useState('city-centre');
  const [category, setCategory] = useState(preselectedCategory || 'hair');
  const [service, setService] = useState('balayage');
  const [artist, setArtist] = useState('sienna');
  const [date, setDate] = useState('2025-05-18');
  const [timeSlot, setTimeSlot] = useState('afternoon');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Sync category & specific service if preselectedCategory changes
  React.useEffect(() => {
    if (preselectedCategory) {
      const cat = typeof preselectedCategory === 'object' ? preselectedCategory.category : preselectedCategory;
      const srv = typeof preselectedCategory === 'object' ? preselectedCategory.service : null;

      if (cat === 'skin-care' || cat === 'skin') {
        setCategory('skin');
        setService(srv || 'glowfacial');
      } else if (cat === 'hair-spa' || cat === 'hair') {
        setCategory('hair');
        setService(srv || 'balayage');
      } else if (cat === 'nail-care' || cat === 'nails') {
        setCategory('nails');
        setService(srv || 'gelmanicure');
      } else if (cat === 'makeup') {
        setCategory('makeup');
        setService(srv || 'redcarpet');
      } else if (cat === 'spa') {
        setCategory('spa');
        setService(srv || 'massage');
      } else if (srv) {
        setService(srv);
      }
    }
  }, [preselectedCategory]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedBranchData = BRANCHES.find((b) => b.id === branch) || BRANCHES[0];
  const selectedServiceData = BOOKING_SERVICES_LIST.find((s) => s.value === service) || BOOKING_SERVICES_LIST[0];

  const artistMap = {
    any: 'First Available Master Artist',
    isabella: 'Isabella Moore — Creative Director',
    sienna: 'Sienna Clarke — Balayage Specialist',
    camille: 'Camille Dubois — Senior Esthetician',
    zoe: 'Zoe Harper — Bridal & Editorial Artist'
  };

  const timeMap = {
    morning: 'Morning (10:00 AM – 1:00 PM)',
    afternoon: 'Afternoon (1:00 PM – 5:00 PM)',
    evening: 'Evening (5:00 PM – 8:00 PM)'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      if (onNotify) onNotify('Please fill in your name and WhatsApp number.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await saveBookingToFirebase({
        name: name.trim(),
        phone: phone.trim(),
        branch: selectedBranchData.name,
        branchId: branch,
        category,
        service: selectedServiceData.label,
        serviceId: service,
        artist: artistMap[artist] || artist,
        artistId: artist,
        date,
        timeSlot: timeMap[timeSlot] || timeSlot,
      });
    } catch (err) {
      console.warn('Firebase booking sync notice:', err);
    } finally {
      setIsSubmitting(false);
      setIsConfirmed(true);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Maison Belle,\n\nI would like to reserve a chair at your *${selectedBranchData.name}*:\n` +
    `• Guest: ${name}\n` +
    `• Service: ${selectedServiceData.label}\n` +
    `• Artist: ${artistMap[artist] || artist}\n` +
    `• Date: ${date}\n` +
    `• Slot: ${timeMap[timeSlot] || timeSlot}\n` +
    `• WhatsApp: ${phone}\n\nPlease confirm availability. Thank you!`
  );

  const whatsappLink = `https://wa.me/${selectedBranchData.whatsAppNumber}?text=${whatsappMessage}`;

  if (isConfirmed) {
    return (
      <div className="flex flex-col gap-5 py-2">
        <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
          <span className="material-symbols-outlined text-[32px]">check_circle</span>
        </div>
        <div className="text-center">
          <h3 className="font-display-md text-2xl text-deep-espresso">
            Reservation Request Prepared
          </h3>
          <p className="font-body-md text-sm text-on-surface-variant mt-2 max-w-lg mx-auto">
            Thank you, <strong className="text-deep-espresso">{name}</strong>! Your appointment inquiry for{' '}
            <strong className="text-deep-espresso">{selectedServiceData.label}</strong> at{' '}
            <strong className="text-deep-espresso">{selectedBranchData.name}</strong> on{' '}
            <strong className="text-deep-espresso">{date}</strong> ({timeMap[timeSlot]}) is ready.
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] border border-border-warm space-y-2 text-xs sm:text-sm">
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Atelier Location:</span>
            <span className="font-semibold text-deep-espresso">{selectedBranchData.bookingShortName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Specialist:</span>
            <span className="font-semibold text-deep-espresso">{artistMap[artist]}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Guest Mobile:</span>
            <span className="font-semibold text-deep-espresso">{phone}</span>
          </div>
        </div>

        <p className="text-xs text-on-surface-variant text-center">
          Click below to launch WhatsApp and send your pre-formatted appointment request to our concierge.
        </p>

        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 pt-2">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            onClick={() => {
              if (onClose) onClose();
              setIsConfirmed(false);
            }}
            className="flex-1 bg-whatsapp-green text-white hover:bg-emerald-600 font-label-md text-xs uppercase tracking-wider py-3.5 rounded-full transition-colors shadow-md flex items-center justify-center gap-2 text-center"
          >
            <span className="material-symbols-outlined text-[20px]">chat</span>
            <span>Open in WhatsApp</span>
          </a>
          <button
            type="button"
            onClick={() => setIsConfirmed(false)}
            className="px-6 py-3 rounded-full border border-border-warm text-xs uppercase tracking-wider text-deep-espresso hover:bg-neutral-100 transition-colors cursor-pointer text-center"
          >
            Edit Details
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full" id="branch-booking">
      <div className="flex items-center gap-2 sm:gap-2.5 mb-2">
        <span className="material-symbols-outlined text-terracotta-rose text-[22px] sm:text-[26px]">
          event_seat
        </span>
        <h3 className="font-headline-lg text-xl sm:text-2xl text-deep-espresso">
          Reserve <span className="italic font-normal text-terracotta-rose font-serif">your</span> chair
        </h3>
      </div>
      <p className="font-body-sm text-xs sm:text-body-sm text-on-surface-variant mb-5 sm:mb-6 leading-relaxed">
        Choose your preferred studio atelier, specialty ritual, and artist. Confirmed immediately on WhatsApp.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-6">
        {/* STEP 1: Branch Selector (3 Branches) */}
        <div>
          <label className="font-label-md text-xs sm:text-label-md uppercase tracking-wider text-deep-espresso block mb-2 sm:mb-2.5">
            Step 1 · Select Atelier Branch
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {BRANCHES.map((b) => {
              const isSelected = branch === b.id;
              return (
                <label key={b.id} className="cursor-pointer">
                  <input
                    type="radio"
                    name="branch"
                    value={b.id}
                    checked={isSelected}
                    onChange={() => setBranch(b.id)}
                    className="sr-only"
                  />
                  <div
                    className={`p-3 sm:p-3.5 rounded-xl transition-all flex flex-col justify-between h-full shadow-xs border ${
                      isSelected
                        ? "bg-deep-espresso text-ivory-cream border-deep-espresso"
                        : "bg-white text-deep-espresso border-border-warm hover:border-deep-espresso"
                    }`}
                  >
                    <div>
                      <span className="font-label-md text-xs sm:text-label-md block font-semibold">
                        {b.bookingShortName}
                      </span>
                      <span className="font-body-sm text-[11px] opacity-80 block mt-0.5">
                        {b.addressShort}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] text-whatsapp-green mt-2 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-whatsapp-green"></span> Available
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* STEP 2: Service Category & Specific Treatment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label htmlFor="service-category" className="font-label-md text-xs sm:text-label-md uppercase tracking-wider text-deep-espresso block mb-1.5 sm:mb-2">
              Category
            </label>
            <select
              id="service-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl font-body-sm text-sm text-deep-espresso outline-none focus:ring-2 focus:ring-terracotta-rose transition-all border border-border-warm"
            >
              <option value="skin">Skin Care Rituals</option>
              <option value="hair">Hair / Japanese Head Spa</option>
              <option value="nails">Nail Care &amp; BIAB</option>
              <option value="makeup">Make Up &amp; Bridal</option>
            </select>
          </div>
          <div>
            <label htmlFor="service-item" className="font-label-md text-xs sm:text-label-md uppercase tracking-wider text-deep-espresso block mb-1.5 sm:mb-2">
              Service
            </label>
            <select
              id="service-item"
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full bg-white px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl font-body-sm text-sm text-deep-espresso outline-none focus:ring-2 focus:ring-terracotta-rose transition-all border border-border-warm"
            >
              <option value="balayage">Balayage &amp; Gloss (₹7,999)</option>
              <option value="cut">Signature Cut &amp; Blow-Dry (₹1,499)</option>
              <option value="headspa">Royal Japanese Scalp Spa (₹3,499)</option>
              <option value="facial">Glow Facial Ritual (₹3,499)</option>
              <option value="nails">Russian BIAB Gel Manicure (₹2,499)</option>
              <option value="makeup">Red Carpet Glam (₹5,499)</option>
            </select>
          </div>
        </div>

        {/* STEP 3: Master Artist Selection */}
        <div>
          <label htmlFor="preferred-artist" className="font-label-md text-xs sm:text-label-md uppercase tracking-wider text-deep-espresso block mb-1.5 sm:mb-2">
            Preferred Artist / Specialist
          </label>
          <select
            id="preferred-artist"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            className="w-full bg-white px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl font-body-sm text-sm text-deep-espresso outline-none focus:ring-2 focus:ring-terracotta-rose transition-all border border-border-warm"
          >
            <option value="any">First Available Master Artist</option>
            <option value="isabella">Isabella Moore — Creative Director</option>
            <option value="sienna">Sienna Clarke — Balayage Specialist</option>
            <option value="camille">Camille Dubois — Senior Esthetician</option>
            <option value="zoe">Zoe Harper — Bridal &amp; Editorial Artist</option>
          </select>
        </div>

        {/* STEP 4: Date & Time Window */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label htmlFor="preferred-date" className="font-label-md text-xs sm:text-label-md uppercase tracking-wider text-deep-espresso block mb-1.5 sm:mb-2">
              Preferred Date
            </label>
            <input
              id="preferred-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-white px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl font-body-sm text-sm text-deep-espresso outline-none focus:ring-2 focus:ring-terracotta-rose transition-all border border-border-warm"
            />
          </div>
          <div>
            <label htmlFor="preferred-slot" className="font-label-md text-xs sm:text-label-md uppercase tracking-wider text-deep-espresso block mb-1.5 sm:mb-2">
              Time Slot
            </label>
            <select
              id="preferred-slot"
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="w-full bg-white px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl font-body-sm text-sm text-deep-espresso outline-none focus:ring-2 focus:ring-terracotta-rose transition-all border border-border-warm"
            >
              <option value="morning">Morning (10:00 AM – 1:00 PM)</option>
              <option value="afternoon">Afternoon (1:00 PM – 5:00 PM)</option>
              <option value="evening">Evening (5:00 PM – 8:00 PM)</option>
            </select>
          </div>
        </div>

        {/* Guest Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label htmlFor="guest-name" className="font-label-md text-xs sm:text-label-md uppercase tracking-wider text-deep-espresso block mb-1.5 sm:mb-2">
              Your Name
            </label>
            <input
              id="guest-name"
              type="text"
              placeholder="e.g. Eleanor Vance"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-white px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl font-body-sm text-sm text-deep-espresso outline-none focus:ring-2 focus:ring-terracotta-rose transition-all placeholder:text-on-surface-variant/50 border border-border-warm"
            />
          </div>
          <div>
            <label htmlFor="guest-phone" className="font-label-md text-xs sm:text-label-md uppercase tracking-wider text-deep-espresso block mb-1.5 sm:mb-2">
              WhatsApp Number
            </label>
            <input
              id="guest-phone"
              type="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full bg-white px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl font-body-sm text-sm text-deep-espresso outline-none focus:ring-2 focus:ring-terracotta-rose transition-all placeholder:text-on-surface-variant/50 border border-border-warm"
            />
          </div>
        </div>

        {/* Submit CTA */}
        <button
          type="submit"
          className="w-full bg-whatsapp-green text-ivory-cream hover:bg-emerald-600 font-label-md text-xs sm:text-label-md uppercase tracking-wider py-3.5 sm:py-4 rounded-xl transition-all duration-300 shadow-md flex items-center justify-center gap-2 mt-1 sm:mt-2 cursor-pointer active:scale-[0.99] text-center"
        >
          <span className="material-symbols-outlined text-[20px]">chat</span>
          <span>Reserve Your Chair on WhatsApp</span>
        </button>

        <p className="font-body-sm text-[11px] sm:text-[12px] text-tertiary text-center -mt-1 sm:-mt-2">
          Free rescheduling up to 24 hours prior · No instant card prepayment required
        </p>
      </form>
    </div>
  );
}

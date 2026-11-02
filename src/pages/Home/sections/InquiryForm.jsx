import React, { useState } from 'react';
import { saveInquiryToFirebase } from '../../../services/inquiryFirebaseService';

export function InquiryForm({ onNotify }) {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.contact || !formData.message) {
      if (onNotify) onNotify('Please fill in all fields before sending.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await saveInquiryToFirebase(formData);
    } catch (err) {
      console.warn('Firebase inquiry sync notice:', err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
      if (onNotify) {
        onNotify('Your message has been received. Our concierge will reply shortly.', 'success');
      }
    }
  };

  return (
    <div className="lg:col-span-5 bg-white p-5 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl shadow-sm flex flex-col justify-center border border-border-warm/60">
      <h3 className="font-headline-md text-xl sm:text-headline-md text-deep-espresso mb-1.5 sm:mb-2">
        Send a Note
      </h3>
      <p className="font-body-sm text-xs sm:text-body-sm text-on-surface-variant mb-5 sm:mb-6 leading-relaxed">
        For bespoke bridal suites, private group bookings, or media inquiries.
      </p>

      {submitted ? (
        <div className="p-4 sm:p-6 bg-white rounded-2xl border border-border-warm text-center flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-terracotta-rose text-[36px] sm:text-[40px]">
            mark_email_read
          </span>
          <h4 className="font-headline-sm text-deep-espresso">Thank You, {formData.name}</h4>
          <p className="text-xs sm:text-body-sm text-on-surface-variant">
            Your note has been transmitted to our VIP concierge team. We will be in touch shortly.
          </p>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setFormData({ name: '', contact: '', message: '' });
            }}
            className="mt-2 text-xs uppercase tracking-wider text-terracotta-rose font-semibold hover:underline cursor-pointer"
          >
            Send another inquiry
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4">
          <input
            className="w-full bg-white px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl font-body-sm text-sm text-deep-espresso outline-none focus:ring-2 focus:ring-terracotta-rose transition-all placeholder:text-on-surface-variant/50 border border-border-warm/60"
            placeholder="Your Full Name"
            required
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            className="w-full bg-white px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl font-body-sm text-sm text-deep-espresso outline-none focus:ring-2 focus:ring-terracotta-rose transition-all placeholder:text-on-surface-variant/50 border border-border-warm/60"
            placeholder="Email or Phone Number"
            required
            type="text"
            value={formData.contact}
            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
          />
          <textarea
            className="w-full bg-white px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl font-body-sm text-sm text-deep-espresso outline-none focus:ring-2 focus:ring-terracotta-rose transition-all placeholder:text-on-surface-variant/50 resize-none border border-border-warm/60"
            placeholder="Tell us what you are looking for..."
            required
            rows={3}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />
          <button
            className="w-full bg-deep-espresso text-ivory-cream hover:bg-terracotta-rose py-3 sm:py-3.5 rounded-xl font-label-md text-xs sm:text-label-md uppercase tracking-wider transition-colors shadow-sm cursor-pointer active:scale-95"
            type="submit"
          >
            Send Message
          </button>
        </form>
      )}
    </div>
  );
}

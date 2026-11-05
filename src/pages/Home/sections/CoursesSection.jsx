import React from 'react';
import { Award, Sparkles, MessageCircle, Check, Phone } from 'lucide-react';
import { CONTACT_INFO, LOGO_URL } from '../../../constants/navigation';

const COURSES = [
  {
    id: 'makeup',
    title: 'Professional Makeup',
    tag: 'Bridal & Celebrity',
    price: 15000,
    priceDisplay: '₹15,000',
    description: 'Master professional makeup artistry from fundamentals to advanced bridal and celebrity looks.',
    features: [
      'Bridal, Reception & HD Party Makeup',
      'Face Contouring, Skin Prep & Eye Styling',
      'ISO Registration Certificate',
      'Practice products provided by Look & Like',
    ],
    popular: true,
  },
  {
    id: 'parlour',
    title: 'Complete Parlour Course',
    tag: 'Full Parlour Mastery',
    price: 15000,
    priceDisplay: '₹15,000',
    description: 'Comprehensive beauty care covering hair styling, cutting, skin treatments, facials, and parlour management.',
    features: [
      'Hair Cutting, Styling & Chemical Treatments',
      'Advanced Facials, Clean-ups & D-Tan',
      'ISO Registration Certificate',
      'Practice products provided by Look & Like',
    ],
    popular: false,
  },
  {
    id: 'nail-extension',
    title: 'Nail Extension Course',
    tag: 'Specialized Artistry',
    price: 5000,
    priceDisplay: '₹5,000',
    description: 'Hands-on training in modern nail extensions, gel application, overlays, and creative nail art.',
    features: [
      'Gel, Acrylic & Polygel Extensions',
      'Nail Shaping, Overlays & Trend Nail Art',
      'ISO Registration Certificate',
      'Practice products provided by Look & Like',
    ],
    popular: false,
  },
];

export function CoursesSection() {
  const whatsAppNumber = CONTACT_INFO.defaultWhatsApp || '919647357421';

  return (
    <section className="w-full bg-[#FAF8F5] py-10 sm:py-14 lg:py-20 scroll-mt-20 border-y border-[#F0CDD7]/60" id="courses">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <span className="mb-1 block text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-black leading-tight">
            ACADEMY &amp; TRAINING
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-bold text-deep-espresso tracking-tight leading-tight mb-2 sm:mb-3">
            Professional Beauty Courses
          </h2>
          <p className="text-xs sm:text-sm text-[#7A6B70] leading-relaxed">
            Gain industry-recognized skills and start your professional career with ISO-certified training under master beauticians.
          </p>
        </div>

        {/* Global Perks Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="flex items-center gap-3 p-3 sm:p-3.5 rounded-2xl bg-white border border-[#F0CDD7] shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#FFF3F6] border border-[#F0CDD7] text-[#D6204E] flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-deep-espresso">ISO Registration Certificate</h4>
              <p className="text-[11px] text-[#7A6B70] leading-tight mt-0.5">
                Official recognized certification for your professional beauty career.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 sm:p-3.5 rounded-2xl bg-white border border-[#F0CDD7] shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#FFF3F6] border border-[#F0CDD7] p-1.5 flex items-center justify-center shrink-0">
              <img src={LOGO_URL} alt="Look & Like" className="w-full h-full object-contain" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-deep-espresso">Practice Products Provided</h4>
              <p className="text-[11px] text-[#7A6B70] leading-tight mt-0.5">
                All training products and practice materials provided directly from Look &amp; Like.
              </p>
            </div>
          </div>
        </div>

        {/* Courses Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 items-stretch">
          {COURSES.map((course) => {
            const prefillMsg = encodeURIComponent(
              `Hi, I'm interested in enrolling in the ${course.title} (${course.priceDisplay}) at Look & Like Academy.`
            );
            const enrollUrl = `https://wa.me/${whatsAppNumber}?text=${prefillMsg}`;

            return (
              <div
                key={course.id}
                className={`relative bg-white rounded-2xl sm:rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
                  course.popular
                    ? 'border-[#D6204E] ring-1 ring-[#D6204E]/30'
                    : 'border-[#F0CDD7]/80 hover:border-[#D6204E]/50'
                }`}
              >
                {/* Popular Badge */}
                {course.popular && (
                  <div className="bg-[#D6204E] text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-center py-1.5 px-3">
                    Most Popular Course
                  </div>
                )}

                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Tag & Category */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] sm:text-xs font-semibold text-[#D6204E] bg-[#FFF3F6] border border-[#F0CDD7] px-2.5 py-0.5 rounded-full">
                        {course.tag}
                      </span>
                      <span className="text-[10px] text-stone-400 font-medium">
                        ISO Certified
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-deep-espresso leading-snug mb-2">
                      {course.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-[#7A6B70] leading-relaxed mb-4">
                      {course.description}
                    </p>

                    {/* Price Tag */}
                    <div className="flex items-baseline gap-1.5 pb-4 mb-4 border-b border-[#F0CDD7]/60">
                      <span className="text-2xl sm:text-3xl font-bold font-sans font-price not-italic text-[#D6204E] tracking-tight">
                        {course.priceDisplay}
                      </span>
                      <span className="text-[11px] text-stone-500 font-medium">
                        / Complete Course
                      </span>
                    </div>

                    {/* Features List */}
                    <ul className="space-y-2.5 mb-6 text-xs text-[#4A3E42]">
                      {course.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-[#FFF3F6] border border-[#F0CDD7] text-[#D6204E] flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-2.5 h-2.5" />
                          </span>
                          <span className="leading-tight">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-2">
                    <a
                      href={enrollUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#D6204E] to-[#B81942] hover:from-[#B81942] hover:to-[#961234] rounded-xl sm:rounded-2xl shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer text-center"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Enroll on WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Consultation Assistance */}
        <div className="mt-8 sm:mt-10 text-center text-xs text-[#7A6B70] flex flex-wrap items-center justify-center gap-2">
          <span>Need help choosing a course?</span>
          <a
            href={`tel:${CONTACT_INFO.consultationPhone.replace(/\s+/g, '')}`}
            className="text-[#D6204E] font-bold hover:underline inline-flex items-center gap-1"
          >
            <Phone className="w-3 h-3" />
            <span>Call us at {CONTACT_INFO.consultationPhone}</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default CoursesSection;


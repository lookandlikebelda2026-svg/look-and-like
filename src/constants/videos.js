import { VIDEO_TOUR_ASSETS, ABOUT_ASSETS, HERO_ASSETS } from './team';
import { GALLERY_ITEMS } from './gallery';

export const COLLECTION_VIDEOS = [
  {
    id: "atelier-walkthrough",
    title: "The Atelier Sanctuary Experience",
    category: "Atelier Tour",
    duration: "2:15 min",
    quality: "4K UHD",
    youtubeUrl: "https://www.youtube.com/watch?v=kXYiU_JCYtU",
    thumbnailUrl: VIDEO_TOUR_ASSETS.thumbnailUrl,
    alt: "Cinematic still of serene luxury hair salon with soft warm ambient lights, brass arch mirrors, and serene aesthetic atmosphere",
    description: "Explore our acoustically muted private suites, Italian marble washstations, and bespoke hospitality lounge in high-definition.",
    bookingServiceId: "headspa"
  },
  {
    id: "japanese-head-spa",
    title: "Japanese Scalp Detox & Waterfall Ritual",
    category: "Scalp Wellness",
    duration: "2:30 min",
    quality: "4K HDR",
    youtubeUrl: "https://www.youtube.com/watch?v=LXb3EKWsInQ",
    thumbnailUrl: GALLERY_ITEMS[1].imageUrl,
    alt: "Japanese scalp spa treatment with aromatic herbal waterfall rinse flowing over dark glossy hair in dark charcoal ceramic wash basin",
    description: "An acoustic journey featuring microscopic scalp analysis, shiatsu acupressure, botanical detox clays, and our signature warm herbal steam waterfall.",
    bookingServiceId: "headspa"
  },
  {
    id: "balayage-mastery",
    title: "French Balayage & Gloss Transformation",
    category: "Color Mastery",
    duration: "1:45 min",
    quality: "4K HDR",
    youtubeUrl: "https://www.youtube.com/watch?v=7wtfhZwyrcc",
    thumbnailUrl: HERO_ASSETS.secondaryAccentUrl,
    alt: "Macro close-up shot of dimensional blonde and brunette balayage hair texture cascading gently with glossy satin reflection",
    description: "Watch our master colorists hand-paint seamless dimensional ribbons with ammonia-free Italian lighteners and high-shine conditioning gloss.",
    bookingServiceId: "balayage"
  },
  {
    id: "hydra-glow-facial",
    title: "Hydra-Derm Infusion & Sculpting Ritual",
    category: "Skin Clinic",
    duration: "1:50 min",
    quality: "HD 60fps",
    youtubeUrl: "https://www.youtube.com/watch?v=fJ9rUzIMcZQ",
    thumbnailUrl: GALLERY_ITEMS[0].imageUrl,
    alt: "Close-up aesthetic facial spa treatment with organic botanical clay mask, damp rosewater compresses, and jade stone massage",
    description: "Vortex vacuum pore cleansing paired with medical-grade hyaluronic infusions, chilled cryo-globe sculpting, and botanical oxygen spray.",
    bookingServiceId: "facial"
  },
  {
    id: "couture-bridal",
    title: "Couture Bridal & Red Carpet Artistry",
    category: "Bridal Suite",
    duration: "2:10 min",
    quality: "4K HDR",
    youtubeUrl: "https://www.youtube.com/watch?v=JGwWNGJdvx8",
    thumbnailUrl: GALLERY_ITEMS[3].imageUrl,
    alt: "High fashion beauty portrait of bride receiving delicate liquid highlighter and soft winged eyeshadow in backstage vanity dressing room",
    description: "Inside our private bridal suite: step-by-step bespoke airbrush skin prep, textured modern chignon sculpting, and veil placement.",
    bookingServiceId: "makeup"
  },
  {
    id: "private-suite-tour",
    title: "Inside the Acoustic Private Suites",
    category: "VIP Suites",
    duration: "1:25 min",
    quality: "4K UHD",
    youtubeUrl: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
    thumbnailUrl: ABOUT_ASSETS.suiteUrl,
    alt: "Minimalist private consultation suite in high-end beauty atelier with herbal tea set, linen towels, and fresh blush roses on travertine pedestal",
    description: "Designed for single-client privacy: complete acoustic isolation, customizable mood lighting, and personalized playlist options.",
    bookingServiceId: "headspa"
  },
  {
    id: "atelier-architecture",
    title: "The Architecture of Tranquility",
    category: "Design Story",
    duration: "1:55 min",
    quality: "4K UHD",
    youtubeUrl: "https://www.youtube.com/watch?v=3JZ_D3ELwOQ",
    thumbnailUrl: ABOUT_ASSETS.interiorUrl,
    alt: "Luxurious European beauty salon interior featuring arched glowing mirrors, fluted oak wood panels, and warm marble styling vanity counters",
    description: "An architectural exploration of how curved arches, natural lime-wash plaster, fluted oak, and biophilic acoustics craft mindful restoration.",
    bookingServiceId: "cut"
  }
];

export const VIDEO_CATEGORIES = [
  "All Films",
  "Atelier Tour",
  "Scalp Wellness",
  "Color Mastery",
  "Skin Clinic",
  "Bridal Suite"
];

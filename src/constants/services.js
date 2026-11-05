/**
 * Services data structures and normalization utilities.
 * 4 Main Categories: Hair Care, Nail Care, Skin Care, Make Up.
 * Main categories show 1 image; plans & subplans do not have images.
 */
export const CURATED_MENU_DATA = {};

export const MAIN_SERVICE_CATEGORIES = [
  {
    key: 'hair',
    id: 'hair-care',
    name: 'Hair Care',
    description: 'Haircuts, Styling, Couture Balayage, Treatments & Smoothening',
    startingPrice: 1499,
  },
  {
    key: 'nails',
    id: 'nail-care',
    name: 'Nail Care',
    description: 'Manicure, Pedicure, Russian BIAB & Couture Sculpted Extensions',
    startingPrice: 999,
  },
  {
    key: 'skin',
    id: 'skin-care',
    name: 'Skin Care',
    description: 'Facials, Cleanups, Anti-Aging & Bio-Active Cellular Treatments',
    startingPrice: 1999,
  },
  {
    key: 'makeup',
    id: 'make-up',
    name: 'Make Up',
    description: 'Bridal, Party, HD Airbrush & Editorial Haute Glamour',
    startingPrice: 3999,
  },
];

export function normalizeServiceImage(img, defaultAlt = 'Service photo') {
  if (!img) return null;
  if (typeof img === 'string') {
    const trimmed = img.trim();
    return trimmed ? { url: trimmed, path: '', alt: defaultAlt } : null;
  }
  if (!img.url || typeof img.url !== 'string') return null;
  return {
    url: img.url.trim(),
    path: img.path || img.filePath || '',
    alt: img.alt || defaultAlt || 'Service photo',
  };
}

export function normalizeServiceImages(images, defaultAlt = '') {
  if (!Array.isArray(images)) {
    if (images && typeof images === 'object') {
      const single = normalizeServiceImage(images, defaultAlt);
      return single?.url ? [single] : [];
    }
    if (typeof images === 'string' && images.trim()) {
      return [{ url: images.trim(), path: '', alt: defaultAlt || 'Service photo' }];
    }
    return [];
  }
  return images.map((img) => normalizeServiceImage(img, defaultAlt)).filter((img) => img && img.url);
}

export function normalizeServiceSubplan(rawSub, idx = 0) {
  if (!rawSub) return null;
  const rawPrice = rawSub.price;
  const numPrice =
    typeof rawPrice === 'number'
      ? rawPrice
      : Number(String(rawPrice || '0').replace(/[^0-9.]/g, '')) || 0;

  return {
    id: String(rawSub.id || 'subplan-' + Date.now() + '-' + idx),
    name: String(rawSub.name || 'Option ' + (idx + 1)).trim(),
    price: numPrice,
  };
}

export function normalizeServicePlan(rawPlan, planIdx = 0) {
  if (!rawPlan) return null;

  let subplans = [];
  const rawSubs = Array.isArray(rawPlan.subplans) && rawPlan.subplans.length > 0
    ? rawPlan.subplans
    : Array.isArray(rawPlan.subCategories) && rawPlan.subCategories.length > 0
    ? rawPlan.subCategories
    : [];

  if (rawSubs.length > 0) {
    subplans = rawSubs
      .map((sub, sIdx) => normalizeServiceSubplan(sub, sIdx))
      .filter(Boolean);
  } else if (rawPlan.price) {
    const basePrice =
      typeof rawPlan.price === 'number'
        ? rawPlan.price
        : Number(String(rawPlan.price).replace(/[^0-9.]/g, '')) || 0;
    subplans = [
      { id: 'sub-' + (rawPlan.id || planIdx) + '-1', name: 'Standard', price: basePrice },
    ];
  } else {
    subplans = [];
  }

  let startingPrice = Number(rawPlan.startingPrice);
  if (isNaN(startingPrice) || startingPrice <= 0) {
    const prices = subplans.map((s) => s.price).filter((p) => typeof p === 'number' && p > 0);
    startingPrice = prices.length > 0 ? Math.min(...prices) : 0;
  }

  // Plans and subplans do not have images
  return {
    id: String(rawPlan.id || 'plan-' + Date.now() + '-' + planIdx),
    name: String(rawPlan.name || rawPlan.title || 'Plan ' + (planIdx + 1)).trim(),
    description: String(rawPlan.description || rawPlan.desc || '').trim(),
    images: [],
    startingPrice,
    subplans,
  };
}

export function normalizeService(rawSvc, svcIdx = 0) {
  if (!rawSvc) return null;

  const id = String(rawSvc.id || rawSvc.key || 'service-' + Date.now() + '-' + svcIdx);
  const name = String(rawSvc.name || rawSvc.title || 'Untitled Service').trim();
  const description = String(rawSvc.description || rawSvc.subtitle || '').trim();

  let images = normalizeServiceImages(rawSvc.images, name);
  if (images.length === 0 && rawSvc.imageUrl) {
    images = [{ url: rawSvc.imageUrl, path: '', alt: name }];
  }
  if (images.length === 0 && rawSvc.image) {
    images = [{ url: rawSvc.image, path: '', alt: name }];
  }

  // Exactly 1 image for the main category
  const singleImage = images.slice(0, 1);

  const rawPlans = Array.isArray(rawSvc.plans)
    ? rawSvc.plans
    : Array.isArray(rawSvc.pricePlans)
    ? rawSvc.pricePlans
    : Array.isArray(rawSvc.items)
    ? rawSvc.items
    : [];

  const plans = rawPlans.map((p, idx) => normalizeServicePlan(p, idx)).filter(Boolean);

  let startingPrice = Number(rawSvc.startingPrice);
  if (isNaN(startingPrice) || startingPrice <= 0) {
    const planPrices = plans
      .map((p) => p.startingPrice)
      .filter((p) => typeof p === 'number' && p > 0);
    startingPrice = planPrices.length > 0 ? Math.min(...planPrices) : 0;
  }

  const now = new Date().toISOString();

  return {
    id,
    name,
    description,
    images: singleImage,
    startingPrice,
    plans,
    createdAt: rawSvc.createdAt || now,
    updatedAt: rawSvc.updatedAt || now,
  };
}

export const DEFAULT_SERVICES_DATA = [];

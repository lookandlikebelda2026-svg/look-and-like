import React, { useState } from 'react';
import {
  UploadCloud,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { MultiImageUploader } from '../common/MultiImageUploader';
import { useBannerMedia } from '../../../../services/bannerFirebaseService';

/**
 * BannerAdminSection
 * Clean, lightweight admin studio to manage:
 * 1. Storefront Hero Banner
 * 2. About Section Carousel Photos
 */
export function BannerAdminSection({ onNotify }) {
  const { heroBannerUrl, aboutPhotos, loading, saveHeroBanner, saveAboutPhotos } = useBannerMedia();

  const [isChangingHero, setIsChangingHero] = useState(false);
  const [isAddingAboutPhoto, setIsAddingAboutPhoto] = useState(false);

  // 1. HERO BANNER
  const handleSaveHero = async (items) => {
    if (!items || items.length === 0) return;
    const single = items[0];
    const newUrl = single.imageUrl || single.url;
    if (!newUrl) {
      onNotify?.('No image uploaded.', 'error');
      return;
    }

    try {
      await saveHeroBanner(newUrl);
      setIsChangingHero(false);
      onNotify?.('Hero banner updated successfully!', 'success');
    } catch (err) {
      onNotify?.('Failed to update hero banner.', 'error');
    }
  };

  const handleDeleteHero = async () => {
    if (window.confirm('Are you sure you want to remove the hero banner?')) {
      try {
        await saveHeroBanner('');
        onNotify?.('Hero banner removed.', 'info');
      } catch (err) {
        onNotify?.('Failed to remove hero banner.', 'error');
      }
    }
  };

  // 2. ABOUT PHOTOS
  const handleSaveAboutPhotos = async (items) => {
    if (!items || items.length === 0) return;

    try {
      const newPhotos = items.map((item, idx) => ({
        id: `founder-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
        url: item.imageUrl || item.url,
        alt: item.name || 'Founder and Award Photo',
      }));

      const updated = [...aboutPhotos, ...newPhotos];
      await saveAboutPhotos(updated);
      setIsAddingAboutPhoto(false);
      onNotify?.(`${newPhotos.length} photo(s) added!`, 'success');
    } catch (err) {
      onNotify?.('Failed to save photos.', 'error');
    }
  };

  const handleDeleteAboutPhoto = async (index) => {
    if (window.confirm('Delete this photo from the carousel?')) {
      try {
        const updated = aboutPhotos.filter((_, idx) => idx !== index);
        await saveAboutPhotos(updated);
        onNotify?.('Photo removed.', 'info');
      } catch (err) {
        onNotify?.('Failed to remove photo.', 'error');
      }
    }
  };

  const handleMoveAboutPhoto = async (index, direction) => {
    const targetIdx = direction === 'left' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= aboutPhotos.length) return;

    const reordered = [...aboutPhotos];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIdx, 0, moved);

    await saveAboutPhotos(reordered);
  };

  return (
    <div className="w-full space-y-8">
      {/* 1. HOMEPAGE HERO BANNER */}
      <div>
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#F0CDD7]">
          <div>
            <h4 className="font-serif text-base sm:text-lg font-bold text-deep-espresso">
              Homepage Hero Banner
            </h4>
            <p className="text-xs text-stone-500 mt-0.5">
              The main panoramic photo shown at the top of your website.
            </p>
          </div>

          {!isChangingHero && heroBannerUrl && (
            <button
              type="button"
              onClick={() => setIsChangingHero(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold text-white bg-[#D6204E] hover:bg-[#8F1232] rounded-xl shadow-xs transition-colors cursor-pointer active:scale-95"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Change Banner</span>
            </button>
          )}
        </div>

        {isChangingHero ? (
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#F0CDD7]">
            <MultiImageUploader
              folder="/banners"
              preset="banner"
              label="Hero Banner"
              itemSingular="Banner"
              multiple={false}
              onSubmit={handleSaveHero}
              onCancel={() => setIsChangingHero(false)}
              onNotify={onNotify}
            />
          </div>
        ) : loading ? (
          <div className="w-full max-w-2xl h-44 sm:h-60 rounded-2xl bg-[#FFF3F6] border border-[#F0CDD7] animate-pulse" />
        ) : heroBannerUrl ? (
          <div className="relative rounded-2xl overflow-hidden border border-[#F0CDD7] max-w-2xl bg-stone-100 shadow-2xs group">
            <img
              src={heroBannerUrl}
              alt="Hero Banner"
              className="w-full h-44 sm:h-60 object-cover object-center"
            />
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsChangingHero(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-black/75 hover:bg-black rounded-lg backdrop-blur-md shadow-xs transition-colors cursor-pointer"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Replace</span>
              </button>
              <button
                type="button"
                onClick={handleDeleteHero}
                className="p-1.5 text-white bg-black/75 hover:bg-rose-600 rounded-lg backdrop-blur-md shadow-xs transition-colors cursor-pointer"
                title="Remove Banner"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-[#F0CDD7] bg-[#FFF3F6]/50 max-w-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-white shadow-2xs flex items-center justify-center text-[#D6204E] mb-3">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-deep-espresso mb-1">No hero banner uploaded yet</p>
            <p className="text-xs text-stone-500 mb-4 max-w-sm">
              Upload a high-resolution widescreen photo (1920x1080 recommended) to display as the hero banner.
            </p>
            <button
              type="button"
              onClick={() => setIsChangingHero(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#D6204E] hover:bg-[#8F1232] rounded-xl shadow-xs transition-colors cursor-pointer active:scale-95"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Banner</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. ABOUT US CAROUSEL PHOTOS */}
      <div>
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#F0CDD7]">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-serif text-base sm:text-lg font-bold text-deep-espresso">
                About Section Photos
              </h4>
              <span className="text-[10px] sm:text-[11px] font-semibold text-[#D6204E] bg-[#FFF3F6] border border-[#F0CDD7] px-2 py-0.5 rounded-full shrink-0">
                {aboutPhotos.length} {aboutPhotos.length === 1 ? 'Photo' : 'Photos'}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Founder and award photos displayed in the interactive carousel.
            </p>
          </div>

          {!isAddingAboutPhoto && aboutPhotos.length > 0 && (
            <button
              type="button"
              onClick={() => setIsAddingAboutPhoto(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold text-white bg-[#D6204E] hover:bg-[#8F1232] rounded-xl shadow-xs transition-colors cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Photos</span>
            </button>
          )}
        </div>

        {isAddingAboutPhoto && (
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#F0CDD7] mb-4">
            <MultiImageUploader
              folder="/founder"
              preset="photo"
              label="About Carousel Photos"
              itemSingular="Photo"
              itemPlural="Photos"
              multiple={true}
              onSubmit={handleSaveAboutPhotos}
              onCancel={() => setIsAddingAboutPhoto(false)}
              onNotify={onNotify}
            />
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="aspect-[4/3] rounded-2xl bg-[#FFF3F6] border border-[#F0CDD7] animate-pulse" />
            ))}
          </div>
        ) : aboutPhotos.length === 0 && !isAddingAboutPhoto ? (
          <div className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-[#F0CDD7] bg-[#FFF3F6]/50 text-center">
            <div className="w-12 h-12 rounded-full bg-white shadow-2xs flex items-center justify-center text-[#D6204E] mb-3">
              <Plus className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-deep-espresso mb-1">No about photos uploaded yet</p>
            <p className="text-xs text-stone-500 mb-4 max-w-sm">
              Upload founder, certificate, or award ceremony photos to showcase in the About Us carousel.
            </p>
            <button
              type="button"
              onClick={() => setIsAddingAboutPhoto(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#D6204E] hover:bg-[#8F1232] rounded-xl shadow-xs transition-colors cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Photos</span>
            </button>
          </div>
        ) : null}

        {/* Photos Grid */}
        {aboutPhotos.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
            {aboutPhotos.map((photo, index) => (
              <div
                key={photo.id || index}
                className="bg-white rounded-2xl border border-[#F0CDD7] overflow-hidden shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                  <img
                    src={photo.url}
                    alt=""
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-black/65 text-white text-[9px] font-semibold">
                    #{index + 1}
                  </div>
                </div>

                {/* Card Footer: Reorder & Delete */}
                <div className="p-2 flex items-center justify-between border-t border-stone-100 bg-stone-50/50">
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveAboutPhoto(index, 'left')}
                      className="p-1 rounded text-stone-500 hover:text-[#D6204E] disabled:opacity-20 transition-colors cursor-pointer"
                      title="Move Left"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={index === aboutPhotos.length - 1}
                      onClick={() => handleMoveAboutPhoto(index, 'right')}
                      className="p-1 rounded text-stone-500 hover:text-[#D6204E] disabled:opacity-20 transition-colors cursor-pointer"
                      title="Move Right"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteAboutPhoto(index)}
                    className="p-1 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BannerAdminSection;

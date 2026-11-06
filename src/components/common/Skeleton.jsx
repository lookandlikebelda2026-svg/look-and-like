import React from 'react';

/**
 * Base Primitive: Skeleton
 * Highly reusable shimmer block that strictly adheres to the Look & Like luxury palette
 * (Soft Rose #FFF3F6, Champagne Border #F0CDD7, and subtle tone #FCECEF).
 */
export function Skeleton({ className = '', rounded = 'rounded-xl', ...props }) {
  return (
    <div
      className={`animate-pulse bg-[#FFF3F6] border border-[#F0CDD7]/60 ${rounded} ${className}`}
      aria-hidden="true"
      {...props}
    />
  );
}

/**
 * SkeletonText
 * Generates realistic multiline text placeholders.
 */
export function SkeletonText({ lines = 3, className = '', gap = 'space-y-2' }) {
  const widths = ['w-full', 'w-5/6', 'w-3/5', 'w-4/5', 'w-2/3'];
  return (
    <div className={`${gap} ${className}`} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-3 rounded-md bg-[#F0CDD7]/50 animate-pulse ${widths[i % widths.length]}`}
        />
      ))}
    </div>
  );
}

/**
 * SkeletonCircle
 * Circular badge/avatar placeholder.
 */
export function SkeletonCircle({ size = 'w-10 h-10', className = '' }) {
  return (
    <div
      className={`${size} rounded-full bg-[#FFF3F6] border border-[#F0CDD7]/70 animate-pulse shrink-0 ${className}`}
      aria-hidden="true"
    />
  );
}

/**
 * HeroSkeleton
 * Matches the exact layout of HeroSection across mobile and desktop.
 */
export function HeroSkeleton() {
  return (
    <div className="w-full overflow-hidden bg-white" aria-hidden="true">
      {/* MOBILE (< lg) */}
      <div className="lg:hidden flex flex-col bg-[#FFF3F6]">
        <div className="relative w-full aspect-[16/11] xs:aspect-[16/10] sm:aspect-[16/9] min-h-[270px] xs:min-h-[290px] overflow-hidden bg-gradient-to-r from-[#FFF3F6] via-[#FCECEF] to-[#FFF3F6] animate-pulse">
          <div className="absolute inset-0 flex flex-col justify-end items-start px-3.5 xs:px-4 sm:px-5 pb-3 xs:pb-3.5 gap-2 xs:gap-2.5">
            <div className="h-5 w-24 bg-[#F0CDD7]/70 rounded-md" />
            <div className="h-8 w-44 bg-[#F0CDD7]/80 rounded-lg" />
            <div className="flex gap-2">
              <div className="h-7 w-28 bg-[#D6204E]/20 rounded-full border border-[#D6204E]/30" />
              <div className="h-7 w-20 bg-white/70 rounded-full border border-[#F0CDD7]" />
            </div>
            <div className="h-9 w-full max-w-xs xs:max-w-sm bg-white/90 rounded-xl xs:rounded-2xl border border-white/60" />
          </div>
        </div>
      </div>

      {/* DESKTOP (lg+) */}
      <div className="relative isolate hidden lg:flex min-h-[calc(100vh-64px)] min-h-[calc(100dvh-64px)] items-center overflow-hidden bg-gradient-to-r from-[#FFF3F6] via-[#FCECEF] to-[#FFF3F6] animate-pulse px-12 py-16">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start">
          <div className="h-10 w-44 bg-[#F0CDD7]/70 rounded-lg mb-3" />
          <div className="h-16 w-80 bg-[#F0CDD7]/80 rounded-xl mb-6" />
          <div className="flex gap-3 mb-10">
            <div className="h-10 w-40 bg-[#D6204E]/20 rounded-full border border-[#D6204E]/30" />
            <div className="h-10 w-32 bg-white/80 rounded-full border border-[#F0CDD7]" />
          </div>
          {/* Floating Stats Pill */}
          <div className="h-14 w-80 bg-white/90 rounded-full border border-[#F0CDD7]/80 shadow-xs flex items-center justify-around px-6">
            <div className="h-5 w-16 bg-[#F0CDD7]/60 rounded-md" />
            <div className="h-5 w-16 bg-[#F0CDD7]/60 rounded-md" />
            <div className="h-5 w-16 bg-[#F0CDD7]/60 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * PartnersSkeleton
 * Matches the brand partners marquee track.
 */
export function PartnersSkeleton() {
  return (
    <section className="w-full bg-white py-6 sm:py-10 md:py-12 border-border-warm/30 overflow-hidden" aria-hidden="true">
      <div className="max-w-[1420px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="text-center mb-5 sm:mb-7">
          <div className="h-3 w-48 bg-[#F0CDD7]/60 rounded-md mx-auto animate-pulse" />
        </div>
        <div className="relative w-full overflow-hidden py-2">
          {/* Side gradient masks */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 xs:w-16 sm:w-28 md:w-36 lg:w-48 bg-gradient-to-r from-white via-white/85 to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 xs:w-16 sm:w-28 md:w-36 lg:w-48 bg-gradient-to-l from-white via-white/85 to-transparent z-10" />
          
          <div className="flex gap-3 sm:gap-5 lg:gap-6 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="shrink-0 w-28 h-14 xs:w-32 xs:h-16 sm:w-40 sm:h-20 bg-[#FFF3F6] rounded-xl sm:rounded-2xl border border-[#F0CDD7]/90 animate-pulse flex items-center justify-center p-3"
              >
                <div className="w-16 sm:w-20 h-4 sm:h-5 rounded-md bg-[#F0CDD7]/50" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * LookbookSkeleton
 * Matches the 4-column editorial collage of GetInspiredSection.
 */
export function LookbookSkeleton() {
  return (
    <section className="w-full bg-white py-8 sm:py-12 lg:py-16 scroll-mt-20 overflow-hidden" aria-hidden="true">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="mb-6 sm:mb-8 text-center">
          <div className="h-3 w-28 bg-[#F0CDD7]/60 rounded-md mx-auto mb-2 animate-pulse" />
          <div className="h-8 w-48 bg-[#F0CDD7]/80 rounded-lg mx-auto animate-pulse" />
        </div>

        {/* Desktop 4-col Grid (2 Blocks = 12 Looks) */}
        <div className="hidden md:flex flex-col gap-4">
          {/* Row 1: Tall, Stacked, Tall, Stacked */}
          <div className="grid grid-cols-4 gap-4 h-[440px]">
            <div className="h-full rounded-2xl bg-[#FFF3F6] border border-[#F0CDD7]/80 animate-pulse" />
            <div className="flex flex-col gap-4 h-full">
              <div className="h-1/2 rounded-2xl bg-[#FFF3F6] border border-[#F0CDD7]/80 animate-pulse" />
              <div className="h-1/2 rounded-2xl bg-[#FFF3F6] border border-[#F0CDD7]/80 animate-pulse" />
            </div>
            <div className="h-full rounded-2xl bg-[#FFF3F6] border border-[#F0CDD7]/80 animate-pulse" />
            <div className="flex flex-col gap-4 h-full">
              <div className="h-1/2 rounded-2xl bg-[#FFF3F6] border border-[#F0CDD7]/80 animate-pulse" />
              <div className="h-1/2 rounded-2xl bg-[#FFF3F6] border border-[#F0CDD7]/80 animate-pulse" />
            </div>
          </div>

          {/* Row 2: Stacked, Tall, Stacked, Tall */}
          <div className="grid grid-cols-4 gap-4 h-[440px]">
            <div className="flex flex-col gap-4 h-full">
              <div className="h-1/2 rounded-2xl bg-[#FFF3F6] border border-[#F0CDD7]/80 animate-pulse" />
              <div className="h-1/2 rounded-2xl bg-[#FFF3F6] border border-[#F0CDD7]/80 animate-pulse" />
            </div>
            <div className="h-full rounded-2xl bg-[#FFF3F6] border border-[#F0CDD7]/80 animate-pulse" />
            <div className="flex flex-col gap-4 h-full">
              <div className="h-1/2 rounded-2xl bg-[#FFF3F6] border border-[#F0CDD7]/80 animate-pulse" />
              <div className="h-1/2 rounded-2xl bg-[#FFF3F6] border border-[#F0CDD7]/80 animate-pulse" />
            </div>
            <div className="h-full rounded-2xl bg-[#FFF3F6] border border-[#F0CDD7]/80 animate-pulse" />
          </div>
        </div>

        {/* Mobile Grid */}
        <div className="grid grid-cols-2 gap-3 md:hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="aspect-[4/5] rounded-2xl bg-[#FFF3F6] border border-[#F0CDD7]/80 animate-pulse"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * ServicesSkeleton
 * Matches the 4-card service grid on the homepage.
 */
export function ServicesSkeleton() {
  return (
    <section className="w-full bg-white py-6 sm:py-10 scroll-mt-20" aria-hidden="true">
      <div className="max-w-[1280px] mx-auto px-3 xs:px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="mb-5 sm:mb-8 text-center">
          <div className="h-3 w-28 bg-[#F0CDD7]/60 rounded-md mx-auto mb-2 animate-pulse" />
          <div className="h-8 w-60 bg-[#F0CDD7]/80 rounded-lg mx-auto animate-pulse" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-[#F0CDD7]/90 animate-pulse flex flex-col justify-between shadow-2xs space-y-4"
            >
              <div className="w-full aspect-[4/3] rounded-xl bg-[#FFF3F6] border border-[#F0CDD7]/60" />
              <div>
                <div className="h-5 w-32 bg-[#F0CDD7]/70 rounded-md mb-2" />
                <div className="h-3 w-4/5 bg-[#F0CDD7]/40 rounded-sm mb-1" />
                <div className="h-3 w-3/5 bg-[#F0CDD7]/40 rounded-sm" />
              </div>
              <div className="h-9 w-full rounded-full bg-[#FFF3F6] border border-[#F0CDD7]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * ReviewsSkeleton
 * Matches the client voices marquee track on the homepage.
 */
export function ReviewsSkeleton() {
  return (
    <section className="w-full bg-[#FAF8F5] py-10 sm:py-14 lg:py-18 border-y border-[#F0CDD7]/60 overflow-hidden" aria-hidden="true">
      <div className="mx-auto max-w-[1420px] px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8 sm:mb-12">
          <div>
            <div className="h-3 w-28 bg-[#D6204E]/25 rounded-md mb-2 animate-pulse" />
            <div className="h-8 w-56 bg-[#F0CDD7]/80 rounded-lg animate-pulse" />
          </div>
          <div className="h-9 w-32 bg-[#D6204E]/20 rounded-2xl border border-[#D6204E]/30 animate-pulse" />
        </div>

        {/* Cards Row with Gradients */}
        <div className="relative w-full overflow-hidden py-3">
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-10 xs:w-16 sm:w-28 md:w-36 lg:w-48 bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5]/85 to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 xs:w-16 sm:w-28 md:w-36 lg:w-48 bg-gradient-to-l from-[#FAF8F5] via-[#FAF8F5]/85 to-transparent z-10" />

          <div className="flex gap-4 sm:gap-6 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="shrink-0 w-[280px] xs:w-[320px] sm:w-[360px] md:w-[390px] bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#F0CDD7]/90 animate-pulse flex flex-col justify-between shadow-2xs space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, s) => (
                        <div key={s} className="w-3.5 h-3.5 rounded-xs bg-amber-200" />
                      ))}
                    </div>
                    <div className="h-3 w-14 bg-[#F0CDD7]/40 rounded-sm" />
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="h-3 w-full bg-[#F0CDD7]/50 rounded-sm" />
                    <div className="h-3 w-5/6 bg-[#F0CDD7]/50 rounded-sm" />
                    <div className="h-3 w-3/5 bg-[#F0CDD7]/50 rounded-sm" />
                  </div>
                </div>

                <div className="pt-3.5 border-t border-stone-100 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#FFF3F6] border border-[#F0CDD7]" />
                  <div className="h-3.5 w-24 bg-[#F0CDD7]/60 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * AboutCarouselSkeleton
 * Placed in the photo carousel column of AboutSection while photos load.
 */
export function AboutCarouselSkeleton() {
  return (
    <div className="lg:col-span-6 flex flex-col items-center w-full" aria-hidden="true">
      <div className="relative w-full h-[380px] xs:h-[430px] sm:h-[480px] lg:h-[520px] rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-r from-[#FFF3F6] via-[#FCECEF] to-[#FFF3F6] border border-[#F0CDD7] animate-pulse flex items-center justify-center shadow-xl">
        <div className="w-16 h-16 rounded-full bg-white/70 border border-[#F0CDD7] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-[#D6204E]/20" />
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mt-4 w-full">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-9 sm:w-10 h-9 sm:h-10 rounded-lg bg-[#FFF3F6] border border-[#F0CDD7] animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}

/**
 * InspirationMasonrySkeleton
 * Masonry grid skeleton for /inspiration page.
 */
export function InspirationMasonrySkeleton() {
  const aspectRatios = ['aspect-[3/4]', 'aspect-[4/5]', 'aspect-[1/1]', 'aspect-[3/4]', 'aspect-[4/5]', 'aspect-[1/1]', 'aspect-[3/4]', 'aspect-[4/5]'];
  return (
    <div className="columns-2 md:columns-3 lg:columns-4 gap-2.5 sm:gap-4 md:gap-5 space-y-2.5 sm:space-y-4 md:space-y-5" aria-hidden="true">
      {aspectRatios.map((ratio, i) => (
        <div
          key={i}
          className={`break-inside-avoid relative rounded-xl xs:rounded-2xl sm:rounded-3xl overflow-hidden bg-[#FFF3F6] border border-[#F0CDD7]/70 animate-pulse ${ratio}`}
        />
      ))}
    </div>
  );
}

/**
 * ServicesPageSkeleton
 * Full page skeleton for /services.
 */
export function ServicesPageSkeleton() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8" aria-hidden="true">
      {/* Category Pills Strip */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-9 w-24 sm:w-28 rounded-full bg-[#FFF3F6] border border-[#F0CDD7] animate-pulse shrink-0"
          />
        ))}
      </div>

      {/* Category Cards */}
      <div className="space-y-6">
        {[...Array(2)].map((_, c) => (
          <div
            key={c}
            className="w-full rounded-2xl sm:rounded-3xl bg-[#FAF8F5] border border-[#F0CDD7]/80 p-5 sm:p-8 animate-pulse space-y-5"
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#F0CDD7]/60">
              <div>
                <div className="h-6 w-36 bg-[#F0CDD7]/80 rounded-md mb-2" />
                <div className="h-3.5 w-52 bg-[#F0CDD7]/40 rounded-sm" />
              </div>
              <div className="h-9 w-28 rounded-full bg-[#D6204E]/20" />
            </div>

            <div className="space-y-3">
              {[...Array(3)].map((_, p) => (
                <div
                  key={p}
                  className="h-16 rounded-xl bg-white border border-[#F0CDD7]/60 flex items-center justify-between px-4 sm:px-6"
                >
                  <div className="space-y-1.5">
                    <div className="h-4 w-32 bg-[#F0CDD7]/60 rounded-md" />
                    <div className="h-3 w-48 bg-[#F0CDD7]/40 rounded-sm" />
                  </div>
                  <div className="h-5 w-16 bg-[#F0CDD7]/60 rounded-md" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * AdminCardSkeleton
 * List of skeleton cards for Admin panels (Reviews, Services, Lookbook, Partners).
 */
export function AdminCardSkeleton({ count = 3, type = 'card' }) {
  if (type === 'review') {
    return (
      <div className="space-y-3 sm:space-y-4" aria-hidden="true">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="p-4 sm:p-5 rounded-2xl border border-[#F0CDD7]/80 bg-white shadow-2xs animate-pulse space-y-3"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#FFF3F6] border border-[#F0CDD7]" />
                <div className="space-y-1">
                  <div className="h-3.5 w-24 bg-[#F0CDD7]/60 rounded-sm" />
                  <div className="h-2.5 w-16 bg-[#F0CDD7]/40 rounded-sm" />
                </div>
              </div>
              <div className="h-5 w-16 rounded-full bg-[#F0CDD7]/40" />
            </div>
            <div className="h-3 w-full bg-[#F0CDD7]/40 rounded-sm" />
            <div className="h-3 w-4/5 bg-[#F0CDD7]/40 rounded-sm" />
            <div className="pt-2 border-t border-stone-100 flex justify-between items-center">
              <div className="h-7 w-24 rounded-lg bg-[#F0CDD7]/50" />
              <div className="h-7 w-8 rounded-lg bg-[#F0CDD7]/40" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3.5 sm:space-y-5" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-5 rounded-2xl border border-[#F0CDD7]/80 bg-white shadow-2xs animate-pulse space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="h-5 w-36 bg-[#F0CDD7]/70 rounded-md" />
            <div className="flex gap-2">
              <div className="h-7 w-16 bg-[#F0CDD7]/40 rounded-lg" />
              <div className="h-7 w-8 bg-[#F0CDD7]/40 rounded-lg" />
            </div>
          </div>
          <div className="h-3 w-3/5 bg-[#F0CDD7]/40 rounded-sm" />
        </div>
      ))}
    </div>
  );
}

export default Skeleton;

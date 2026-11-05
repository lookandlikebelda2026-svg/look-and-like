import React, { useState, useRef } from 'react';
import { BRANCHES } from '../../../constants/branches';
import { BranchCard } from './BranchCard';

export function ContactSection() {
  const [activeTab, setActiveTab] = useState(0);
  const scrollRef = useRef(null);

  const handleTabClick = (index) => {
    setActiveTab(index);
    if (scrollRef.current) {
      const card = scrollRef.current.children[index];
      if (card) {
        card.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollLeft = container.scrollLeft;
    const cardWidth = container.offsetWidth * 0.82;
    const newIndex = Math.round(scrollLeft / cardWidth);
    if (newIndex >= 0 && newIndex < BRANCHES.length && newIndex !== activeTab) {
      setActiveTab(newIndex);
    }
  };

  return (
    <section
      className="w-full overflow-hidden bg-white pt-8 pb-12 sm:py-14 lg:py-20 scroll-mt-20"
      id="contact"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Section Title */}
        <div
          id="branches"
          className="mx-auto mb-5 max-w-xl text-center sm:mb-10 lg:mb-12 scroll-mt-24"
        >
          <span className="mb-0.5 block text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-black leading-tight">
            PARLOUR BRANCHES
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-bold leading-tight tracking-tight text-deep-espresso">
            Come Say Hello
            {/* <span className="block font-normal italic text-[#4A4A4A] sm:inline">
              {" "}· Visit our 3 branches
            </span> */}
          </h2>
        </div>

        {/* Phone Only: Quick Interactive Branch Selector Tabs */}
        <div className="flex p-1 bg-[#FFF3F6]/80 rounded-full border border-[#F0CDD7] mb-5 w-full max-w-[320px] xs:max-w-[340px] mx-auto sm:hidden shadow-2xs">
          {BRANCHES.map((b, idx) => (
            <button
              key={b.id}
              type="button"
              onClick={() => handleTabClick(idx)}
              className={`flex-1 py-1.5 xs:py-2 px-2 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer text-center whitespace-nowrap ${
                activeTab === idx
                  ? 'bg-[#D6204E]/80 text-white shadow-2xs'
                  : 'text-black hover:text-[#D6204E]'
              }`}
            >
              <span className="block">{b.tag || b.name.replace(/\s*Branch/i, '')}</span>
            </button>
          ))}
        </div>

        {/* Phone Only: Horizontal Touch-Snap Carousel with Peek */}
        <div className="-mx-4 sm:hidden">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex snap-x snap-mandatory gap-3.5 overflow-x-auto overscroll-x-contain px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {BRANCHES.map((branch) => (
              <div
                key={branch.id}
                className="w-[88%] xs:w-[82%] max-w-[340px] flex-none snap-center"
              >
                <BranchCard branch={branch} />
              </div>
            ))}
          </div>

          {/* Pagination Indicator Dots */}
          <div className="flex items-center justify-center gap-2 mt-3.5">
            {BRANCHES.map((b, idx) => (
              <button
                key={b.id}
                type="button"
                onClick={() => handleTabClick(idx)}
                aria-label={`Switch to ${b.name}`}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  activeTab === idx
                    ? 'w-6 bg-[#D6204E]/80'
                    : 'w-2 bg-[#F0CDD7] hover:bg-[#D6204E]/60'
                }`}
              />
            ))}
          </div>

        </div>

        {/* Tablet and Desktop: Grid */}
        <div className="hidden grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 sm:grid items-stretch">
          {BRANCHES.map((branch) => (
            <div
              key={branch.id}
              className="min-w-0 w-full sm:last:col-span-2 sm:last:max-w-md sm:last:mx-auto lg:last:col-span-1 lg:last:max-w-none lg:last:mx-0 flex flex-col"
            >
              <BranchCard branch={branch} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

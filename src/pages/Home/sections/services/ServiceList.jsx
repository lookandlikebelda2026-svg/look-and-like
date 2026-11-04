import React from 'react';
import { SERVICE_CATEGORIES, SERVICE_MINI_CARDS } from '../../../../constants/services';

export function ServiceList() {
  return (
    <div className="lg:col-span-6 flex flex-col gap-8">
      {/* Category 1 & 2 Cards */}
      {SERVICE_CATEGORIES.map((category) => (
        <div key={category.id} className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-border-warm/50">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-border-warm/40">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-terracotta-rose text-[24px]">
                {category.icon}
              </span>
              <h3 className="font-headline-sm text-headline-sm text-deep-espresso">
                {category.name}
              </h3>
            </div>
            <span className="font-label-sm text-label-sm text-tertiary uppercase">
              {category.treatmentCount}
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {category.items.map((treatment, idx) => (
              <div
                key={treatment.id}
                className={`flex items-start justify-between gap-4 ${idx > 0 ? "pt-3 border-t border-border-warm/30" : ""}`}
              >
                <div>
                  <h4 className="font-body-md font-semibold text-deep-espresso">
                    {treatment.name}
                  </h4>
                  <p className="font-body-sm text-on-surface-variant mt-0.5">
                    {treatment.description}
                  </p>
                  <span className="font-label-sm text-tertiary mt-1 inline-block">
                    {treatment.duration}
                  </span>
                </div>
                <span className="font-sans font-price text-deep-espresso font-bold whitespace-nowrap">
                  {treatment.price}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Category 3 & 4 Mini Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {SERVICE_MINI_CARDS.map((mini) => (
          <div key={mini.id} className="bg-white p-6 rounded-2xl shadow-sm border border-border-warm/50">
            <span className="font-label-sm text-label-sm text-terracotta-rose uppercase font-semibold">
              {mini.category}
            </span>
            <h4 className="font-headline-sm text-deep-espresso mt-1 mb-3">
              {mini.title}
            </h4>
            <p className="font-body-sm text-on-surface-variant mb-4 leading-relaxed">
              {mini.description}
            </p>
            <span className="font-sans font-price font-bold text-deep-espresso">
              {mini.price}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

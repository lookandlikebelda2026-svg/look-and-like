import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Scissors, Sparkles } from 'lucide-react';
import { ServiceCard } from './ServiceCard';

/**
 * ServicesSection Component
 * Master management interface where services (e.g. Hair Care) are displayed with their individual price plans & photos.
 * Adding and editing directs to the dedicated ServiceFormPage.
 */
export function ServicesSection({
  servicesData = [],
  saveServicesData,
  resetServicesData,
  onNotify,
}) {
  const navigate = useNavigate();
  const servicesList = Array.isArray(servicesData) ? servicesData : [];

  // Total price plans across all services
  const totalPlansCount = servicesList.reduce(
    (acc, svc) => acc + (svc.plans?.length || svc.pricePlans?.length || 0),
    0
  );

  const handleOpenAdd = () => {
    navigate('/admin/services/new');
  };

  const handleOpenEdit = (service, index) => {
    navigate(`/admin/services/edit/${service.id || index}`);
  };

  const handleDeleteService = (index) => {
    const target = servicesList[index];
    const name = target?.name || 'this service';
    if (window.confirm(`Are you sure you want to delete "${name}" and all of its price plans?`)) {
      const updatedList = servicesList.filter((_, i) => i !== index);
      saveServicesData(updatedList);
      onNotify?.(`Deleted "${name}".`, 'info');
    }
  };

  const handleMoveService = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= servicesList.length) return;
    const updatedList = [...servicesList];
    const [moved] = updatedList.splice(index, 1);
    updatedList.splice(targetIdx, 0, moved);
    saveServicesData(updatedList);
  };

  const handleClearAll = () => {
    if (
      window.confirm(
        'Are you sure you want to remove all services? This will empty all services and their price plans.'
      )
    ) {
      resetServicesData();
      onNotify?.('All services removed.', 'info');
    }
  };

  return (
    <div>
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-[#F0CDD7]">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-serif text-lg font-bold text-deep-espresso">
              Salon Services &amp; Price Plans
            </h4>
            <span className="text-[11px] font-semibold text-[#D6204E] bg-[#FFF3F6] border border-[#F0CDD7] px-2.5 py-0.5 rounded-full">
              {servicesList.length} {servicesList.length === 1 ? 'Service' : 'Services'} · {totalPlansCount} Plans
            </span>
          </div>
          <p className="text-xs text-[#7A6B70] mt-0.5">
            Organize services (e.g. Hair Care) and define each of their price plans with photos and pricing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {servicesList.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-white hover:bg-rose-50 border border-rose-200 rounded-xl transition-all cursor-pointer"
              title="Remove all services"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#D6204E] to-[#B81942] hover:from-[#B81942] hover:to-[#961234] rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Service</span>
          </button>
        </div>
      </div>

      {/* Services List / Cards */}
      {servicesList.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-dashed border-stone-200 shadow-2xs">
          <div className="w-14 h-14 rounded-2xl bg-[#FFF3F6] border border-[#F0CDD7] flex items-center justify-center mx-auto mb-3 text-[#D6204E]">
            <Scissors className="w-7 h-7" />
          </div>
          <h5 className="font-serif text-lg font-bold text-deep-espresso mb-1">
            No Services Added Yet
          </h5>
          <p className="text-xs text-[#7A6B70] max-w-md mx-auto mb-4 leading-relaxed">
            All previous demo services have been removed. Click below to add a service like <strong>Hair Care</strong> along with its price plans, durations, and photos on the dedicated service form page.
          </p>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#D6204E] hover:bg-[#B81942] rounded-xl shadow-sm cursor-pointer transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Service</span>
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {servicesList.map((service, index) => (
            <ServiceCard
              key={service.id || index}
              service={service}
              index={index}
              totalCount={servicesList.length}
              onMove={handleMoveService}
              onEdit={handleOpenEdit}
              onDelete={handleDeleteService}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ServicesSection;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Scissors } from 'lucide-react';
import { ServiceCard } from './ServiceCard';
import { AdminCardSkeleton } from '../../../../components/common/Skeleton';

/**
 * ServicesSection Component
 * Master management interface where services are displayed with their individual price plans & photos.
 */
export function ServicesSection({
  servicesData = [],
  loading = false,
  saveServicesData,
  resetServicesData,
  onNotify,
}) {
  const navigate = useNavigate();
  const servicesList = Array.isArray(servicesData) ? servicesData : [];

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
    if (window.confirm(`Delete "${name}" and all of its price plans?`)) {
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
    if (window.confirm('Remove all parlour services and price plans?')) {
      resetServicesData();
      onNotify?.('All services removed.', 'info');
    }
  };

  return (
    <div>
      {/* Top Action Bar */}
      <div className="flex items-center justify-between gap-2 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-[#F0CDD7]">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-serif text-base sm:text-lg font-bold text-deep-espresso truncate">
              Services<span className="hidden sm:inline"> &amp; Plans</span>
            </h4>
            <span className="text-[10px] sm:text-[11px] font-semibold text-[#D6204E] bg-[#FFF3F6] border border-[#F0CDD7] px-2 py-0.5 rounded-full shrink-0">
              {servicesList.length} {servicesList.length === 1 ? 'Service' : 'Services'}
              <span className="hidden sm:inline"> · {totalPlansCount} Plans</span>
            </span>
          </div>
          <p className="hidden sm:block text-xs text-[#7A6B70] mt-0.5">
            Organize services and configure price plans with photos.
          </p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#D6204E] to-[#B81942] hover:from-[#B81942] hover:to-[#961234] rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Service</span>
          </button>
        </div>
      </div>

      {/* Services List / Cards */}
      {loading ? (
        <AdminCardSkeleton count={3} />
      ) : servicesList.length === 0 ? (
        <div className="text-center py-12 sm:py-16 px-4 bg-white rounded-2xl sm:rounded-3xl border border-dashed border-stone-200 shadow-2xs">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#FFF3F6] border border-[#F0CDD7] flex items-center justify-center mx-auto mb-3 text-[#D6204E]">
            <Scissors className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <h5 className="font-serif text-base sm:text-lg font-bold text-deep-espresso mb-1">
            No Services Added Yet
          </h5>
          <p className="text-xs text-[#7A6B70] max-w-sm mx-auto mb-4">
            Click below to create your first parlour service category and price plans.
          </p>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 text-xs font-bold text-white bg-[#D6204E] hover:bg-[#B81942] rounded-xl shadow-xs cursor-pointer transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Service</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3.5 sm:space-y-5">
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

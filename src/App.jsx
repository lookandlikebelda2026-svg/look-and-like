import React, { useState } from 'react';
import { AppRoutes } from './routes/AppRoutes';
import { Toast } from './components/ui/Toast';
import { Modal } from './components/common/Modal';
import { BookingForm } from './pages/Home/sections/booking/BookingForm';

export function App() {
  const [toast, setToast] = useState({ message: '', type: 'info' });
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [preselectedBooking, setPreselectedBooking] = useState(null);

  const notify = (message, type = 'info') => {
    setToast({ message, type });
  };

  const handleOpenBooking = (preselected) => {
    setPreselectedBooking(preselected || null);
    setIsBookingModalOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingModalOpen(false);
  };

  return (
    <>
      {/* Central Application Routes */}
      <AppRoutes
        onOpenBooking={handleOpenBooking}
        onNotify={notify}
      />

      {/* Booking Appointment Modal Popup */}
      <Modal
        isOpen={isBookingModalOpen}
        onClose={handleCloseBooking}
        maxWidth="max-w-xl"
      >
        <BookingForm
          preselectedCategory={preselectedBooking}
          onNotify={notify}
          onClose={handleCloseBooking}
        />
      </Modal>

      {/* Global Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'info' })}
      />
    </>
  );
}

export default App;

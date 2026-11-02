import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  CalendarCheck,
  MessageSquare,
  Image as ImageIcon,
  Briefcase,
  Scissors,
  LogOut,
  ExternalLink,
  RefreshCw,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  CheckCheck,
  AlertCircle,
  Phone,
  Search,
  Filter,
  Sliders,
  ChevronRight,
  ShieldCheck,
  X
} from 'lucide-react';
import { LOGO_URL } from '../../constants/navigation';
import { CURATED_MENU_DATA } from '../../constants/services';
import { useContentStorage } from '../../services/contentStorage';
import { ImageKitUploader } from '../../components/common/ImageKitUploader';
import {
  getBookingsFromFirebase,
  updateBookingStatusInFirebase,
  deleteBookingFromFirebase
} from '../../services/bookingFirebaseService';
import {
  getInquiriesFromFirebase,
  updateInquiryStatusInFirebase,
  deleteInquiryFromFirebase
} from '../../services/inquiryFirebaseService';
import { logoutAdmin, getLocalAdminSession } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

export function AdminPanel({ adminUser, onLogout, onNavigate, onNotify }) {
  const navigate = useNavigate();
  const currentUser = adminUser || getLocalAdminSession();
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard | bookings | inquiries | lookbook | partners | services

  // Content storage for Lookbook & Partners
  const {
    inspiredImages,
    partners,
    saveInspiredImages,
    resetInspiredImages,
    savePartners,
    resetPartners
  } = useContentStorage();

  // Firebase Bookings state
  const [bookings, setBookings] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [bookingFilter, setBookingFilter] = useState('all'); // all | pending | confirmed | completed | cancelled
  const [bookingSearch, setBookingSearch] = useState('');

  // Firebase Inquiries state
  const [inquiries, setInquiries] = useState([]);
  const [isLoadingInquiries, setIsLoadingInquiries] = useState(false);

  // Sub-modal states for Lookbook
  const [isAddingLook, setIsAddingLook] = useState(false);
  const [editingLook, setEditingLook] = useState(null);
  const [lookForm, setLookForm] = useState({ imageUrl: '', alt: '' });

  // Sub-modal states for Partners
  const [isAddingPartner, setIsAddingPartner] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);
  const [partnerForm, setPartnerForm] = useState({ name: '', logoUrl: '', specialty: '', country: '' });

  // Fetch Firebase Data on mount or refresh
  const loadFirebaseData = async () => {
    setIsLoadingBookings(true);
    setIsLoadingInquiries(true);
    try {
      const [fetchedBookings, fetchedInquiries] = await Promise.all([
        getBookingsFromFirebase(),
        getInquiriesFromFirebase()
      ]);
      setBookings(fetchedBookings);
      setInquiries(fetchedInquiries);
    } catch (err) {
      console.error('Failed to load admin data:', err);
      onNotify?.('Error loading live data from Firebase.', 'error');
    } finally {
      setIsLoadingBookings(false);
      setIsLoadingInquiries(false);
    }
  };

  useEffect(() => {
    loadFirebaseData();
  }, []);

  // --- Booking Handlers ---
  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    const result = await updateBookingStatusInFirebase(bookingId, newStatus);
    if (result.success) {
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
      );
      onNotify?.(`Booking status updated to ${newStatus}.`, 'success');
    } else {
      onNotify?.('Failed to update booking status.', 'error');
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this booking record?')) return;
    const result = await deleteBookingFromFirebase(bookingId);
    if (result.success) {
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
      onNotify?.('Booking record removed.', 'info');
    } else {
      onNotify?.('Failed to delete booking.', 'error');
    }
  };

  // --- Inquiry Handlers ---
  const handleUpdateInquiryStatus = async (inquiryId, newStatus) => {
    const result = await updateInquiryStatusInFirebase(inquiryId, newStatus);
    if (result.success) {
      setInquiries((prev) =>
        prev.map((inq) => (inq.id === inquiryId ? { ...inq, status: newStatus } : inq))
      );
      onNotify?.('Inquiry marked as updated.', 'success');
    }
  };

  const handleDeleteInquiry = async (inquiryId) => {
    if (!window.confirm('Delete this inquiry note?')) return;
    const result = await deleteInquiryFromFirebase(inquiryId);
    if (result.success) {
      setInquiries((prev) => prev.filter((inq) => inq.id !== inquiryId));
      onNotify?.('Inquiry deleted.', 'info');
    }
  };

  // --- Lookbook Handlers ---
  const handleSaveLook = (e) => {
    e.preventDefault();
    if (!lookForm.imageUrl) {
      onNotify?.('Please provide an image.', 'error');
      return;
    }

    if (editingLook) {
      const updated = [...inspiredImages];
      updated[editingLook.index] = {
        ...editingLook.item,
        imageUrl: lookForm.imageUrl,
        alt: lookForm.alt || 'Editorial Look'
      };
      saveInspiredImages(updated);
      onNotify?.('Lookbook image updated.', 'success');
    } else {
      const newLook = {
        id: `look-${Date.now()}`,
        imageUrl: lookForm.imageUrl,
        alt: lookForm.alt || 'Look & Like Lookbook'
      };
      saveInspiredImages([newLook, ...inspiredImages]);
      onNotify?.('New look added to Lookbook!', 'success');
    }
    setIsAddingLook(false);
    setEditingLook(null);
    setLookForm({ imageUrl: '', alt: '' });
  };

  const handleDeleteLook = (index) => {
    if (!window.confirm('Remove this photo from the lookbook?')) return;
    const updated = inspiredImages.filter((_, i) => i !== index);
    saveInspiredImages(updated);
    onNotify?.('Photo removed from lookbook.', 'info');
  };

  // --- Partner Handlers ---
  const handleSavePartner = (e) => {
    e.preventDefault();
    if (!partnerForm.name || !partnerForm.logoUrl) {
      onNotify?.('Please provide brand name and logo.', 'error');
      return;
    }

    if (editingPartner) {
      const updated = [...partners];
      updated[editingPartner.index] = {
        ...editingPartner.item,
        ...partnerForm
      };
      savePartners(updated);
      onNotify?.('Brand partner updated.', 'success');
    } else {
      const newPartner = {
        id: `partner-${Date.now()}`,
        ...partnerForm
      };
      savePartners([...partners, newPartner]);
      onNotify?.('Brand partner added to live carousel!', 'success');
    }
    setIsAddingPartner(false);
    setEditingPartner(null);
    setPartnerForm({ name: '', logoUrl: '', specialty: '', country: '' });
  };

  const handleDeletePartner = (index) => {
    if (!window.confirm('Remove this brand partner?')) return;
    const updated = partners.filter((_, i) => i !== index);
    savePartners(updated);
    onNotify?.('Partner removed from carousel.', 'info');
  };

  // Filtered Bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = bookingFilter === 'all' || (b.status || 'pending') === bookingFilter;
    const matchesSearch =
      !bookingSearch ||
      (b.name && b.name.toLowerCase().includes(bookingSearch.toLowerCase())) ||
      (b.phone && b.phone.includes(bookingSearch)) ||
      (b.service && b.service.toLowerCase().includes(bookingSearch.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const pendingBookingsCount = bookings.filter((b) => (b.status || 'pending') === 'pending').length;
  const unreadInquiriesCount = inquiries.filter((i) => (i.status || 'unread') === 'unread').length;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-deep-espresso flex flex-col font-sans">
      {/* 1. Admin Studio Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#F0CDD7] shadow-xs">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FFF3F6] border border-[#F0CDD7] flex items-center justify-center">
              <img src={LOGO_URL} alt="Look & Like" className="w-5 h-5 object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg font-bold tracking-tight text-deep-espresso">
                  Look &amp; Like
                </span>
                <span className="hidden xs:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FFF3F6] text-[#D6204E] border border-[#F0CDD7]">
                  Atelier CMS
                </span>
              </div>
              <span className="hidden sm:block text-[11px] text-[#7A6B70]">
                Backend Studio &amp; Content Management
              </span>
            </div>
          </div>

          {/* Quick Actions & Admin Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live System Indicator */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Firebase Live</span>
            </div>

            {/* View Live Website Button */}
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 text-xs font-semibold text-deep-espresso hover:text-[#D6204E] bg-white hover:bg-[#FFF8FA] border border-[#F0CDD7] rounded-xl transition-all cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Live Website</span>
            </button>

            {/* Admin User Info */}
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-xs font-bold text-deep-espresso">
                {currentUser?.displayName || 'Administrator'}
              </span>
              <span className="text-[10px] text-[#7A6B70]">
                {currentUser?.email || 'admin@lookandlike.com'}
              </span>
            </div>

            {/* Logout Button */}
            <button
              type="button"
              onClick={async () => {
                await logoutAdmin();
                onLogout?.();
                navigate('/');
                onNotify?.('Signed out successfully.', 'info');
              }}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Sign Out of Admin"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Studio Layout Body */}
      <div className="max-w-[1500px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col lg:flex-row gap-6">
        
        {/* Navigation Sidebar */}
        <aside className="w-full lg:w-64 shrink-0 flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-white text-[#D6204E] border border-[#F0CDD7] shadow-xs'
                : 'text-[#6B5A60] hover:text-deep-espresso hover:bg-white/60'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center justify-between gap-2 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'bookings'
                ? 'bg-white text-[#D6204E] border border-[#F0CDD7] shadow-xs'
                : 'text-[#6B5A60] hover:text-deep-espresso hover:bg-white/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CalendarCheck className="w-4 h-4 shrink-0" />
              <span>Bookings</span>
            </div>
            {pendingBookingsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D6204E] text-white">
                {pendingBookingsCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('inquiries')}
            className={`flex items-center justify-between gap-2 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'inquiries'
                ? 'bg-white text-[#D6204E] border border-[#F0CDD7] shadow-xs'
                : 'text-[#6B5A60] hover:text-deep-espresso hover:bg-white/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span>Inquiries</span>
            </div>
            {unreadInquiriesCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#8F2946] text-white">
                {unreadInquiriesCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('lookbook')}
            className={`flex items-center justify-between gap-2 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'lookbook'
                ? 'bg-white text-[#D6204E] border border-[#F0CDD7] shadow-xs'
                : 'text-[#6B5A60] hover:text-deep-espresso hover:bg-white/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ImageIcon className="w-4 h-4 shrink-0" />
              <span>Lookbook Photos</span>
            </div>
            <span className="text-[11px] text-[#7A6B70] font-normal">
              {inspiredImages.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('partners')}
            className={`flex items-center justify-between gap-2 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'partners'
                ? 'bg-white text-[#D6204E] border border-[#F0CDD7] shadow-xs'
                : 'text-[#6B5A60] hover:text-deep-espresso hover:bg-white/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Briefcase className="w-4 h-4 shrink-0" />
              <span>Brand Partners</span>
            </div>
            <span className="text-[11px] text-[#7A6B70] font-normal">
              {partners.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('services')}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'services'
                ? 'bg-white text-[#D6204E] border border-[#F0CDD7] shadow-xs'
                : 'text-[#6B5A60] hover:text-deep-espresso hover:bg-white/60'
            }`}
          >
            <Scissors className="w-4 h-4 shrink-0" />
            <span>Service Ledger</span>
          </button>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 flex flex-col">

          {/* =========================================================
              TAB: DASHBOARD OVERVIEW
              ========================================================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-[#F0CDD7] shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#7A6B70]">
                      Total Bookings
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[#FFF3F6] text-[#D6204E] flex items-center justify-center">
                      <CalendarCheck className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="font-serif text-3xl font-bold text-deep-espresso">
                    {bookings.length}
                  </h3>
                  <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
                    <span>{pendingBookingsCount} action required</span>
                  </p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-[#F0CDD7] shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#7A6B70]">
                      Client Inquiries
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[#FCE5EB] text-[#8F2946] flex items-center justify-center">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="font-serif text-3xl font-bold text-deep-espresso">
                    {inquiries.length}
                  </h3>
                  <p className="text-[11px] text-[#8F2946] font-medium mt-1">
                    {unreadInquiriesCount} unread notes
                  </p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-[#F0CDD7] shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#7A6B70]">
                      Lookbook Photos
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[#FFF3F6] text-[#D6204E] flex items-center justify-center">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="font-serif text-3xl font-bold text-deep-espresso">
                    {inspiredImages.length}
                  </h3>
                  <p className="text-[11px] text-[#7A6B70] mt-1">
                    Powered by ImageKit CDN
                  </p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-[#F0CDD7] shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#7A6B70]">
                      Brand Partners
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[#FAF8F5] text-deep-espresso flex items-center justify-center">
                      <Briefcase className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="font-serif text-3xl font-bold text-deep-espresso">
                    {partners.length}
                  </h3>
                  <p className="text-[11px] text-[#7A6B70] mt-1">
                    Active in live carousel
                  </p>
                </div>
              </div>

              {/* Recent Bookings Snapshot */}
              <div className="bg-white rounded-3xl border border-[#F0CDD7] p-5 sm:p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-serif text-lg font-bold text-deep-espresso">
                      Recent Reservations
                    </h4>
                    <p className="text-xs text-[#7A6B70]">
                      Latest appointments transmitted via live booking module.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('bookings')}
                    className="text-xs font-semibold text-[#D6204E] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All Bookings</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {bookings.length === 0 ? (
                  <div className="py-8 text-center text-[#7A6B70] text-xs">
                    No reservations recorded yet. New appointments booked on the website will appear here in real-time.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-stone-100 text-[10px] font-bold uppercase tracking-wider text-[#7A6B70]">
                          <th className="py-2.5 px-3">Guest</th>
                          <th className="py-2.5 px-3">Service</th>
                          <th className="py-2.5 px-3">Branch</th>
                          <th className="py-2.5 px-3">Date &amp; Slot</th>
                          <th className="py-2.5 px-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {bookings.slice(0, 5).map((b) => (
                          <tr key={b.id} className="hover:bg-[#FFFDFE]">
                            <td className="py-3 px-3">
                              <span className="font-semibold text-deep-espresso block">{b.name}</span>
                              <span className="text-[11px] text-[#7A6B70]">{b.phone}</span>
                            </td>
                            <td className="py-3 px-3 text-[#5C4D52]">
                              {b.service || 'Bespoke Consultation'}
                            </td>
                            <td className="py-3 px-3 text-[#5C4D52]">
                              {b.branch || 'City Centre'}
                            </td>
                            <td className="py-3 px-3 text-[#5C4D52]">
                              {b.date || 'TBD'} · {b.timeSlot || 'Afternoon'}
                            </td>
                            <td className="py-3 px-3">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  b.status === 'confirmed'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : b.status === 'completed'
                                    ? 'bg-blue-100 text-blue-800'
                                    : b.status === 'cancelled'
                                    ? 'bg-stone-100 text-stone-600'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {b.status || 'pending'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =========================================================
              TAB: BOOKINGS & RESERVATIONS
              ========================================================= */}
          {activeTab === 'bookings' && (
            <div className="bg-white rounded-3xl border border-[#F0CDD7] p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
                <div>
                  <h4 className="font-serif text-xl font-bold text-deep-espresso">
                    Client Reservations
                  </h4>
                  <p className="text-xs text-[#7A6B70]">
                    Real-time bookings synchronized with Firebase Cloud Firestore.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={loadFirebaseData}
                    disabled={isLoadingBookings}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-deep-espresso bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl transition-all cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingBookings ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Search */}
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A66B78]" />
                  <input
                    type="text"
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    placeholder="Search by guest name, phone, or service..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#F0CDD7] focus:outline-none focus:border-[#D6204E]"
                  />
                </div>

                {/* Status Filter Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                  {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setBookingFilter(status)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                        bookingFilter === status
                          ? 'bg-[#D6204E] text-white shadow-xs'
                          : 'bg-stone-50 text-[#7A6B70] hover:bg-stone-100'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bookings Table */}
              {isLoadingBookings ? (
                <div className="py-12 text-center text-xs text-[#7A6B70] flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#D6204E]" />
                  <span>Loading reservations from Firebase...</span>
                </div>
              ) : filteredBookings.length === 0 ? (
                <div className="py-12 text-center text-xs text-[#7A6B70]">
                  No matching reservations found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-stone-100 text-[10px] font-bold uppercase tracking-wider text-[#7A6B70]">
                        <th className="py-2.5 px-3">Guest Contact</th>
                        <th className="py-2.5 px-3">Service &amp; Artist</th>
                        <th className="py-2.5 px-3">Branch &amp; Slot</th>
                        <th className="py-2.5 px-3">Status Action</th>
                        <th className="py-2.5 px-3 text-right">Manage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-[#FFFDFE] transition-colors">
                          <td className="py-3 px-3">
                            <span className="font-bold text-deep-espresso block text-sm">{b.name}</span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[11px] text-[#7A6B70]">{b.phone}</span>
                              {b.phone && (
                                <a
                                  href={`https://wa.me/${b.phone.replace(/[^0-9]/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-emerald-600 hover:text-emerald-700 font-semibold text-[10px] flex items-center gap-0.5"
                                  title="Chat on WhatsApp"
                                >
                                  <Phone className="w-3 h-3" />
                                  <span>WhatsApp</span>
                                </a>
                              )}
                            </div>
                          </td>

                          <td className="py-3 px-3">
                            <span className="font-semibold text-deep-espresso block">{b.service}</span>
                            <span className="text-[11px] text-[#7A6B70]">{b.artist || 'Master Artist'}</span>
                          </td>

                          <td className="py-3 px-3">
                            <span className="text-deep-espresso font-medium block">{b.branch}</span>
                            <span className="text-[11px] text-[#7A6B70]">{b.date} · {b.timeSlot}</span>
                          </td>

                          <td className="py-3 px-3">
                            <select
                              value={b.status || 'pending'}
                              onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value)}
                              className={`text-[11px] font-bold uppercase tracking-wider rounded-lg px-2.5 py-1 border transition-colors cursor-pointer ${
                                b.status === 'confirmed'
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                  : b.status === 'completed'
                                  ? 'bg-blue-50 border-blue-300 text-blue-800'
                                  : b.status === 'cancelled'
                                  ? 'bg-stone-50 border-stone-300 text-stone-600'
                                  : 'bg-amber-50 border-amber-300 text-amber-800'
                              }`}
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>

                          <td className="py-3 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleDeleteBooking(b.id)}
                              className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete booking"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* =========================================================
              TAB: CLIENT INQUIRIES & NOTES
              ========================================================= */}
          {activeTab === 'inquiries' && (
            <div className="bg-white rounded-3xl border border-[#F0CDD7] p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div>
                  <h4 className="font-serif text-xl font-bold text-deep-espresso">
                    Client Inquiries &amp; Notes
                  </h4>
                  <p className="text-xs text-[#7A6B70]">
                    Direct concierge requests transmitted through the inquiry form.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={loadFirebaseData}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-deep-espresso bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh</span>
                </button>
              </div>

              {inquiries.length === 0 ? (
                <div className="py-12 text-center text-xs text-[#7A6B70]">
                  No client notes received yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {inquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="p-4 rounded-2xl border border-[#F0CDD7] bg-[#FFFDFE] flex flex-col justify-between gap-3 shadow-xs"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h5 className="font-bold text-sm text-deep-espresso">
                              {inq.name}
                            </h5>
                            <span className="text-xs text-[#7A6B70]">
                              {inq.contact}
                            </span>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              inq.status === 'replied'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {inq.status || 'unread'}
                          </span>
                        </div>

                        <p className="text-xs text-[#5C4D52] bg-white p-3 rounded-xl border border-stone-100 leading-relaxed italic">
                          "{inq.message}"
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-stone-100 pt-2 text-xs">
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateInquiryStatus(
                              inq.id,
                              inq.status === 'replied' ? 'unread' : 'replied'
                            )
                          }
                          className="text-[11px] font-semibold text-[#D6204E] hover:underline cursor-pointer"
                        >
                          {inq.status === 'replied' ? 'Mark Unread' : 'Mark as Replied'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteInquiry(inq.id)}
                          className="p-1 text-stone-400 hover:text-rose-600 rounded cursor-pointer"
                          title="Delete note"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* =========================================================
              TAB: LOOKBOOK & EDITORIAL IMAGES (IMAGEKIT CDN)
              ========================================================= */}
          {activeTab === 'lookbook' && (
            <div className="bg-white rounded-3xl border border-[#F0CDD7] p-5 sm:p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                <div>
                  <h4 className="font-serif text-xl font-bold text-deep-espresso">
                    Editorial Lookbook Management
                  </h4>
                  <p className="text-xs text-[#7A6B70]">
                    Photos uploaded directly to ImageKit CDN and delivered with responsive transformations.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Reset Lookbook to initial atelier defaults?')) {
                        resetInspiredImages();
                        onNotify?.('Reset to default lookbook images.', 'info');
                      }
                    }}
                    className="px-3 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-50 border border-stone-200 rounded-xl transition-all cursor-pointer"
                  >
                    Reset Defaults
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLookForm({ imageUrl: '', alt: '' });
                      setEditingLook(null);
                      setIsAddingLook(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#D6204E] to-[#B81942] hover:from-[#B81942] hover:to-[#961234] rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Upload New Look</span>
                  </button>
                </div>
              </div>

              {/* Add / Edit Form Modal / Overlay */}
              {(isAddingLook || editingLook !== null) && (
                <form
                  onSubmit={handleSaveLook}
                  className="p-5 rounded-2xl bg-[#FFF8FA] border border-[#F0CDD7] space-y-4 animate-fadeIn"
                >
                  <div className="flex items-center justify-between border-b border-[#F0CDD7]/80 pb-2.5">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-[#D6204E]">
                      {editingLook ? 'Edit Lookbook Photo' : 'Upload New Lookbook Photo'}
                    </h5>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingLook(false);
                        setEditingLook(null);
                      }}
                      className="text-stone-400 hover:text-stone-700 text-xs font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  <ImageKitUploader
                    value={lookForm.imageUrl}
                    onChange={(url) => setLookForm({ ...lookForm, imageUrl: url })}
                    folder="/lookbook"
                    tags={['lookbook', 'editorial']}
                    label="Editorial Photo"
                    helpText="Upload directly to ImageKit CDN (PNG, JPG, WEBP)"
                  />

                  <div>
                    <label className="block text-xs font-bold text-deep-espresso mb-1">
                      Alt &amp; Styling Description
                    </label>
                    <input
                      type="text"
                      value={lookForm.alt}
                      onChange={(e) => setLookForm({ ...lookForm, alt: e.target.value })}
                      placeholder="e.g. Haute Couture Balayage & Silk Wave Styling"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#F0CDD7] focus:outline-none focus:border-[#D6204E]"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingLook(false);
                        setEditingLook(null);
                      }}
                      className="px-4 py-2 text-xs font-semibold text-stone-600 bg-white border border-stone-200 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#D6204E] to-[#B81942] rounded-xl shadow-xs"
                    >
                      {editingLook ? 'Save Changes' : 'Publish to Lookbook'}
                    </button>
                  </div>
                </form>
              )}

              {/* Photos Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                {inspiredImages.map((img, idx) => (
                  <div
                    key={img.id || idx}
                    className="group relative rounded-2xl overflow-hidden border border-[#F0CDD7] bg-[#FFF3F6] aspect-[3/4] shadow-xs"
                  >
                    <img
                      src={img.imageUrl}
                      alt={img.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Action Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2.5 text-white">
                      <span className="text-[10px] font-mono text-white/80">#{idx + 1}</span>
                      <p className="text-[11px] line-clamp-2 leading-tight">
                        {img.alt}
                      </p>
                      <div className="flex justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingLook({ item: img, index: idx });
                            setLookForm({ imageUrl: img.imageUrl, alt: img.alt });
                            setIsAddingLook(false);
                          }}
                          className="px-2 py-1 rounded bg-white/90 text-deep-espresso hover:bg-white text-[10px] font-bold cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteLook(idx)}
                          className="p-1 rounded bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
                          title="Delete photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================
              TAB: BRAND PARTNERS
              ========================================================= */}
          {activeTab === 'partners' && (
            <div className="bg-white rounded-3xl border border-[#F0CDD7] p-5 sm:p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                <div>
                  <h4 className="font-serif text-xl font-bold text-deep-espresso">
                    Brand Partners Carousel
                  </h4>
                  <p className="text-xs text-[#7A6B70]">
                    Manage brand logos and product partnerships featured in the homepage marquee.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Reset brand partners to defaults?')) {
                        resetPartners();
                        onNotify?.('Reset brand partners to defaults.', 'info');
                      }
                    }}
                    className="px-3 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-50 border border-stone-200 rounded-xl transition-all cursor-pointer"
                  >
                    Reset Defaults
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPartnerForm({ name: '', logoUrl: '', specialty: '', country: '' });
                      setEditingPartner(null);
                      setIsAddingPartner(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#D6204E] to-[#B81942] hover:from-[#B81942] hover:to-[#961234] rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Partner</span>
                  </button>
                </div>
              </div>

              {/* Partner Add/Edit Form */}
              {(isAddingPartner || editingPartner !== null) && (
                <form
                  onSubmit={handleSavePartner}
                  className="p-5 rounded-2xl bg-[#FFF8FA] border border-[#F0CDD7] space-y-4 animate-fadeIn"
                >
                  <div className="flex items-center justify-between border-b border-[#F0CDD7]/80 pb-2.5">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-[#D6204E]">
                      {editingPartner ? 'Edit Brand Partner' : 'Add Brand Partner'}
                    </h5>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingPartner(false);
                        setEditingPartner(null);
                      }}
                      className="text-stone-400 hover:text-stone-700 text-xs font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-deep-espresso mb-1">
                        Brand Name
                      </label>
                      <input
                        type="text"
                        required
                        value={partnerForm.name}
                        onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })}
                        placeholder="e.g. KÉRASTASE"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#F0CDD7]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-deep-espresso mb-1">
                        Origin / Country
                      </label>
                      <input
                        type="text"
                        value={partnerForm.country}
                        onChange={(e) => setPartnerForm({ ...partnerForm, country: e.target.value })}
                        placeholder="e.g. Paris"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#F0CDD7]"
                      />
                    </div>
                  </div>

                  <ImageKitUploader
                    value={partnerForm.logoUrl}
                    onChange={(url) => setPartnerForm({ ...partnerForm, logoUrl: url })}
                    folder="/partners"
                    tags={['partner', 'logo']}
                    label="Brand Logo"
                    helpText="Upload SVG, PNG or WEBP with transparency to ImageKit"
                  />

                  <div>
                    <label className="block text-xs font-bold text-deep-espresso mb-1">
                      Treatment Specialty / Protocol
                    </label>
                    <input
                      type="text"
                      value={partnerForm.specialty}
                      onChange={(e) => setPartnerForm({ ...partnerForm, specialty: e.target.value })}
                      placeholder="e.g. Professional Hair Rituals & Scalp Diagnostics"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#F0CDD7]"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingPartner(false);
                        setEditingPartner(null);
                      }}
                      className="px-4 py-2 text-xs font-semibold text-stone-600 bg-white border border-stone-200 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#D6204E] to-[#B81942] rounded-xl shadow-xs"
                    >
                      {editingPartner ? 'Save Changes' : 'Add to Partners'}
                    </button>
                  </div>
                </form>
              )}

              {/* Partners Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {partners.map((p, idx) => (
                  <div
                    key={p.id || idx}
                    className="p-4 rounded-2xl border border-[#F0CDD7] bg-white flex items-center justify-between gap-3 shadow-xs hover:border-[#D6204E] transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-14 h-10 rounded-xl bg-[#FFF8FA] border border-[#F0CDD7] p-1 flex items-center justify-center shrink-0">
                        <img
                          src={p.logoUrl}
                          alt={p.name}
                          className="max-h-6 max-w-[48px] object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <h5 className="font-bold text-xs text-deep-espresso truncate">
                          {p.name}
                        </h5>
                        <p className="text-[10px] text-[#7A6B70] truncate">
                          {p.country || 'Global'} · {p.specialty || 'Atelier Partner'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPartner({ item: p, index: idx });
                          setPartnerForm({
                            name: p.name || '',
                            logoUrl: p.logoUrl || '',
                            specialty: p.specialty || '',
                            country: p.country || ''
                          });
                          setIsAddingPartner(false);
                        }}
                        className="p-1.5 text-stone-500 hover:text-deep-espresso rounded cursor-pointer"
                        title="Edit partner"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePartner(idx)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 rounded cursor-pointer"
                        title="Delete partner"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================
              TAB: SERVICES & MENU LEDGER (REFERENCE)
              ========================================================= */}
          {activeTab === 'services' && (
            <div className="bg-white rounded-3xl border border-[#F0CDD7] p-5 sm:p-6 shadow-xs space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <h4 className="font-serif text-xl font-bold text-deep-espresso">
                  Atelier Service Ledger Reference
                </h4>
                <p className="text-xs text-[#7A6B70]">
                  Overview of all active signature treatments, descriptions, and starting prices.
                </p>
              </div>

              <div className="space-y-6">
                {['hair', 'skin', 'nails', 'makeup', 'spa'].map((catKey) => {
                  const category = CURATED_MENU_DATA[catKey];
                  if (!category) return null;

                  return (
                    <div key={catKey} className="border border-[#F0CDD7] rounded-2xl overflow-hidden">
                      <div className="bg-[#FFF8FA] p-3.5 border-b border-[#F0CDD7] flex items-center justify-between">
                        <h5 className="font-bold text-sm text-[#D6204E]">
                          {category.title}
                        </h5>
                        <span className="text-xs font-semibold text-[#8F2946]">
                          {category.items.length} Treatments
                        </span>
                      </div>
                      <div className="divide-y divide-stone-100">
                        {category.items.map((item) => (
                          <div key={item.id} className="p-3 flex items-center justify-between text-xs hover:bg-[#FFFDFE]">
                            <div>
                              <span className="font-semibold text-deep-espresso block">{item.name}</span>
                              <span className="text-[11px] text-[#7A6B70]">{item.description}</span>
                            </div>
                            <span className="font-serif italic font-bold text-[#D6204E] text-sm shrink-0 ml-4">
                              {item.price}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default AdminPanel;


import React, { useState } from 'react';
import {
  CalendarCheck,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  User,
  Calendar,
  BedDouble,
  CreditCard,
  Printer
} from 'lucide-react';
import { Booking, Room, Guest, BookingStatus, PaymentStatus, HotelSettings, Payment } from '../types';
import { Modal } from '../components/Modal';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { useToast } from '../context/ToastContext';
import confetti from 'canvas-confetti';

interface BookingsViewProps {
  bookings: Booking[];
  setBookings: (bookings: Booking[]) => void;
  rooms: Room[];
  setRooms: (rooms: Room[]) => void;
  guests: Guest[];
  setGuests: (guests: Guest[]) => void;
  payments: Payment[];
  setPayments: (payments: Payment[]) => void;
  settings: HotelSettings;
  onViewInvoice: (booking: Booking) => void;
  onCheckOutBooking: (booking: Booking) => void;
}

export const BookingsView: React.FC<BookingsViewProps> = ({
  bookings,
  setBookings,
  rooms,
  setRooms,
  guests,
  setGuests,
  payments,
  setPayments,
  settings,
  onViewInvoice,
  onCheckOutBooking
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [paymentFilter, setPaymentFilter] = useState<string>('All');

  // Modals state
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [deletingBooking, setDeletingBooking] = useState<Booking | null>(null);
  const [viewingBooking, setViewingBooking] = useState<Booking | null>(null);
  const [confirmationModalBooking, setConfirmationModalBooking] = useState<Booking | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    guestMode: 'existing' as 'existing' | 'new',
    guestId: '',
    newGuestName: '',
    newGuestEmail: '',
    newGuestPhone: '',
    roomNumber: '101',
    checkInDate: '2026-09-02',
    checkOutDate: '2026-09-05',
    guestsCount: 2,
    status: 'Confirmed' as BookingStatus,
    paymentStatus: 'Paid' as PaymentStatus,
    paymentMethod: 'Credit Card' as any,
    specialRequests: ''
  });

  const { success, error, info } = useToast();

  const handleOpenAdd = () => {
    setEditingBooking(null);
    const availableRoom = rooms.find((r) => r.status === 'Available') || rooms[0];
    const defaultGuest = guests[0];

    setFormData({
      guestMode: 'existing',
      guestId: defaultGuest ? defaultGuest.id : '',
      newGuestName: '',
      newGuestEmail: '',
      newGuestPhone: '',
      roomNumber: availableRoom ? availableRoom.roomNumber : '101',
      checkInDate: '2026-09-03',
      checkOutDate: '2026-09-06',
      guestsCount: 2,
      status: 'Confirmed',
      paymentStatus: 'Paid',
      paymentMethod: 'Credit Card',
      specialRequests: ''
    });
    setIsAddEditOpen(true);
  };

  const handleOpenEdit = (b: Booking) => {
    setEditingBooking(b);
    setFormData({
      guestMode: 'existing',
      guestId: b.guestId,
      newGuestName: b.guestName,
      newGuestEmail: b.guestEmail,
      newGuestPhone: b.guestPhone,
      roomNumber: b.roomNumber,
      checkInDate: b.checkInDate,
      checkOutDate: b.checkOutDate,
      guestsCount: b.guestsCount,
      status: b.status,
      paymentStatus: b.paymentStatus,
      paymentMethod: 'Credit Card',
      specialRequests: b.specialRequests || ''
    });
    setIsAddEditOpen(true);
  };

  const calculateTotal = (roomNum: string, inDate: string, outDate: string) => {
    const targetRoom = rooms.find((r) => r.roomNumber === roomNum);
    const nightlyPrice = targetRoom ? targetRoom.pricePerNight : 120;
    const d1 = new Date(inDate);
    const d2 = new Date(outDate);
    const diffDays = Math.max(1, Math.ceil(Math.abs(d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)));
    return nightlyPrice * diffDays;
  };

  const handleSaveBooking = (e: React.FormEvent) => {
    e.preventDefault();

    let guestName = '';
    let guestEmail = '';
    let guestPhone = '';
    let finalGuestId = formData.guestId;

    if (formData.guestMode === 'new') {
      if (!formData.newGuestName || !formData.newGuestEmail) {
        error('Guest Validation', 'Please provide the guest name and email.');
        return;
      }
      finalGuestId = `GST-${Math.floor(1000 + Math.random() * 9000)}`;
      guestName = formData.newGuestName;
      guestEmail = formData.newGuestEmail;
      guestPhone = formData.newGuestPhone || '+1 (555) 000-0000';

      const newGuest: Guest = {
        id: finalGuestId,
        name: guestName,
        email: guestEmail,
        phone: guestPhone,
        address: 'Registered during reservation',
        idProofType: 'Passport',
        idProofNumber: `ID-${Math.floor(100000 + Math.random() * 900000)}`,
        visitsCount: 1,
        totalSpent: 0,
        registeredDate: new Date().toISOString().split('T')[0]
      };
      setGuests([newGuest, ...guests]);
    } else {
      const existing = guests.find((g) => g.id === formData.guestId);
      if (!existing) {
        error('Guest Missing', 'Please select a registered guest.');
        return;
      }
      finalGuestId = existing.id;
      guestName = existing.name;
      guestEmail = existing.email;
      guestPhone = existing.phone;
    }

    const selectedRoom = rooms.find((r) => r.roomNumber === formData.roomNumber);
    const totalAmount = calculateTotal(formData.roomNumber, formData.checkInDate, formData.checkOutDate);

    if (editingBooking) {
      const updatedBookings = bookings.map((b) =>
        b.id === editingBooking.id
          ? {
              ...b,
              guestId: finalGuestId,
              guestName,
              guestEmail,
              guestPhone,
              roomNumber: formData.roomNumber,
              roomType: selectedRoom ? selectedRoom.type : 'Deluxe',
              checkInDate: formData.checkInDate,
              checkOutDate: formData.checkOutDate,
              guestsCount: Number(formData.guestsCount),
              totalAmount,
              status: formData.status,
              paymentStatus: formData.paymentStatus,
              specialRequests: formData.specialRequests
            }
          : b
      );
      setBookings(updatedBookings);
      success('Booking Updated', `Reservation ${editingBooking.id} has been modified.`);
    } else {
      const newBookingId = `BK-${Math.floor(8000 + Math.random() * 1999)}`;
      const newBooking: Booking = {
        id: newBookingId,
        guestId: finalGuestId,
        guestName,
        guestEmail,
        guestPhone,
        roomNumber: formData.roomNumber,
        roomType: selectedRoom ? selectedRoom.type : 'Deluxe',
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        guestsCount: Number(formData.guestsCount),
        totalAmount,
        status: formData.status,
        paymentStatus: formData.paymentStatus,
        specialRequests: formData.specialRequests,
        createdAt: new Date().toISOString().split('T')[0]
      };

      setBookings([newBooking, ...bookings]);

      // If marked as Checked-in immediately, update room status
      if (formData.status === 'Checked-in') {
        const updatedRooms = rooms.map((r) =>
          r.roomNumber === formData.roomNumber ? { ...r, status: 'Occupied' as const } : r
        );
        setRooms(updatedRooms);
      }

      // Record payment transaction if paid
      if (formData.paymentStatus === 'Paid') {
        const newPayment: Payment = {
          id: `PAY-${Math.floor(7000 + Math.random() * 2000)}`,
          bookingId: newBookingId,
          guestName,
          amount: totalAmount,
          paymentMethod: formData.paymentMethod || 'Credit Card',
          paymentDate: new Date().toISOString().split('T')[0],
          paymentStatus: 'Completed',
          invoiceNumber: `INV-${newBookingId}`
        };
        setPayments([newPayment, ...payments]);
      }

      // Confetti effect on creation
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      } catch {}

      success('Reservation Confirmed', `Booking ${newBookingId} for ${guestName} created!`);
      setConfirmationModalBooking(newBooking);
    }

    setIsAddEditOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (!deletingBooking) return;
    setBookings(bookings.filter((b) => b.id !== deletingBooking.id));
    success('Reservation Cancelled', `Booking ${deletingBooking.id} removed from system.`);
    setDeletingBooking(null);
  };

  const handleDirectCheckIn = (b: Booking) => {
    const updatedBookings = bookings.map((item) =>
      item.id === b.id ? { ...item, status: 'Checked-in' as const, keyCardNumber: `KC-${b.roomNumber}` } : item
    );
    setBookings(updatedBookings);

    // Update Room
    const updatedRooms = rooms.map((r) =>
      r.roomNumber === b.roomNumber ? { ...r, status: 'Occupied' as const } : r
    );
    setRooms(updatedRooms);

    success('Guest Checked-In', `${b.guestName} is now active in Room ${b.roomNumber}. KeyCard issued.`);
  };

  // Filter logic
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.guestEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.roomNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    const matchesPayment = paymentFilter === 'All' || b.paymentStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Reservations Directory</h3>
          <p className="text-xs text-slate-500 mt-0.5">Manage guest bookings, folios, check-in statuses and schedules</p>
        </div>
        <button
          id="bookings-add-booking-btn"
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Booking</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="bookings-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search booking ID, guest, room #..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Filter */}
          <select
            id="bookings-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="All">All Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Checked-in">Checked-in</option>
            <option value="Checked-out">Checked-out</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          {/* Payment Status Filter */}
          <select
            id="bookings-payment-filter"
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="All">All Payment States</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase text-[11px] font-semibold">
              <tr>
                <th className="px-6 py-3.5">Booking ID</th>
                <th className="px-6 py-3.5">Guest Info</th>
                <th className="px-6 py-3.5">Room</th>
                <th className="px-6 py-3.5">Stay Dates</th>
                <th className="px-6 py-3.5">Guests</th>
                <th className="px-6 py-3.5">Total Amount</th>
                <th className="px-6 py-3.5">Payment</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-slate-400">
                    No reservations match your filters.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900">{b.id}</td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{b.guestName}</p>
                      <p className="text-xs text-slate-400 truncate max-w-[150px]">{b.guestEmail}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-800">Room {b.roomNumber}</span>
                      <span className="text-xs text-slate-400 block">{b.roomType}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <div className="text-xs">
                        <p><span className="text-slate-400">In:</span> {b.checkInDate}</p>
                        <p><span className="text-slate-400">Out:</span> {b.checkOutDate}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{b.guestsCount} Pers.</td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-900">
                      {settings.currencySymbol}{b.totalAmount}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                          b.paymentStatus === 'Paid'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {b.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          b.status === 'Checked-in'
                            ? 'bg-amber-100 text-amber-800'
                            : b.status === 'Confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : b.status === 'Checked-out'
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {b.status === 'Confirmed' && (
                          <button
                            onClick={() => handleDirectCheckIn(b)}
                            title="Direct Check-In Guest"
                            className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-medium shadow-xs transition-colors"
                          >
                            Check-In
                          </button>
                        )}
                        {b.status === 'Checked-in' && (
                          <button
                            onClick={() => onCheckOutBooking(b)}
                            title="Check-Out & Settle Folio"
                            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium shadow-xs transition-colors"
                          >
                            Check-Out
                          </button>
                        )}
                        <button
                          onClick={() => onViewInvoice(b)}
                          title="View Folio / Invoice"
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(b)}
                          title="Edit Booking"
                          className="p-1.5 text-slate-400 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingBooking(b)}
                          title="Cancel/Delete Booking"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Booking Modal */}
      <Modal
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        title={editingBooking ? `Edit Reservation ${editingBooking.id}` : 'Create New Reservation'}
        subtitle="Select guest profile, available room, dates and payment method"
        maxWidth="2xl"
      >
        <form onSubmit={handleSaveBooking} className="space-y-4">
          {/* Guest Selection Mode */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Guest Information *
              </label>
              <div className="flex items-center gap-3 text-xs">
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="guestMode"
                    checked={formData.guestMode === 'existing'}
                    onChange={() => setFormData({ ...formData, guestMode: 'existing' })}
                    className="text-amber-600"
                  />
                  <span>Select Existing Guest</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="guestMode"
                    checked={formData.guestMode === 'new'}
                    onChange={() => setFormData({ ...formData, guestMode: 'new' })}
                    className="text-amber-600"
                  />
                  <span>New Guest</span>
                </label>
              </div>
            </div>

            {formData.guestMode === 'existing' ? (
              <select
                id="booking-form-guest-select"
                value={formData.guestId}
                onChange={(e) => setFormData({ ...formData, guestId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                {guests.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} — {g.email} ({g.phone})
                  </option>
                ))}
              </select>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <input
                  type="text"
                  required
                  placeholder="Full Name *"
                  value={formData.newGuestName}
                  onChange={(e) => setFormData({ ...formData, newGuestName: e.target.value })}
                  className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                />
                <input
                  type="email"
                  required
                  placeholder="Email Address *"
                  value={formData.newGuestEmail}
                  onChange={(e) => setFormData({ ...formData, newGuestEmail: e.target.value })}
                  className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={formData.newGuestPhone}
                  onChange={(e) => setFormData({ ...formData, newGuestPhone: e.target.value })}
                  className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>
            )}
          </div>

          {/* Room Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Select Room *
              </label>
              <select
                id="booking-form-room-select"
                value={formData.roomNumber}
                onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                {rooms.map((r) => (
                  <option key={r.id} value={r.roomNumber}>
                    Room {r.roomNumber} ({r.type} - {settings.currencySymbol}{r.pricePerNight}/night) - [{r.status}]
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Number of Guests
              </label>
              <input
                id="booking-form-guests-count"
                type="number"
                min="1"
                max="6"
                value={formData.guestsCount}
                onChange={(e) => setFormData({ ...formData, guestsCount: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Check-In Date *
              </label>
              <input
                id="booking-form-checkin-date"
                type="date"
                required
                value={formData.checkInDate}
                onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Check-Out Date *
              </label>
              <input
                id="booking-form-checkout-date"
                type="date"
                required
                value={formData.checkOutDate}
                onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Reservation Status
              </label>
              <select
                id="booking-form-status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as BookingStatus })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <option value="Confirmed">Confirmed</option>
                <option value="Checked-in">Checked-in (Immediate)</option>
                <option value="Pending">Pending Confirmation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Payment Status
              </label>
              <select
                id="booking-form-payment-status"
                value={formData.paymentStatus}
                onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value as PaymentStatus })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <option value="Paid">Paid in Full</option>
                <option value="Pending">Pay at Front Desk</option>
              </select>
            </div>
          </div>

          {/* Pricing Estimation Banner */}
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs sm:text-sm">
            <span className="text-amber-900 font-medium">Estimated Total (including taxes):</span>
            <span className="font-bold text-amber-900 text-base font-mono">
              {settings.currencySymbol}
              {calculateTotal(formData.roomNumber, formData.checkInDate, formData.checkOutDate)}
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Special Guest Requests / Preferences
            </label>
            <textarea
              id="booking-form-special-requests"
              rows={2}
              value={formData.specialRequests}
              onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
              placeholder="e.g. Airport shuttle pickup, high floor room, extra towels..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddEditOpen(false)}
              className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-sm transition-colors"
            >
              {editingBooking ? 'Save Reservation' : 'Confirm & Save Booking'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete / Cancel Booking Modal */}
      <ConfirmationModal
        isOpen={!!deletingBooking}
        onClose={() => setDeletingBooking(null)}
        onConfirm={handleDeleteConfirm}
        title="Cancel Reservation"
        message={`Are you sure you want to cancel and delete reservation ${deletingBooking?.id} for ${deletingBooking?.guestName}?`}
        confirmText="Cancel Reservation"
      />

      {/* Booking Confirmation Celebration Modal */}
      {confirmationModalBooking && (
        <Modal
          isOpen={!!confirmationModalBooking}
          onClose={() => setConfirmationModalBooking(null)}
          title="Reservation Confirmed"
          maxWidth="md"
        >
          <div className="text-center space-y-4 py-2">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900 font-serif-heading">Booking Successfully Logged!</h4>
              <p className="text-xs text-slate-500 font-mono mt-1">Confirmation #{confirmationModalBooking.id}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl text-left text-xs space-y-2 border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">Guest:</span>
                <span className="font-semibold text-slate-800">{confirmationModalBooking.guestName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Room Allocated:</span>
                <span className="font-semibold text-slate-800">Room {confirmationModalBooking.roomNumber} ({confirmationModalBooking.roomType})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Dates:</span>
                <span className="font-medium text-slate-800">{confirmationModalBooking.checkInDate} &rarr; {confirmationModalBooking.checkOutDate}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="text-slate-500">Total Billed:</span>
                <span className="font-bold text-amber-800 font-mono text-sm">{settings.currencySymbol}{confirmationModalBooking.totalAmount}</span>
              </div>
            </div>

            <div className="flex gap-2 justify-center pt-2">
              <button
                onClick={() => {
                  onViewInvoice(confirmationModalBooking);
                  setConfirmationModalBooking(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View Invoice Folio</span>
              </button>
              <button
                onClick={() => setConfirmationModalBooking(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

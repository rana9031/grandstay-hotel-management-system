import React, { useState } from 'react';
import {
  KeyRound,
  LogOut as CheckOutIcon,
  CheckCircle2,
  Calendar,
  BedDouble,
  UserCheck,
  CreditCard,
  FileText,
  AlertCircle,
  Sparkles,
  Search,
  ShieldCheck,
  DollarSign
} from 'lucide-react';
import { Room, Booking, Guest, HotelSettings, Payment } from '../types';
import { Modal } from '../components/Modal';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { useToast } from '../context/ToastContext';
import confetti from 'canvas-confetti';

interface CheckInOutViewProps {
  rooms: Room[];
  setRooms: (rooms: Room[]) => void;
  bookings: Booking[];
  setBookings: (bookings: Booking[]) => void;
  guests: Guest[];
  payments: Payment[];
  setPayments: (payments: Payment[]) => void;
  settings: HotelSettings;
  onViewInvoice: (booking: Booking) => void;
}

export const CheckInOutView: React.FC<CheckInOutViewProps> = ({
  rooms,
  setRooms,
  bookings,
  setBookings,
  guests,
  payments,
  setPayments,
  settings,
  onViewInvoice
}) => {
  const [activeTab, setActiveTab] = useState<'checkin' | 'checkout'>('checkin');
  const [searchStayQuery, setSearchStayQuery] = useState('');

  // Form State for Express Check-in
  const [selectedGuestId, setSelectedGuestId] = useState(guests[0]?.id || '');
  const [selectedRoomNumber, setSelectedRoomNumber] = useState(
    rooms.find((r) => r.status === 'Available')?.roomNumber || '101'
  );
  const [checkInDate, setCheckInDate] = useState('2026-09-02');
  const [checkOutDate, setCheckOutDate] = useState('2026-09-05');
  const [guestsCount, setGuestsCount] = useState(2);
  const [keyCardId, setKeyCardId] = useState(`KC-${Math.floor(100 + Math.random() * 900)}`);
  const [paymentMethod, setPaymentMethod] = useState<'Credit Card' | 'Cash' | 'Debit Card' | 'Online Banking'>('Credit Card');
  const [specialRequests, setSpecialRequests] = useState('');

  // Active Checkout state
  const [checkoutTargetBooking, setCheckoutTargetBooking] = useState<Booking | null>(null);
  const [isCheckinSuccessModalOpen, setIsCheckinSuccessModalOpen] = useState(false);
  const [latestCheckedInBooking, setLatestCheckedInBooking] = useState<Booking | null>(null);

  const { success, error, info } = useToast();

  const availableRooms = rooms.filter((r) => r.status === 'Available');
  const occupiedRooms = rooms.filter((r) => r.status === 'Occupied');
  const activeStays = bookings.filter((b) => b.status === 'Checked-in');

  const handlePerformCheckIn = (e: React.FormEvent) => {
    e.preventDefault();

    const targetGuest = guests.find((g) => g.id === selectedGuestId);
    const targetRoom = rooms.find((r) => r.roomNumber === selectedRoomNumber);

    if (!targetGuest) {
      error('Guest Missing', 'Please select a registered guest.');
      return;
    }
    if (!targetRoom) {
      error('Room Missing', 'Please select a valid room.');
      return;
    }
    if (targetRoom.status !== 'Available') {
      error('Room Not Available', `Room ${targetRoom.roomNumber} is currently ${targetRoom.status}.`);
      return;
    }

    // Calculate nights & amount
    const d1 = new Date(checkInDate);
    const d2 = new Date(checkOutDate);
    const nights = Math.max(1, Math.ceil(Math.abs(d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)));
    const totalAmount = targetRoom.pricePerNight * nights;

    const newBookingId = `BK-${Math.floor(8000 + Math.random() * 1999)}`;
    const newBooking: Booking = {
      id: newBookingId,
      guestId: targetGuest.id,
      guestName: targetGuest.name,
      guestEmail: targetGuest.email,
      guestPhone: targetGuest.phone,
      roomNumber: targetRoom.roomNumber,
      roomType: targetRoom.type,
      checkInDate,
      checkOutDate,
      guestsCount,
      totalAmount,
      status: 'Checked-in',
      paymentStatus: 'Paid',
      specialRequests,
      createdAt: new Date().toISOString().split('T')[0],
      keyCardNumber: keyCardId
    };

    // 1. Update Booking list
    setBookings([newBooking, ...bookings]);

    // 2. Automatically update room status to "Occupied"
    const updatedRooms = rooms.map((r) =>
      r.roomNumber === targetRoom.roomNumber ? { ...r, status: 'Occupied' as const } : r
    );
    setRooms(updatedRooms);

    // 3. Create settled payment receipt
    const newPayment: Payment = {
      id: `PAY-${Math.floor(7000 + Math.random() * 2000)}`,
      bookingId: newBookingId,
      guestName: targetGuest.name,
      amount: totalAmount,
      paymentMethod,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentStatus: 'Completed',
      invoiceNumber: `INV-${newBookingId}`,
      notes: `Settled on check-in via ${paymentMethod}`
    };
    setPayments([newPayment, ...payments]);

    // 4. Confetti & notification
    try {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    } catch {}

    setLatestCheckedInBooking(newBooking);
    setIsCheckinSuccessModalOpen(true);
    success('Check-In Complete', `${targetGuest.name} assigned to Room ${targetRoom.roomNumber}. Keycard issued.`);

    // Reset next keycard
    setKeyCardId(`KC-${Math.floor(100 + Math.random() * 900)}`);
  };

  const handlePerformCheckOut = (booking: Booking) => {
    // 1. Update booking status to Checked-out
    const updatedBookings = bookings.map((b) =>
      b.id === booking.id ? { ...b, status: 'Checked-out' as const } : b
    );
    setBookings(updatedBookings);

    // 2. Automatically update room status back to "Available"
    const updatedRooms = rooms.map((r) =>
      r.roomNumber === booking.roomNumber ? { ...r, status: 'Available' as const } : r
    );
    setRooms(updatedRooms);

    success('Check-Out Settled', `Room ${booking.roomNumber} has been released and is now Available.`);
    setCheckoutTargetBooking(null);
  };

  const filteredStays = activeStays.filter((s) => {
    return (
      s.guestName.toLowerCase().includes(searchStayQuery.toLowerCase()) ||
      s.roomNumber.toLowerCase().includes(searchStayQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchStayQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Front Desk Express Desk</h3>
          <p className="text-xs text-slate-500 mt-0.5">Real-time arrival processing, digital key allocation and departure settlement</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-xl self-start sm:self-auto">
          <button
            id="checkin-tab-btn"
            onClick={() => setActiveTab('checkin')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'checkin'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Express Check-In</span>
          </button>
          <button
            id="checkout-tab-btn"
            onClick={() => setActiveTab('checkout')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'checkout'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckOutIcon className="w-4 h-4" />
            <span>Active Stays & Check-Out ({activeStays.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'checkin' ? (
        /* Check-In Desk Form & Available Rooms Showcase */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Check-In Form */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-6">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">Guest Arrival Processing</h4>
                <p className="text-xs text-slate-500">Assign vacant room, issue key card, and settle charges</p>
              </div>
            </div>

            <form onSubmit={handlePerformCheckIn} className="space-y-5">
              {/* Guest Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Arriving Guest *
                </label>
                <select
                  id="checkin-guest-select"
                  value={selectedGuestId}
                  onChange={(e) => setSelectedGuestId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  {guests.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} &bull; {g.email} &bull; ID: {g.idProofNumber}
                    </option>
                  ))}
                </select>
              </div>

              {/* Room Selection from Available List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Assign Available Room *
                  </label>
                  <select
                    id="checkin-room-select"
                    value={selectedRoomNumber}
                    onChange={(e) => setSelectedRoomNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    {availableRooms.length === 0 ? (
                      <option disabled>No Available Rooms</option>
                    ) : (
                      availableRooms.map((r) => (
                        <option key={r.id} value={r.roomNumber}>
                          Room {r.roomNumber} ({r.type} &bull; {settings.currencySymbol}{r.pricePerNight}/night)
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Key Card RFID Tag ID
                  </label>
                  <input
                    id="checkin-keycard-input"
                    type="text"
                    value={keyCardId}
                    onChange={(e) => setKeyCardId(e.target.value)}
                    placeholder="KC-401A"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Check-In Date *
                  </label>
                  <input
                    id="checkin-date-input"
                    type="date"
                    required
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Expected Departure Date *
                  </label>
                  <input
                    id="checkin-checkout-date-input"
                    type="date"
                    required
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Payment Method
                  </label>
                  <select
                    id="checkin-payment-method"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="Credit Card">Credit Card (POS Terminal)</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="Cash">Cash at Front Desk</option>
                    <option value="Online Banking">Online Banking / Wire</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Party Size (Guests)
                  </label>
                  <input
                    id="checkin-guests-count"
                    type="number"
                    min="1"
                    max="6"
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Front Desk Notes & Luggage Assistance
                </label>
                <textarea
                  id="checkin-notes-input"
                  rows={2}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. 2 bags stored in concierge, requested extra key card..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-emerald-700 font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Room will automatically switch to Occupied state</span>
                </div>
                <button
                  type="submit"
                  id="checkin-submit-btn"
                  disabled={availableRooms.length === 0}
                  className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-semibold shadow-md transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Complete Check-In & Issue Key</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Col: Available Rooms Overview */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-slate-900">Vacant Rooms ({availableRooms.length})</h4>
              <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-800 font-semibold rounded-full">
                Ready for Occupancy
              </span>
            </div>

            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {availableRooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => setSelectedRoomNumber(room.roomNumber)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedRoomNumber === room.roomNumber
                      ? 'border-amber-500 bg-amber-50/70 ring-1 ring-amber-500'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={room.image}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-mono font-bold text-slate-900 text-sm">Room {room.roomNumber}</p>
                      <p className="text-[11px] text-slate-500">{room.type} &bull; Floor {room.floor}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-amber-800 text-xs">
                      {settings.currencySymbol}{room.pricePerNight}
                    </p>
                    <span className="text-[10px] text-slate-400">/ night</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Active Stays & Check-Out Management */
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="relative w-full max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="checkout-search-input"
                type="text"
                value={searchStayQuery}
                onChange={(e) => setSearchStayQuery(e.target.value)}
                placeholder="Search active guest name, room number, booking ID..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
            </div>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              Currently {activeStays.length} active room stays
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase text-[11px] font-semibold">
                  <tr>
                    <th className="px-6 py-3.5">Room & Key</th>
                    <th className="px-6 py-3.5">Guest Information</th>
                    <th className="px-6 py-3.5">Check-In Date</th>
                    <th className="px-6 py-3.5">Expected Departure</th>
                    <th className="px-6 py-3.5">Folio Total</th>
                    <th className="px-6 py-3.5 text-right">Express Check-Out</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStays.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                        No active checked-in stays match your search.
                      </td>
                    </tr>
                  ) : (
                    filteredStays.map((stay) => (
                      <tr key={stay.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 font-bold flex items-center justify-center font-mono">
                              {stay.roomNumber}
                            </span>
                            <div>
                              <p className="font-semibold text-slate-900">{stay.roomType}</p>
                              <p className="text-xs text-slate-400 font-mono">Card: {stay.keyCardNumber || 'Standard Key'}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-900">{stay.guestName}</p>
                          <p className="text-xs text-slate-400">{stay.guestEmail}</p>
                        </td>

                        <td className="px-6 py-4 text-slate-600 font-medium">
                          {stay.checkInDate}
                        </td>

                        <td className="px-6 py-4 text-slate-600 font-medium">
                          {stay.checkOutDate}
                        </td>

                        <td className="px-6 py-4 font-mono font-bold text-slate-900">
                          {settings.currencySymbol}{stay.totalAmount}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => onViewInvoice(stay)}
                              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Folio</span>
                            </button>
                            <button
                              onClick={() => setCheckoutTargetBooking(stay)}
                              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                            >
                              <CheckOutIcon className="w-3.5 h-3.5 text-amber-400" />
                              <span>Check-Out</span>
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
        </div>
      )}

      {/* Checkout Confirmation Dialog */}
      {checkoutTargetBooking && (
        <ConfirmationModal
          isOpen={!!checkoutTargetBooking}
          onClose={() => setCheckoutTargetBooking(null)}
          onConfirm={() => handlePerformCheckOut(checkoutTargetBooking)}
          title={`Check-Out Guest: ${checkoutTargetBooking.guestName}`}
          message={`Confirm departure for ${checkoutTargetBooking.guestName} from Room ${checkoutTargetBooking.roomNumber}. Keycard will be deactivated, folio settled, and room automatically marked Available.`}
          confirmText="Confirm Check-Out"
          type="primary"
        />
      )}

      {/* Check-in Success Modal */}
      {isCheckinSuccessModalOpen && latestCheckedInBooking && (
        <Modal
          isOpen={isCheckinSuccessModalOpen}
          onClose={() => setIsCheckinSuccessModalOpen(false)}
          title="Check-In Completed"
          maxWidth="md"
        >
          <div className="text-center space-y-4 py-2">
            <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <KeyRound className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900 font-serif-heading">Key Card Issued & Stay Active</h4>
              <p className="text-xs text-slate-500 font-mono mt-1">Keycard #{latestCheckedInBooking.keyCardNumber}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl text-left text-xs space-y-2 border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">Guest:</span>
                <span className="font-semibold text-slate-800">{latestCheckedInBooking.guestName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Allocated Room:</span>
                <span className="font-semibold text-slate-800">Room {latestCheckedInBooking.roomNumber} ({latestCheckedInBooking.roomType})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Stay Duration:</span>
                <span className="font-medium text-slate-800">{latestCheckedInBooking.checkInDate} &rarr; {latestCheckedInBooking.checkOutDate}</span>
              </div>
            </div>

            <div className="flex gap-2 justify-center pt-2">
              <button
                onClick={() => {
                  onViewInvoice(latestCheckedInBooking);
                  setIsCheckinSuccessModalOpen(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View Folio / Receipt</span>
              </button>
              <button
                onClick={() => setIsCheckinSuccessModalOpen(false)}
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

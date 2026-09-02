import React from 'react';
import { Printer, Download, CheckCircle, Building2, Calendar, User, CreditCard } from 'lucide-react';
import { Modal } from './Modal';
import { Payment, Booking, Room, HotelSettings } from '../types';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment?: Payment | null;
  booking?: Booking | null;
  room?: Room | null;
  settings: HotelSettings;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  payment,
  booking,
  room,
  settings
}) => {
  if (!isOpen) return null;

  const invoiceNumber = payment?.invoiceNumber || (booking ? `INV-${booking.id}` : 'INV-2026-0001');
  const invoiceDate = payment?.paymentDate || booking?.createdAt || new Date().toISOString().split('T')[0];
  const guestName = payment?.guestName || booking?.guestName || 'Valued Guest';
  const roomNumber = booking?.roomNumber || room?.roomNumber || 'Standard Room';
  const roomType = booking?.roomType || room?.type || 'Deluxe';
  const checkIn = booking?.checkInDate || '2026-09-02';
  const checkOut = booking?.checkOutDate || '2026-09-05';
  
  // Calculate nights
  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const basePricePerNight = room?.pricePerNight || (booking ? Math.round(booking.totalAmount / (nights * (1 + settings.taxRate / 100))) : 150);
  const subtotal = basePricePerNight * nights;
  const taxAmount = Math.round((subtotal * settings.taxRate) / 100);
  const totalAmount = payment?.amount || booking?.totalAmount || (subtotal + taxAmount);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invoice & Payment Receipt" maxWidth="3xl">
      <div className="space-y-6">
        {/* Actions bar (not printed) */}
        <div className="flex items-center justify-between bg-amber-50/80 border border-amber-200/70 p-3.5 rounded-xl no-print">
          <div className="flex items-center gap-2 text-amber-900 text-xs sm:text-sm font-medium">
            <CheckCircle className="w-4 h-4 text-amber-700" />
            <span>Official Guest Folio & Tax Invoice Receipt</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="invoice-print-btn"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
          </div>
        </div>

        {/* Printable Invoice Folio */}
        <div className="printable-area bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm font-sans">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-200 gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-700 flex items-center justify-center text-white font-bold text-xl shadow-md">
                  G
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight font-serif-heading">
                    {settings.name}
                  </h2>
                  <p className="text-xs text-amber-800 font-medium tracking-wide">
                    {settings.tagline}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2 max-w-xs leading-relaxed">
                {settings.address}
              </p>
              <p className="text-xs text-slate-500">
                Tel: {settings.phone} | {settings.email}
              </p>
            </div>

            <div className="sm:text-right">
              <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 font-semibold text-xs rounded-full uppercase tracking-wider mb-2">
                PAID & CONFIRMED
              </span>
              <p className="text-xs text-slate-400 font-mono">Invoice Number</p>
              <p className="text-lg font-bold text-slate-900 font-mono">{invoiceNumber}</p>
              <p className="text-xs text-slate-500 mt-1">Date: {invoiceDate}</p>
            </div>
          </div>

          {/* Guest & Stay Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-slate-100 text-sm">
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Billed To Guest
              </h4>
              <p className="font-semibold text-slate-900 text-base">{guestName}</p>
              {booking?.guestEmail && <p className="text-xs text-slate-600 mt-0.5">{booking.guestEmail}</p>}
              {booking?.guestPhone && <p className="text-xs text-slate-600">{booking.guestPhone}</p>}
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" /> Reservation Summary
              </h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Room:</span>
                  <span className="font-medium text-slate-800">Room {roomNumber} ({roomType})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Check-In:</span>
                  <span className="font-medium text-slate-800">{checkIn} (from {settings.checkInTime})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Check-Out:</span>
                  <span className="font-medium text-slate-800">{checkOut} (until {settings.checkOutTime})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Duration:</span>
                  <span className="font-medium text-slate-800">{nights} Night{nights > 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="mt-6">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase text-[11px] tracking-wider">
                  <th className="pb-3 font-semibold">Description</th>
                  <th className="pb-3 text-center font-semibold">Nights / Qty</th>
                  <th className="pb-3 text-right font-semibold">Rate / Night</th>
                  <th className="pb-3 text-right font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3">
                    <p className="font-medium text-slate-900">Accommodation: {roomType} Suite (Room {roomNumber})</p>
                    <p className="text-xs text-slate-500">Complimentary Wi-Fi, Breakfast & Spa Amenities</p>
                  </td>
                  <td className="py-3 text-center text-slate-600">{nights}</td>
                  <td className="py-3 text-right text-slate-600">{settings.currencySymbol}{basePricePerNight.toFixed(2)}</td>
                  <td className="py-3 text-right font-medium text-slate-900">{settings.currencySymbol}{subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="py-3">
                    <p className="font-medium text-slate-900">Hotel Hospitality & City Tax ({settings.taxRate}%)</p>
                    <p className="text-xs text-slate-500">Municipal lodging and service assessment</p>
                  </td>
                  <td className="py-3 text-center text-slate-600">1</td>
                  <td className="py-3 text-right text-slate-600">{settings.currencySymbol}{taxAmount.toFixed(2)}</td>
                  <td className="py-3 text-right font-medium text-slate-900">{settings.currencySymbol}{taxAmount.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals & Payment Info */}
          <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
            <div className="text-xs text-slate-500 space-y-1">
              <p className="font-semibold text-slate-700 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5" /> Payment Method: {payment?.paymentMethod || 'Credit Card (Settled)'}
              </p>
              <p>Status: <span className="text-emerald-600 font-semibold">Fully Paid</span></p>
              <p className="text-[11px] text-slate-400 mt-2">
                Thank you for choosing GrandStay Hotel. We hope you enjoyed your stay!
              </p>
            </div>

            <div className="w-full sm:w-64 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span>{settings.currencySymbol}{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax ({settings.taxRate}%):</span>
                <span>{settings.currencySymbol}{taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Paid:</span>
                <span className="text-amber-800 font-mono">{settings.currencySymbol}{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer buttons */}
        <div className="flex justify-end gap-3 no-print">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Close Receipt
          </button>
        </div>
      </div>
    </Modal>
  );
};

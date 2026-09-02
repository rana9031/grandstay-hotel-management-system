import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  Search,
  DollarSign,
  CreditCard,
  Printer,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Download,
  Filter
} from 'lucide-react';
import { Payment, PaymentMethod, PaymentTransactionStatus, HotelSettings, Booking } from '../types';
import { Modal } from '../components/Modal';
import { useToast } from '../context/ToastContext';

interface PaymentsViewProps {
  payments: Payment[];
  setPayments: (payments: Payment[]) => void;
  bookings: Booking[];
  settings: HotelSettings;
  onViewInvoice: (bookingOrPayment: any) => void;
}

export const PaymentsView: React.FC<PaymentsViewProps> = ({
  payments,
  setPayments,
  bookings,
  settings,
  onViewInvoice
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [formData, setFormData] = useState({
    bookingId: bookings[0]?.id || '',
    guestName: bookings[0]?.guestName || '',
    amount: 500,
    paymentMethod: 'Credit Card' as PaymentMethod,
    paymentStatus: 'Completed' as PaymentTransactionStatus,
    paymentDate: new Date().toISOString().split('T')[0],
    notes: 'Front desk settlement'
  });

  const { success, error } = useToast();

  const totalSettled = payments
    .filter((p) => p.paymentStatus === 'Completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = payments
    .filter((p) => p.paymentStatus === 'Pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalTransactions = payments.length;

  const handleOpenAdd = () => {
    const firstBooking = bookings[0];
    setFormData({
      bookingId: firstBooking ? firstBooking.id : 'BK-GENERAL',
      guestName: firstBooking ? firstBooking.guestName : 'Direct Guest',
      amount: 450,
      paymentMethod: 'Credit Card',
      paymentStatus: 'Completed',
      paymentDate: new Date().toISOString().split('T')[0],
      notes: 'Direct front desk payment transaction'
    });
    setIsAddPaymentOpen(true);
  };

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.guestName || formData.amount <= 0) {
      error('Validation Error', 'Guest name and valid payment amount are required.');
      return;
    }

    const newPaymentId = `PAY-${Math.floor(7000 + Math.random() * 2000)}`;
    const newPayment: Payment = {
      id: newPaymentId,
      bookingId: formData.bookingId,
      guestName: formData.guestName,
      amount: Number(formData.amount),
      paymentMethod: formData.paymentMethod,
      paymentDate: formData.paymentDate,
      paymentStatus: formData.paymentStatus,
      invoiceNumber: `INV-${newPaymentId}`,
      notes: formData.notes
    };

    setPayments([newPayment, ...payments]);
    success('Payment Recorded', `Payment of ${settings.currencySymbol}${newPayment.amount} recorded for ${newPayment.guestName}.`);
    setIsAddPaymentOpen(false);
  };

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMethod = methodFilter === 'All' || p.paymentMethod === methodFilter;
    const matchesStatus = statusFilter === 'All' || p.paymentStatus === statusFilter;

    return matchesSearch && matchesMethod && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Revenue Settled</span>
            <p className="text-2xl font-bold text-slate-900 font-mono mt-0.5">
              {settings.currencySymbol}{totalSettled.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Transactions</span>
            <p className="text-2xl font-bold text-slate-900 font-mono mt-0.5">
              {totalTransactions} Records
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average Transaction</span>
            <p className="text-2xl font-bold text-slate-900 font-mono mt-0.5">
              {settings.currencySymbol}
              {totalTransactions > 0 ? Math.round(totalSettled / totalTransactions) : 0}
            </p>
          </div>
        </div>
      </div>

      {/* Header & New Payment */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Payments & Transactions Ledger</h3>
          <p className="text-xs text-slate-500 mt-0.5">Audit transaction history, billing folios and download official invoices</p>
        </div>
        <button
          id="payments-record-payment-btn"
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Record New Payment</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="payments-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search payment ID, invoice #, guest..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            id="payments-method-filter"
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="All">All Payment Methods</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Cash">Cash</option>
            <option value="Online Banking">Online Banking</option>
            <option value="UPI">UPI Mobile</option>
          </select>

          <select
            id="payments-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="All">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Payment Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase text-[11px] font-semibold">
              <tr>
                <th className="px-6 py-3.5">Payment ID</th>
                <th className="px-6 py-3.5">Booking / Folio</th>
                <th className="px-6 py-3.5">Guest Name</th>
                <th className="px-6 py-3.5">Amount Paid</th>
                <th className="px-6 py-3.5">Payment Method</th>
                <th className="px-6 py-3.5">Payment Date</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Invoice & Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                    No payment records match your filters.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900">{p.id}</td>

                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-semibold text-slate-700">{p.bookingId}</span>
                      <span className="text-[11px] text-slate-400 block font-mono">{p.invoiceNumber}</span>
                    </td>

                    <td className="px-6 py-4 font-semibold text-slate-900">{p.guestName}</td>

                    <td className="px-6 py-4 font-mono font-bold text-slate-900">
                      {settings.currencySymbol}{p.amount.toFixed(2)}
                    </td>

                    <td className="px-6 py-4 text-slate-700">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-medium">
                        <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                        <span>{p.paymentMethod}</span>
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {p.paymentDate}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          p.paymentStatus === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : p.paymentStatus === 'Pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {p.paymentStatus}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => onViewInvoice(p)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-xs font-semibold transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Folio</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record New Payment Modal */}
      <Modal
        isOpen={isAddPaymentOpen}
        onClose={() => setIsAddPaymentOpen(false)}
        title="Record Payment Transaction"
        subtitle="Post a settled charge against a reservation folio"
        maxWidth="md"
      >
        <form onSubmit={handleSavePayment} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Associate Reservation
            </label>
            <select
              id="payment-form-booking-select"
              value={formData.bookingId}
              onChange={(e) => {
                const b = bookings.find((item) => item.id === e.target.value);
                setFormData({
                  ...formData,
                  bookingId: e.target.value,
                  guestName: b ? b.guestName : formData.guestName,
                  amount: b ? b.totalAmount : formData.amount
                });
              }}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              {bookings.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.id} &bull; {b.guestName} (Room {b.roomNumber}) - {settings.currencySymbol}{b.totalAmount}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Guest Name *
            </label>
            <input
              id="payment-form-guest-name"
              type="text"
              required
              value={formData.guestName}
              onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Payment Amount ({settings.currencySymbol}) *
            </label>
            <input
              id="payment-form-amount"
              type="number"
              required
              min="1"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Payment Method
            </label>
            <select
              id="payment-form-method"
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Cash">Cash</option>
              <option value="Online Banking">Online Banking</option>
              <option value="UPI">UPI Mobile</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Transaction Date
            </label>
            <input
              id="payment-form-date"
              type="date"
              value={formData.paymentDate}
              onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddPaymentOpen(false)}
              className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-sm transition-colors"
            >
              Post Payment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

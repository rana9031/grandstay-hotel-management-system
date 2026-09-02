import React, { useState } from 'react';
import {
  BedDouble,
  CalendarCheck,
  KeyRound,
  DollarSign,
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Plus,
  Eye,
  LogOut as CheckOutIcon,
  ChevronRight,
  ShieldCheck,
  Flame
} from 'lucide-react';
import { Room, Booking, Payment, HotelSettings, ActivePage } from '../types';

interface DashboardViewProps {
  rooms: Room[];
  bookings: Booking[];
  payments: Payment[];
  settings: HotelSettings;
  setActivePage: (page: ActivePage) => void;
  onOpenQuickBooking: () => void;
  onOpenQuickCheckin: () => void;
  onViewInvoice: (booking: Booking) => void;
  onCheckOutBooking: (booking: Booking) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  rooms,
  bookings,
  payments,
  settings,
  setActivePage,
  onOpenQuickBooking,
  onOpenQuickCheckin,
  onViewInvoice,
  onCheckOutBooking
}) => {
  const [chartView, setChartView] = useState<'weekly' | 'monthly'>('weekly');
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  // Dynamic KPI calculations
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter((r) => r.status === 'Available').length;
  const occupiedRooms = rooms.filter((r) => r.status === 'Occupied').length;
  const maintenanceRooms = rooms.filter((r) => r.status === 'Maintenance').length;
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  const totalBookings = bookings.length;
  const todayStr = '2026-09-02'; // simulated today date

  const todayCheckins = bookings.filter((b) => b.checkInDate === todayStr && b.status !== 'Cancelled');
  const todayCheckouts = bookings.filter((b) => b.checkOutDate === todayStr && b.status !== 'Cancelled');

  const totalRevenue = payments.reduce((acc, p) => acc + (p.paymentStatus === 'Completed' ? p.amount : 0), 0);
  const recentBookings = [...bookings].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 6);

  // Dynamic Chart Data based on occupancy simulation
  const weeklyData = [
    { label: 'Mon', rate: 68, revenue: 1840, bookings: 4 },
    { label: 'Tue', rate: 75, revenue: 2190, bookings: 6 },
    { label: 'Wed (Today)', rate: occupancyRate, revenue: 2850, bookings: todayCheckins.length + 3 },
    { label: 'Thu', rate: 84, revenue: 3100, bookings: 7 },
    { label: 'Fri', rate: 92, revenue: 4450, bookings: 10 },
    { label: 'Sat', rate: 96, revenue: 5200, bookings: 12 },
    { label: 'Sun', rate: 80, revenue: 3600, bookings: 8 },
  ];

  const monthlyData = [
    { label: 'W1', rate: 72, revenue: 14200, bookings: 32 },
    { label: 'W2', rate: 78, revenue: 16800, bookings: 38 },
    { label: 'W3', rate: 85, revenue: 19400, bookings: 44 },
    { label: 'W4 (Current)', rate: 88, revenue: 22100, bookings: 49 },
  ];

  const chartData = chartView === 'weekly' ? weeklyData : monthlyData;

  return (
    <div className="space-y-6">
      {/* Welcome Banner with Fast Actions */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 p-6 sm:p-8 text-white shadow-lg border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real-Time Front Desk Dashboard</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight font-serif-heading">
              Welcome to {settings.name}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Hotel operations running smoothly. Currently holding an <strong className="text-amber-300 font-semibold">{occupancyRate}%</strong> occupancy rate with <strong className="text-white">{todayCheckins.length}</strong> scheduled check-ins today.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <button
              id="dashboard-new-booking-btn"
              onClick={onOpenQuickBooking}
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Booking</span>
            </button>
            <button
              id="dashboard-quick-checkin-btn"
              onClick={onOpenQuickCheckin}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span>Express Check-In</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid - 7 Core Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Rooms */}
        <div
          onClick={() => setActivePage('rooms')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Rooms</span>
            <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-amber-50 group-hover:text-amber-700 text-slate-700 flex items-center justify-center transition-colors">
              <BedDouble className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="text-2xl font-bold text-slate-900 font-mono">{totalRooms}</p>
            <span className="text-xs text-slate-500 font-medium">Inventory</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Available: <strong className="text-emerald-600">{availableRooms}</strong></span>
            <span>Occupied: <strong className="text-amber-600">{occupiedRooms}</strong></span>
          </div>
        </div>

        {/* Available Rooms */}
        <div
          onClick={() => setActivePage('rooms')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Available Rooms</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="text-2xl font-bold text-emerald-600 font-mono">{availableRooms}</p>
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              Ready for Stay
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Occupancy rate</span>
            <span className="font-semibold text-slate-700">{occupancyRate}%</span>
          </div>
        </div>

        {/* Occupied Rooms */}
        <div
          onClick={() => setActivePage('checkin-checkout')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Occupied Rooms</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="text-2xl font-bold text-amber-600 font-mono">{occupiedRooms}</p>
            <span className="text-xs text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded-full">
              Active Guests
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Maintenance: <strong className="text-rose-500">{maintenanceRooms}</strong></span>
            <span className="text-amber-700 font-medium flex items-center gap-1">
              Live Stays <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Total Bookings */}
        <div
          onClick={() => setActivePage('bookings')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Bookings</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="text-2xl font-bold text-slate-900 font-mono">{totalBookings}</p>
            <span className="text-xs text-indigo-700 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +14% m/m
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>View All Reservations</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Second Row KPI Metrics: Check-ins, Check-outs, Revenue Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Today's Check-ins */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
            <KeyRound className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Today's Check-ins</span>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-2xl font-bold text-slate-900 font-mono">{todayCheckins.length}</p>
              <span className="text-xs text-sky-600 font-medium">Expected Arrivals</span>
            </div>
          </div>
        </div>

        {/* Today's Check-outs */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
            <CheckOutIcon className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Today's Check-outs</span>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-2xl font-bold text-slate-900 font-mono">{todayCheckouts.length}</p>
              <span className="text-xs text-purple-600 font-medium">Departures</span>
            </div>
          </div>
        </div>

        {/* Total Revenue Summary */}
        <div
          onClick={() => setActivePage('payments')}
          className="bg-gradient-to-br from-amber-600 to-amber-700 text-white p-5 rounded-2xl shadow-sm cursor-pointer hover:shadow-md transition-all flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-white/15 text-white flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs font-semibold text-amber-100 uppercase tracking-wider">Settled Revenue</span>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-2xl font-bold text-white font-mono">
                {settings.currencySymbol}{totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Charts & Room Status Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: JavaScript Interactive Occupancy Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Room Occupancy & Revenue Trends</h3>
              <p className="text-xs text-slate-500 mt-0.5">Dynamic JavaScript occupancy rate visualization</p>
            </div>
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setChartView('weekly')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  chartView === 'weekly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                7-Day Week
              </button>
              <button
                onClick={() => setChartView('monthly')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  chartView === 'monthly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Monthly Weeks
              </button>
            </div>
          </div>

          {/* SVG Canvas Bar Chart */}
          <div className="relative pt-6">
            <div className="h-64 flex items-end justify-between gap-3 sm:gap-6 border-b border-slate-100 pb-2">
              {chartData.map((item, idx) => {
                const heightPercent = Math.max(15, Math.min(100, item.rate));
                const isHovered = hoveredBar === idx;
                return (
                  <div
                    key={item.label}
                    onMouseEnter={() => setHoveredBar(idx)}
                    onMouseLeave={() => setHoveredBar(null)}
                    className="flex-1 flex flex-col items-center gap-2 group cursor-pointer relative h-full justify-end"
                  >
                    {/* Tooltip */}
                    {isHovered && (
                      <div className="absolute -top-12 z-20 bg-slate-900 text-white text-[11px] py-1.5 px-3 rounded-lg shadow-xl whitespace-nowrap animate-in fade-in zoom-in duration-150 flex flex-col items-center">
                        <span className="font-bold">{item.rate}% Occupancy</span>
                        <span className="text-amber-400 font-mono">{settings.currencySymbol}{item.revenue.toLocaleString()}</span>
                        <div className="w-2 h-2 bg-slate-900 rotate-45 absolute -bottom-1" />
                      </div>
                    )}

                    {/* Bar visual */}
                    <div className="w-full max-w-[48px] bg-slate-100 rounded-t-xl overflow-hidden h-full flex items-end">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-xl transition-all duration-500 ${
                          item.label.includes('Today') || item.label.includes('Current')
                            ? 'bg-gradient-to-t from-amber-600 to-amber-500 shadow-md shadow-amber-900/20'
                            : 'bg-gradient-to-t from-slate-800 to-slate-600 group-hover:from-amber-700 group-hover:to-amber-600'
                        }`}
                      />
                    </div>

                    <span className="text-[11px] font-medium text-slate-600 group-hover:text-slate-900 truncate">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-3">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-600" /> Current / Today
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-800" /> Historical Trend
                </span>
              </div>
              <span className="text-slate-400">Target Benchmark: 80%</span>
            </div>
          </div>
        </div>

        {/* Right Col: Room Inventory Distribution Donut / Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Room Status Distribution</h3>
            <p className="text-xs text-slate-500 mt-0.5">Live inventory split across {totalRooms} rooms</p>
          </div>

          {/* Visual Percentage Bar */}
          <div className="space-y-4">
            <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
              <div
                style={{ width: `${(availableRooms / totalRooms) * 100}%` }}
                className="bg-emerald-500 transition-all duration-500"
                title={`Available: ${availableRooms}`}
              />
              <div
                style={{ width: `${(occupiedRooms / totalRooms) * 100}%` }}
                className="bg-amber-500 transition-all duration-500"
                title={`Occupied: ${occupiedRooms}`}
              />
              <div
                style={{ width: `${(maintenanceRooms / totalRooms) * 100}%` }}
                className="bg-rose-400 transition-all duration-500"
                title={`Maintenance: ${maintenanceRooms}`}
              />
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs font-semibold text-slate-700">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-900">{availableRooms}</span>
                  <span className="text-[11px] text-slate-400">({Math.round((availableRooms / totalRooms) * 100)}%)</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-xs font-semibold text-slate-700">Occupied</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-900">{occupiedRooms}</span>
                  <span className="text-[11px] text-slate-400">({Math.round((occupiedRooms / totalRooms) * 100)}%)</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <span className="text-xs font-semibold text-slate-700">Maintenance</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-900">{maintenanceRooms}</span>
                  <span className="text-[11px] text-slate-400">({Math.round((maintenanceRooms / totalRooms) * 100)}%)</span>
                </div>
              </div>
            </div>
          </div>

          <button
            id="dashboard-manage-rooms-btn"
            onClick={() => setActivePage('rooms')}
            className="w-full py-2.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors text-center"
          >
            Manage All {totalRooms} Rooms &rarr;
          </button>
        </div>
      </div>

      {/* Recent Bookings & Express Desk Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Reservations</h3>
            <p className="text-xs text-slate-500 mt-0.5">Live booking records and instant check-in dispatcher</p>
          </div>
          <button
            onClick={() => setActivePage('bookings')}
            className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
          >
            <span>View All ({bookings.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase text-[11px] font-semibold">
              <tr>
                <th className="px-6 py-3.5">Booking ID</th>
                <th className="px-6 py-3.5">Guest Name</th>
                <th className="px-6 py-3.5">Room</th>
                <th className="px-6 py-3.5">Stay Dates</th>
                <th className="px-6 py-3.5">Amount</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-6 py-4 font-mono font-semibold text-slate-900">{b.id}</td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900">{b.guestName}</p>
                    <p className="text-xs text-slate-400">{b.guestPhone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-800">Room {b.roomNumber}</span>
                    <span className="text-xs text-slate-400 block">{b.roomType}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <div className="text-xs space-y-0.5">
                      <p>In: {b.checkInDate}</p>
                      <p>Out: {b.checkOutDate}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono font-semibold text-slate-900">
                    {settings.currencySymbol}{b.totalAmount}
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
                      {b.status === 'Checked-in' ? (
                        <button
                          onClick={() => onCheckOutBooking(b)}
                          className="px-2.5 py-1.5 text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg transition-colors"
                        >
                          Check-Out
                        </button>
                      ) : b.status === 'Confirmed' ? (
                        <button
                          onClick={() => setActivePage('checkin-checkout')}
                          className="px-2.5 py-1.5 text-xs font-semibold bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg transition-colors"
                        >
                          Check-In
                        </button>
                      ) : null}
                      <button
                        onClick={() => onViewInvoice(b)}
                        title="View Folio / Receipt"
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

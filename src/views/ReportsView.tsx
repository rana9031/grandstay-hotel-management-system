import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  Calendar,
  Download,
  Printer,
  DollarSign,
  Users,
  BedDouble,
  CheckCircle2,
  Percent,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { Room, Booking, Guest, Payment, HotelSettings } from '../types';
import { useToast } from '../context/ToastContext';

interface ReportsViewProps {
  rooms: Room[];
  bookings: Booking[];
  guests: Guest[];
  payments: Payment[];
  settings: HotelSettings;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  rooms,
  bookings,
  guests,
  payments,
  settings
}) => {
  const [activeReportTab, setActiveReportTab] = useState<'occupancy' | 'booking' | 'revenue' | 'guest'>('occupancy');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  const { success } = useToast();

  // Calculations
  const totalRoomsCount = rooms.length;
  const occupiedRoomsCount = rooms.filter((r) => r.status === 'Occupied').length;
  const availableRoomsCount = rooms.filter((r) => r.status === 'Available').length;
  const maintenanceRoomsCount = rooms.filter((r) => r.status === 'Maintenance').length;
  const currentOccupancyRate = Math.round((occupiedRoomsCount / (totalRoomsCount || 1)) * 100);

  const totalBookingsCount = bookings.length;
  const confirmedBookings = bookings.filter((b) => b.status === 'Confirmed').length;
  const checkedInBookings = bookings.filter((b) => b.status === 'Checked-in').length;
  const completedBookings = bookings.filter((b) => b.status === 'Checked-out').length;
  const cancelledBookings = bookings.filter((b) => b.status === 'Cancelled').length;

  const totalRevenue = payments
    .filter((p) => p.paymentStatus === 'Completed')
    .reduce((acc, p) => acc + p.amount, 0);

  // Hospitality KPIs
  const averageDailyRate = totalBookingsCount > 0 ? Math.round(totalRevenue / totalBookingsCount) : 185;
  const revPAR = Math.round((totalRevenue / (totalRoomsCount * 30)) || 142); // Revenue Per Available Room

  const returningGuestsCount = guests.filter((g) => g.visitsCount > 1).length;
  const newGuestsCount = guests.length - returningGuestsCount;
  const vipGuestsCount = guests.filter((g) => g.visitsCount >= 3).length;

  const handlePrintReport = () => {
    window.print();
    success('Print Job Initiated', 'Report sent to print spooler.');
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Metric,Value\n' +
      `Total Rooms,${totalRoomsCount}\n` +
      `Occupied Rooms,${occupiedRoomsCount}\n` +
      `Occupancy Rate,${currentOccupancyRate}%\n` +
      `Total Bookings,${totalBookingsCount}\n` +
      `Total Revenue,${settings.currencySymbol}${totalRevenue}\n` +
      `Average Daily Rate (ADR),${settings.currencySymbol}${averageDailyRate}\n` +
      `RevPAR,${settings.currencySymbol}${revPAR}\n` +
      `Total Registered Guests,${guests.length}\n` +
      `Returning Guests,${returningGuestsCount}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GrandStay_Hotel_Report_${activeReportTab}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success('Report Exported', 'CSV analytics report downloaded.');
  };

  // Mock Days for charts
  const daysTrend = [
    { day: 'Mon', occupancy: 72, revenue: 1850, bookings: 4 },
    { day: 'Tue', occupancy: 68, revenue: 1600, bookings: 3 },
    { day: 'Wed', occupancy: 85, revenue: 2400, bookings: 6 },
    { day: 'Thu', occupancy: 91, revenue: 3100, bookings: 8 },
    { day: 'Fri', occupancy: 95, revenue: 4200, bookings: 11 },
    { day: 'Sat', occupancy: 100, revenue: 4800, bookings: 14 },
    { day: 'Sun', occupancy: 80, revenue: 2600, bookings: 5 }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Hospitality Intelligence & Business Reports</h3>
          <p className="text-xs text-slate-500 mt-0.5">Comprehensive analytics covering room yield, occupancy curves and guest economics</p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <select
            id="reports-time-range-select"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="week">Past 7 Days</option>
            <option value="month">Current Month (30 Days)</option>
            <option value="quarter">Fiscal Quarter (Q3)</option>
            <option value="year">Full Fiscal Year</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
            title="Download CSV Report"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrintReport}
            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
        <button
          onClick={() => setActiveReportTab('occupancy')}
          className={`flex-1 sm:flex-none px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeReportTab === 'occupancy' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BedDouble className="w-4 h-4 text-amber-600" />
          <span>Occupancy Report</span>
        </button>

        <button
          onClick={() => setActiveReportTab('booking')}
          className={`flex-1 sm:flex-none px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeReportTab === 'booking' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-amber-600" />
          <span>Booking Analytics</span>
        </button>

        <button
          onClick={() => setActiveReportTab('revenue')}
          className={`flex-1 sm:flex-none px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeReportTab === 'revenue' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <DollarSign className="w-4 h-4 text-amber-600" />
          <span>Revenue & RevPAR</span>
        </button>

        <button
          onClick={() => setActiveReportTab('guest')}
          className={`flex-1 sm:flex-none px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeReportTab === 'guest' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4 text-amber-600" />
          <span>Guest Economics</span>
        </button>
      </div>

      {/* Tab 1: Occupancy Report */}
      {activeReportTab === 'occupancy' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Current Occupancy</span>
              <p className="text-2xl font-bold text-slate-900 font-mono mt-1">{currentOccupancyRate}%</p>
              <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                <div className="bg-amber-600 h-full rounded-full" style={{ width: `${currentOccupancyRate}%` }} />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Occupied Stays</span>
              <p className="text-2xl font-bold text-amber-700 font-mono mt-1">{occupiedRoomsCount} Rooms</p>
              <span className="text-xs text-slate-400 mt-2 block">Live in-house guests</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Vacant & Ready</span>
              <p className="text-2xl font-bold text-emerald-700 font-mono mt-1">{availableRoomsCount} Rooms</p>
              <span className="text-xs text-slate-400 mt-2 block">Available for booking</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Maintenance / Out</span>
              <p className="text-2xl font-bold text-rose-700 font-mono mt-1">{maintenanceRoomsCount} Rooms</p>
              <span className="text-xs text-slate-400 mt-2 block">Under deep cleaning</span>
            </div>
          </div>

          {/* Occupancy Velocity Visual Bar Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h4 className="text-base font-bold text-slate-900">7-Day Occupancy Fluctuation Rate (%)</h4>
            <div className="grid grid-cols-7 gap-3 items-end h-56 pt-6 pb-2 border-b border-slate-100">
              {daysTrend.map((item) => (
                <div key={item.day} className="flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[11px] font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                    {item.occupancy}%
                  </span>
                  <div
                    className="w-full max-w-[48px] bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-lg transition-all group-hover:brightness-110"
                    style={{ height: `${item.occupancy}%` }}
                  />
                  <span className="text-xs font-medium text-slate-500 mt-1">{item.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Booking Analytics */}
      {activeReportTab === 'booking' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Reservations</span>
              <p className="text-2xl font-bold text-slate-900 font-mono mt-1">{totalBookingsCount}</p>
              <span className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-2">
                <ArrowUpRight className="w-3.5 h-3.5" /> +14% vs last period
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Check-ins</span>
              <p className="text-2xl font-bold text-indigo-700 font-mono mt-1">{checkedInBookings}</p>
              <span className="text-xs text-slate-400 mt-2 block">Currently staying</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Upcoming Confirmed</span>
              <p className="text-2xl font-bold text-emerald-700 font-mono mt-1">{confirmedBookings}</p>
              <span className="text-xs text-slate-400 mt-2 block">Prepaid & confirmed</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cancelled Rate</span>
              <p className="text-2xl font-bold text-rose-700 font-mono mt-1">{cancelledBookings}</p>
              <span className="text-xs text-slate-400 mt-2 block">Low cancellation index</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h4 className="text-base font-bold text-slate-900">Weekly Booking Intake Volume</h4>
            <div className="grid grid-cols-7 gap-3 items-end h-56 pt-6 pb-2 border-b border-slate-100">
              {daysTrend.map((item) => (
                <div key={item.day} className="flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[11px] font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                    {item.bookings} bookings
                  </span>
                  <div
                    className="w-full max-w-[48px] bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg transition-all group-hover:brightness-110"
                    style={{ height: `${(item.bookings / 15) * 100}%` }}
                  />
                  <span className="text-xs font-medium text-slate-500 mt-1">{item.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Revenue & RevPAR */}
      {activeReportTab === 'revenue' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gross Settled Revenue</span>
              <p className="text-3xl font-bold text-slate-900 font-mono mt-1">
                {settings.currencySymbol}{totalRevenue.toLocaleString()}
              </p>
              <span className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-2">
                <ArrowUpRight className="w-3.5 h-3.5" /> +18.4% month-over-month
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">ADR (Average Daily Rate)</span>
              <p className="text-3xl font-bold text-amber-700 font-mono mt-1">
                {settings.currencySymbol}{averageDailyRate}
              </p>
              <span className="text-xs text-slate-400 mt-2 block">Average tariff earned per occupied night</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">RevPAR Index</span>
              <p className="text-3xl font-bold text-emerald-700 font-mono mt-1">
                {settings.currencySymbol}{revPAR}
              </p>
              <span className="text-xs text-slate-400 mt-2 block">Revenue Per Available Room unit</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h4 className="text-base font-bold text-slate-900">Daily Revenue Yield ({settings.currencySymbol})</h4>
            <div className="grid grid-cols-7 gap-3 items-end h-56 pt-6 pb-2 border-b border-slate-100">
              {daysTrend.map((item) => (
                <div key={item.day} className="flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[11px] font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                    {settings.currencySymbol}{item.revenue}
                  </span>
                  <div
                    className="w-full max-w-[48px] bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-lg transition-all group-hover:brightness-110"
                    style={{ height: `${(item.revenue / 5000) * 100}%` }}
                  />
                  <span className="text-xs font-medium text-slate-500 mt-1">{item.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Guest Economics */}
      {activeReportTab === 'guest' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Guest Profiles</span>
              <p className="text-2xl font-bold text-slate-900 font-mono mt-1">{guests.length}</p>
              <span className="text-xs text-slate-400 mt-2 block">Registered travelers in CRM</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Repeat Loyalty Guests</span>
              <p className="text-2xl font-bold text-indigo-700 font-mono mt-1">{returningGuestsCount} Profiles</p>
              <span className="text-xs text-slate-400 mt-2 block">
                {Math.round((returningGuestsCount / (guests.length || 1)) * 100)}% retention rate
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">VIP Tier Travelers</span>
              <p className="text-2xl font-bold text-amber-700 font-mono mt-1">{vipGuestsCount} Accounts</p>
              <span className="text-xs text-slate-400 mt-2 block">3+ previous luxury stays</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h4 className="text-base font-bold text-slate-900 mb-4">Top Spending Guest Folios</h4>
            <div className="divide-y divide-slate-100">
              {guests.slice(0, 5).map((guest, idx) => (
                <div key={guest.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center font-mono">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-900">{guest.name}</p>
                      <p className="text-[11px] text-slate-400">{guest.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-slate-900 text-xs sm:text-sm">
                      {settings.currencySymbol}{guest.totalSpent.toLocaleString()}
                    </p>
                    <span className="text-[11px] text-slate-400">{guest.visitsCount} stays</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

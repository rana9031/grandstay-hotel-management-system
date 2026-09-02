import React, { useState } from 'react';
import {
  ActivePage,
  Room,
  Booking,
  Guest,
  Staff,
  Payment,
  HotelSettings,
  AppNotification,
  UserSession
} from './types';
import {
  getRooms,
  setRooms as saveRooms,
  getBookings,
  setBookings as saveBookings,
  getGuests,
  setGuests as saveGuests,
  getStaff,
  setStaff as saveStaff,
  getPayments,
  setPayments as savePayments,
  getSettings,
  setSettings as saveSettings,
  getNotifications,
  setNotifications as saveNotifications,
  getCurrentUser,
  setCurrentUser as saveCurrentUser,
  resetInitialData
} from './data/initialData';

import { ToastProvider, useToast } from './context/ToastContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { InvoiceModal } from './components/InvoiceModal';

import { LoginView } from './views/LoginView';
import { DashboardView } from './views/DashboardView';
import { RoomsView } from './views/RoomsView';
import { BookingsView } from './views/BookingsView';
import { GuestsView } from './views/GuestsView';
import { CheckInOutView } from './views/CheckInOutView';
import { StaffView } from './views/StaffView';
import { PaymentsView } from './views/PaymentsView';
import { ReportsView } from './views/ReportsView';
import { SettingsView } from './views/SettingsView';

const MainApp: React.FC = () => {
  // Authentication state
  const [currentUser, setCurrentUserState] = useState<UserSession | null>(() => getCurrentUser());

  // Navigation State
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  // Core Data States
  const [rooms, setRoomsState] = useState<Room[]>(() => getRooms());
  const [bookings, setBookingsState] = useState<Booking[]>(() => getBookings());
  const [guests, setGuestsState] = useState<Guest[]>(() => getGuests());
  const [staff, setStaffState] = useState<Staff[]>(() => getStaff());
  const [payments, setPaymentsState] = useState<Payment[]>(() => getPayments());
  const [settings, setSettingsState] = useState<HotelSettings>(() => getSettings());
  const [notifications, setNotificationsState] = useState<AppNotification[]>(() => getNotifications());

  // Invoice / Folio Modal
  const [invoiceModalBooking, setInvoiceModalBooking] = useState<Booking | null>(null);
  const [invoiceModalPayment, setInvoiceModalPayment] = useState<Payment | null>(null);

  const { success, info } = useToast();

  // Keep LocalStorage in sync when states change
  const setRooms = (newRooms: Room[]) => {
    setRoomsState(newRooms);
    saveRooms(newRooms);
  };

  const setBookings = (newBookings: Booking[]) => {
    setBookingsState(newBookings);
    saveBookings(newBookings);
  };

  const setGuests = (newGuests: Guest[]) => {
    setGuestsState(newGuests);
    saveGuests(newGuests);
  };

  const setStaff = (newStaff: Staff[]) => {
    setStaffState(newStaff);
    saveStaff(newStaff);
  };

  const setPayments = (newPayments: Payment[]) => {
    setPaymentsState(newPayments);
    savePayments(newPayments);
  };

  const setSettings = (newSettings: HotelSettings) => {
    setSettingsState(newSettings);
    saveSettings(newSettings);
  };

  const setNotifications = (newNotifs: AppNotification[]) => {
    setNotificationsState(newNotifs);
    saveNotifications(newNotifs);
  };

  const setCurrentUser = (user: UserSession | null) => {
    setCurrentUserState(user);
    saveCurrentUser(user);
  };

  const handleLogin = (user: UserSession) => {
    setCurrentUser(user);
    setActivePage('dashboard');
    success('Welcome Back', `Logged in as ${user.name} (${user.role})`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    info('Logged Out', 'You have been safely signed out of GrandStay.');
  };

  const handleResetAllData = () => {
    resetInitialData();
    setRoomsState(getRooms());
    setBookingsState(getBookings());
    setGuestsState(getGuests());
    setStaffState(getStaff());
    setPaymentsState(getPayments());
    setSettingsState(getSettings());
    setNotificationsState(getNotifications());
    success('Database Reset', 'Demo sample data reloaded.');
  };

  const handleViewInvoice = (item: any) => {
    if (item.checkInDate) {
      // It's a Booking
      const matchedPayment = payments.find((p) => p.bookingId === item.id);
      setInvoiceModalBooking(item as Booking);
      setInvoiceModalPayment(matchedPayment || null);
    } else {
      // It's a Payment
      const matchedBooking = bookings.find((b) => b.id === item.bookingId);
      if (matchedBooking) {
        setInvoiceModalBooking(matchedBooking);
      } else {
        setInvoiceModalBooking({
          id: item.bookingId || 'BK-DIRECT',
          guestId: 'GST-01',
          guestName: item.guestName,
          guestEmail: 'guest@grandstay.com',
          guestPhone: '+1 (555) 000-0000',
          roomNumber: '101',
          roomType: 'Deluxe Suite',
          checkInDate: '2026-09-01',
          checkOutDate: '2026-09-04',
          guestsCount: 2,
          totalAmount: item.amount,
          status: 'Checked-out',
          paymentStatus: 'Paid',
          createdAt: item.paymentDate
        });
      }
      setInvoiceModalPayment(item as Payment);
    }
  };

  const handleCheckOutFromBooking = (booking: Booking) => {
    const updatedBookings = bookings.map((b) =>
      b.id === booking.id ? { ...b, status: 'Checked-out' as const } : b
    );
    setBookings(updatedBookings);

    const updatedRooms = rooms.map((r) =>
      r.roomNumber === booking.roomNumber ? { ...r, status: 'Available' as const } : r
    );
    setRooms(updatedRooms);

    success('Departure Succeeded', `Room ${booking.roomNumber} is now Available.`);
    handleViewInvoice(booking);
  };

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
    info('Notifications Cleared', 'All activity alerts marked read and cleared.');
  };

  // If user is not logged in, render the Login View
  if (!currentUser) {
    return <LoginView onLogin={handleLogin} settings={settings} />;
  }

  const occupiedRoomsCount = rooms.filter((r) => r.status === 'Occupied').length;
  const todayCheckinsCount = bookings.filter((b) => b.status === 'Confirmed' || b.status === 'Checked-in').length;

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800 antialiased overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        activePage={activePage}
        setActivePage={(page) => {
          setActivePage(page);
          setIsMobileSidebarOpen(false);
        }}
        collapsed={isSidebarCollapsed}
        setCollapsed={setIsSidebarCollapsed}
        mobileOpen={isMobileSidebarOpen}
        setMobileOpen={setIsMobileSidebarOpen}
        user={currentUser}
        onLogout={handleLogout}
        settings={settings}
        stats={{
          occupiedRooms: occupiedRoomsCount,
          todayCheckins: todayCheckinsCount
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <Navbar
          activePage={activePage}
          setActivePage={setActivePage}
          user={currentUser}
          notifications={notifications}
          onMarkNotificationAsRead={handleMarkNotificationAsRead}
          onClearAllNotifications={handleClearAllNotifications}
          onLogout={handleLogout}
          setMobileOpen={setIsMobileSidebarOpen}
          onOpenQuickBooking={() => setActivePage('bookings')}
          onOpenQuickCheckin={() => setActivePage('checkin-checkout')}
          settings={settings}
          searchQuery={globalSearchQuery}
          setSearchQuery={setGlobalSearchQuery}
        />

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {activePage === 'dashboard' && (
              <DashboardView
                rooms={rooms}
                bookings={bookings}
                payments={payments}
                settings={settings}
                setActivePage={setActivePage}
                onOpenQuickBooking={() => setActivePage('bookings')}
                onOpenQuickCheckin={() => setActivePage('checkin-checkout')}
                onViewInvoice={handleViewInvoice}
                onCheckOutBooking={handleCheckOutFromBooking}
              />
            )}

            {activePage === 'rooms' && (
              <RoomsView
                rooms={rooms}
                setRooms={setRooms}
                settings={settings}
              />
            )}

            {activePage === 'bookings' && (
              <BookingsView
                bookings={bookings}
                setBookings={setBookings}
                rooms={rooms}
                setRooms={setRooms}
                guests={guests}
                setGuests={setGuests}
                payments={payments}
                setPayments={setPayments}
                settings={settings}
                onViewInvoice={handleViewInvoice}
                onCheckOutBooking={handleCheckOutFromBooking}
              />
            )}

            {activePage === 'guests' && (
              <GuestsView
                guests={guests}
                setGuests={setGuests}
                bookings={bookings}
                settings={settings}
              />
            )}

            {activePage === 'checkin-checkout' && (
              <CheckInOutView
                rooms={rooms}
                setRooms={setRooms}
                bookings={bookings}
                setBookings={setBookings}
                guests={guests}
                payments={payments}
                setPayments={setPayments}
                settings={settings}
                onViewInvoice={handleViewInvoice}
              />
            )}

            {activePage === 'staff' && (
              <StaffView
                staff={staff}
                setStaff={setStaff}
                settings={settings}
              />
            )}

            {activePage === 'payments' && (
              <PaymentsView
                payments={payments}
                setPayments={setPayments}
                bookings={bookings}
                settings={settings}
                onViewInvoice={handleViewInvoice}
              />
            )}

            {activePage === 'reports' && (
              <ReportsView
                rooms={rooms}
                bookings={bookings}
                guests={guests}
                payments={payments}
                settings={settings}
              />
            )}

            {activePage === 'settings' && (
              <SettingsView
                settings={settings}
                setSettings={setSettings}
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                onResetAllData={handleResetAllData}
              />
            )}
          </div>
        </main>
      </div>

      {/* Global Invoice / Folio Modal */}
      <InvoiceModal
        isOpen={!!invoiceModalBooking}
        onClose={() => {
          setInvoiceModalBooking(null);
          setInvoiceModalPayment(null);
        }}
        booking={invoiceModalBooking}
        payment={invoiceModalPayment}
        settings={settings}
      />
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <MainApp />
    </ToastProvider>
  );
}

export type RoomType = 'Single' | 'Double' | 'Deluxe' | 'Suite';
export type RoomStatus = 'Available' | 'Occupied' | 'Maintenance';

export interface Room {
  id: string;
  roomNumber: string;
  type: RoomType;
  pricePerNight: number;
  status: RoomStatus;
  floor: number;
  capacity: number;
  amenities: string[];
  image: string;
  description: string;
  rating: number;
}

export type BookingStatus = 'Confirmed' | 'Checked-in' | 'Checked-out' | 'Cancelled' | 'Pending';
export type PaymentStatus = 'Paid' | 'Pending' | 'Partial' | 'Refunded';

export interface Booking {
  id: string;
  guestId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomNumber: string;
  roomType: RoomType;
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  guestsCount: number;
  totalAmount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  specialRequests?: string;
  createdAt: string;
  keyCardNumber?: string;
}

export interface Guest {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  idProofType: 'Passport' | 'Driver License' | 'National ID' | 'Voter ID';
  idProofNumber: string;
  visitsCount: number;
  totalSpent: number;
  registeredDate: string;
  notes?: string;
  avatar?: string;
}

export type StaffRole = 'Manager' | 'Receptionist' | 'Housekeeping' | 'Chef' | 'Concierge' | 'Security' | 'Maintenance';
export type StaffStatus = 'Active' | 'On Leave' | 'Inactive';

export interface Staff {
  id: string;
  name: string;
  role: StaffRole;
  phone: string;
  email: string;
  joiningDate: string;
  status: StaffStatus;
  shift: 'Morning' | 'Evening' | 'Night' | 'Full Time';
  salary: number;
  avatar?: string;
}

export type PaymentMethod = 'Credit Card' | 'Debit Card' | 'Cash' | 'Online Banking' | 'UPI';
export type PaymentTransactionStatus = 'Completed' | 'Pending' | 'Failed' | 'Refunded';

export interface Payment {
  id: string;
  bookingId: string;
  guestName: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDate: string;
  paymentStatus: PaymentTransactionStatus;
  invoiceNumber: string;
  notes?: string;
}

export interface HotelSettings {
  name: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  currency: string;
  currencySymbol: string;
  taxRate: number; // percentage, e.g. 12
  checkInTime: string;
  checkOutTime: string;
  accentColor: string;
  hotelStars: number;
}

export interface UserSession {
  id?: string;
  isLoggedIn: boolean;
  name: string;
  email: string;
  role: string;
  avatar: string;
  rememberMe: boolean;
  phone?: string;
}

export type UserProfile = UserSession;

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'booking' | 'checkin' | 'checkout' | 'payment' | 'maintenance' | 'system';
}

export type NotificationItem = AppNotification;


export type ActivePage = 
  | 'dashboard'
  | 'rooms'
  | 'bookings'
  | 'guests'
  | 'checkin-checkout'
  | 'staff'
  | 'payments'
  | 'reports'
  | 'settings';

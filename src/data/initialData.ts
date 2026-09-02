import { Room, Booking, Guest, Staff, Payment, HotelSettings, AppNotification, UserProfile } from '../types';

export const INITIAL_ROOMS: Room[] = [
  {
    id: 'R-101',
    roomNumber: '101',
    type: 'Single',
    pricePerNight: 95,
    status: 'Available',
    floor: 1,
    capacity: 1,
    amenities: ['High-speed Wi-Fi', 'Smart TV', 'Air Conditioning', 'Work Desk', 'Coffee Maker'],
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80',
    description: 'Cozy single room with modern amenities, ergonomic workspace, and courtyard view.',
    rating: 4.6
  },
  {
    id: 'R-102',
    roomNumber: '102',
    type: 'Single',
    pricePerNight: 105,
    status: 'Occupied',
    floor: 1,
    capacity: 1,
    amenities: ['High-speed Wi-Fi', 'Smart TV', 'Air Conditioning', 'En-suite Bathroom'],
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    description: 'Bright and compact single room perfect for solo travelers and business trips.',
    rating: 4.7
  },
  {
    id: 'R-201',
    roomNumber: '201',
    type: 'Double',
    pricePerNight: 145,
    status: 'Available',
    floor: 2,
    capacity: 2,
    amenities: ['King Bed', 'High-speed Wi-Fi', 'Smart TV', 'Mini Bar', 'City View', 'Balcony'],
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
    description: 'Spacious double room with premium king-size bed, private balcony, and city skyline view.',
    rating: 4.8
  },
  {
    id: 'R-202',
    roomNumber: '202',
    type: 'Double',
    pricePerNight: 140,
    status: 'Occupied',
    floor: 2,
    capacity: 2,
    amenities: ['Queen Bed', 'High-speed Wi-Fi', 'Smart TV', 'Mini Fridge', 'Rain Shower'],
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
    description: 'Contemporary double room with modern minimalist decor and walk-in luxury shower.',
    rating: 4.5
  },
  {
    id: 'R-203',
    roomNumber: '203',
    type: 'Double',
    pricePerNight: 150,
    status: 'Maintenance',
    floor: 2,
    capacity: 2,
    amenities: ['Twin Beds', 'High-speed Wi-Fi', 'Smart TV', 'Safe Locker', 'Bathtub'],
    image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
    description: 'Twin double room undergoing routine AC filter maintenance and deep sanitization.',
    rating: 4.4
  },
  {
    id: 'R-301',
    roomNumber: '301',
    type: 'Deluxe',
    pricePerNight: 220,
    status: 'Available',
    floor: 3,
    capacity: 3,
    amenities: ['King Bed + Sofa', 'Panoramic View', 'Jacuzzi', 'Espresso Machine', 'Lounge Area', 'Bathrobes'],
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    description: 'Deluxe sanctuary featuring panoramic windows, private deep-soak Jacuzzi, and artisan espresso bar.',
    rating: 4.9
  },
  {
    id: 'R-302',
    roomNumber: '302',
    type: 'Deluxe',
    pricePerNight: 235,
    status: 'Occupied',
    floor: 3,
    capacity: 3,
    amenities: ['King Bed', 'Ocean/Garden View', 'Marble Bath', 'Complimentary Breakfast', 'Butler Service'],
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80',
    description: 'Opulent deluxe room with custom Italian marble bathroom and personalized concierge service.',
    rating: 4.9
  },
  {
    id: 'R-303',
    roomNumber: '303',
    type: 'Deluxe',
    pricePerNight: 210,
    status: 'Available',
    floor: 3,
    capacity: 3,
    amenities: ['King Bed', 'Soundproof Windows', 'Walk-in Closet', 'Bluetooth Audio', 'Smart Thermostat'],
    image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80',
    description: 'Ultra-quiet acoustic luxury suite tailored for uninterrupted rest and executive productivity.',
    rating: 4.7
  },
  {
    id: 'R-401',
    roomNumber: '401',
    type: 'Suite',
    pricePerNight: 380,
    status: 'Occupied',
    floor: 4,
    capacity: 4,
    amenities: ['Master Bedroom', 'Separate Living Room', 'Dining Area', 'Kitchenette', 'Private Terrace', 'VIP Lounge Access'],
    image: 'https://images.unsplash.com/photo-1631049552057-403cdb8f0658?auto=format&fit=crop&w=800&q=80',
    description: 'Grand Presidential Suite with separate master quarters, designer living salon, and private terrace.',
    rating: 5.0
  },
  {
    id: 'R-402',
    roomNumber: '402',
    type: 'Suite',
    pricePerNight: 350,
    status: 'Available',
    floor: 4,
    capacity: 4,
    amenities: ['King Bed + 2 Singles', 'Private Bar', 'Dedicated Concierge', 'Spa Shower', 'Infinity Balcony'],
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
    description: 'Executive family suite with expansive living quarters, state-of-the-art spa bath, and terrace.',
    rating: 4.9
  },
  {
    id: 'R-403',
    roomNumber: '403',
    type: 'Suite',
    pricePerNight: 365,
    status: 'Maintenance',
    floor: 4,
    capacity: 4,
    amenities: ['King Suite', 'Fireplace', 'Wine Chiller', 'Whirlpool Spa', 'Executive Board Table'],
    image: 'https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&w=800&q=80',
    description: 'Penthouse suite currently undergoing aesthetic hardware upgrades.',
    rating: 4.8
  },
  {
    id: 'R-103',
    roomNumber: '103',
    type: 'Single',
    pricePerNight: 90,
    status: 'Available',
    floor: 1,
    capacity: 1,
    amenities: ['Single Bed', 'Wi-Fi', 'Smart TV', 'Tea Kit', 'Garden View'],
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
    description: 'Quiet ground floor room surrounded by lush landscaped hotel gardens.',
    rating: 4.6
  }
];

export const INITIAL_GUESTS: Guest[] = [
  {
    id: 'GST-1001',
    name: 'Alexander Wright',
    phone: '+1 (555) 234-5678',
    email: 'a.wright@techcorp.io',
    address: '420 Madison Avenue, New York, NY 10017',
    idProofType: 'Passport',
    idProofNumber: 'USA-P98234190',
    visitsCount: 4,
    totalSpent: 2840,
    registeredDate: '2025-01-14',
    notes: 'Prefers high floors and extra feather pillows.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'GST-1002',
    name: 'Eleanor Vance',
    phone: '+1 (555) 345-6789',
    email: 'eleanor.vance@gmail.com',
    address: '742 Evergreen Terrace, Seattle, WA 98101',
    idProofType: 'Driver License',
    idProofNumber: 'WA-DL-882319',
    visitsCount: 2,
    totalSpent: 980,
    registeredDate: '2025-03-22',
    notes: 'Late checkout requested frequently.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'GST-1003',
    name: 'Marcus Sterling',
    phone: '+1 (555) 456-7890',
    email: 'm.sterling@globalventures.com',
    address: '100 Financial Center Blvd, Chicago, IL 60606',
    idProofType: 'Passport',
    idProofNumber: 'USA-P55102941',
    visitsCount: 7,
    totalSpent: 5200,
    registeredDate: '2024-11-05',
    notes: 'VIP guest. Requires airport transfer coordination.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'GST-1004',
    name: 'Sophia Chen',
    phone: '+1 (555) 567-8901',
    email: 'sophia.chen@designstudio.co',
    address: '88 Marina Way, San Francisco, CA 94105',
    idProofType: 'National ID',
    idProofNumber: 'NID-99021844',
    visitsCount: 1,
    totalSpent: 470,
    registeredDate: '2026-02-10',
    notes: 'Allergic to gluten and down feathers.',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'GST-1005',
    name: 'David Miller',
    phone: '+1 (555) 678-9012',
    email: 'david.miller@apexlaw.org',
    address: '350 Commonwealth Ave, Boston, MA 02115',
    idProofType: 'Passport',
    idProofNumber: 'USA-P12998342',
    visitsCount: 3,
    totalSpent: 1650,
    registeredDate: '2025-08-19',
    notes: 'Early morning wake up call at 6:30 AM.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'GST-1006',
    name: 'Isabella Rodriguez',
    phone: '+1 (555) 789-0123',
    email: 'isabella.r@artscouncil.es',
    address: '14 Paseo Del Prado, Miami, FL 33101',
    idProofType: 'Passport',
    idProofNumber: 'ESP-B7720914',
    visitsCount: 2,
    totalSpent: 1140,
    registeredDate: '2025-10-12',
    notes: 'Fluent in Spanish and English.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BK-8901',
    guestId: 'GST-1003',
    guestName: 'Marcus Sterling',
    guestEmail: 'm.sterling@globalventures.com',
    guestPhone: '+1 (555) 456-7890',
    roomNumber: '401',
    roomType: 'Suite',
    checkInDate: '2026-09-01',
    checkOutDate: '2026-09-05',
    guestsCount: 2,
    totalAmount: 1520,
    status: 'Checked-in',
    paymentStatus: 'Paid',
    specialRequests: 'Chilled champagne upon arrival and daily fruit basket.',
    createdAt: '2026-08-20',
    keyCardNumber: 'KC-401A'
  },
  {
    id: 'BK-8902',
    guestId: 'GST-1001',
    guestName: 'Alexander Wright',
    guestEmail: 'a.wright@techcorp.io',
    guestPhone: '+1 (555) 234-5678',
    roomNumber: '302',
    roomType: 'Deluxe',
    checkInDate: '2026-09-02',
    checkOutDate: '2026-09-06',
    guestsCount: 1,
    totalAmount: 940,
    status: 'Checked-in',
    paymentStatus: 'Paid',
    specialRequests: 'Quiet corner room for video conference calls.',
    createdAt: '2026-08-25',
    keyCardNumber: 'KC-302'
  },
  {
    id: 'BK-8903',
    guestId: 'GST-1002',
    guestName: 'Eleanor Vance',
    guestEmail: 'eleanor.vance@gmail.com',
    guestPhone: '+1 (555) 345-6789',
    roomNumber: '202',
    roomType: 'Double',
    checkInDate: '2026-09-02',
    checkOutDate: '2026-09-04',
    guestsCount: 2,
    totalAmount: 280,
    status: 'Checked-in',
    paymentStatus: 'Paid',
    specialRequests: 'Extra bath towels and late checkout.',
    createdAt: '2026-08-28',
    keyCardNumber: 'KC-202'
  },
  {
    id: 'BK-8904',
    guestId: 'GST-1004',
    guestName: 'Sophia Chen',
    guestEmail: 'sophia.chen@designstudio.co',
    guestPhone: '+1 (555) 567-8901',
    roomNumber: '102',
    roomType: 'Single',
    checkInDate: '2026-09-02',
    checkOutDate: '2026-09-03',
    guestsCount: 1,
    totalAmount: 105,
    status: 'Checked-in',
    paymentStatus: 'Paid',
    specialRequests: 'Hypoallergenic pillows.',
    createdAt: '2026-08-30',
    keyCardNumber: 'KC-102'
  },
  {
    id: 'BK-8905',
    guestId: 'GST-1005',
    guestName: 'David Miller',
    guestEmail: 'david.miller@apexlaw.org',
    guestPhone: '+1 (555) 678-9012',
    roomNumber: '201',
    roomType: 'Double',
    checkInDate: '2026-09-03',
    checkOutDate: '2026-09-07',
    guestsCount: 2,
    totalAmount: 580,
    status: 'Confirmed',
    paymentStatus: 'Pending',
    specialRequests: 'Arriving at 3 PM by rental car.',
    createdAt: '2026-08-29'
  },
  {
    id: 'BK-8906',
    guestId: 'GST-1006',
    guestName: 'Isabella Rodriguez',
    guestEmail: 'isabella.r@artscouncil.es',
    guestPhone: '+1 (555) 789-0123',
    roomNumber: '301',
    roomType: 'Deluxe',
    checkInDate: '2026-09-04',
    checkOutDate: '2026-09-08',
    guestsCount: 2,
    totalAmount: 880,
    status: 'Confirmed',
    paymentStatus: 'Paid',
    specialRequests: 'Anniversary celebration setup.',
    createdAt: '2026-08-31'
  },
  {
    id: 'BK-8907',
    guestId: 'GST-1001',
    guestName: 'Alexander Wright',
    guestEmail: 'a.wright@techcorp.io',
    guestPhone: '+1 (555) 234-5678',
    roomNumber: '101',
    roomType: 'Single',
    checkInDate: '2026-08-25',
    checkOutDate: '2026-08-28',
    guestsCount: 1,
    totalAmount: 285,
    status: 'Checked-out',
    paymentStatus: 'Paid',
    specialRequests: 'None',
    createdAt: '2026-08-15'
  },
  {
    id: 'BK-8908',
    guestId: 'GST-1003',
    guestName: 'Marcus Sterling',
    guestEmail: 'm.sterling@globalventures.com',
    guestPhone: '+1 (555) 456-7890',
    roomNumber: '402',
    roomType: 'Suite',
    checkInDate: '2026-08-10',
    checkOutDate: '2026-08-15',
    guestsCount: 3,
    totalAmount: 1750,
    status: 'Checked-out',
    paymentStatus: 'Paid',
    specialRequests: 'Dinner reservations at penthouse bistro.',
    createdAt: '2026-08-01'
  }
];

export const INITIAL_STAFF: Staff[] = [
  {
    id: 'STF-01',
    name: 'Jonathan Reynolds',
    role: 'Manager',
    phone: '+1 (555) 901-2345',
    email: 'j.reynolds@grandstay.com',
    joiningDate: '2022-04-15',
    status: 'Active',
    shift: 'Full Time',
    salary: 75000,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'STF-02',
    name: 'Claire Montgomery',
    role: 'Receptionist',
    phone: '+1 (555) 912-3456',
    email: 'c.montgomery@grandstay.com',
    joiningDate: '2023-02-10',
    status: 'Active',
    shift: 'Morning',
    salary: 42000,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'STF-03',
    name: 'Samuel O’Connor',
    role: 'Receptionist',
    phone: '+1 (555) 923-4567',
    email: 's.oconnor@grandstay.com',
    joiningDate: '2023-08-01',
    status: 'Active',
    shift: 'Evening',
    salary: 42000,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'STF-04',
    name: 'Maria Santos',
    role: 'Housekeeping',
    phone: '+1 (555) 934-5678',
    email: 'm.santos@grandstay.com',
    joiningDate: '2021-11-20',
    status: 'Active',
    shift: 'Morning',
    salary: 36000,
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'STF-05',
    name: 'Antoine Laurent',
    role: 'Chef',
    phone: '+1 (555) 945-6789',
    email: 'a.laurent@grandstay.com',
    joiningDate: '2022-09-01',
    status: 'Active',
    shift: 'Evening',
    salary: 68000,
    avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'STF-06',
    name: 'Liam Gallagher',
    role: 'Concierge',
    phone: '+1 (555) 956-7890',
    email: 'l.gallagher@grandstay.com',
    joiningDate: '2023-05-15',
    status: 'On Leave',
    shift: 'Morning',
    salary: 45000,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'STF-07',
    name: 'Derrick Hayes',
    role: 'Security',
    phone: '+1 (555) 967-8901',
    email: 'd.hayes@grandstay.com',
    joiningDate: '2022-01-10',
    status: 'Active',
    shift: 'Night',
    salary: 40000,
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'STF-08',
    name: 'Carlos Ruiz',
    role: 'Maintenance',
    phone: '+1 (555) 978-9012',
    email: 'c.ruiz@grandstay.com',
    joiningDate: '2024-01-05',
    status: 'Active',
    shift: 'Morning',
    salary: 39000,
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80'
  }
];

export const INITIAL_PAYMENTS: Payment[] = [
  {
    id: 'PAY-7001',
    bookingId: 'BK-8901',
    guestName: 'Marcus Sterling',
    amount: 1520,
    paymentMethod: 'Credit Card',
    paymentDate: '2026-09-01',
    paymentStatus: 'Completed',
    invoiceNumber: 'INV-2026-0901',
    notes: 'Processed via Stripe Terminal / Amex Platinum'
  },
  {
    id: 'PAY-7002',
    bookingId: 'BK-8902',
    guestName: 'Alexander Wright',
    amount: 940,
    paymentMethod: 'Credit Card',
    paymentDate: '2026-09-02',
    paymentStatus: 'Completed',
    invoiceNumber: 'INV-2026-0902',
    notes: 'Visa Corporate card'
  },
  {
    id: 'PAY-7003',
    bookingId: 'BK-8903',
    guestName: 'Eleanor Vance',
    amount: 280,
    paymentMethod: 'Debit Card',
    paymentDate: '2026-09-02',
    paymentStatus: 'Completed',
    invoiceNumber: 'INV-2026-0903',
    notes: 'Mastercard Debit'
  },
  {
    id: 'PAY-7004',
    bookingId: 'BK-8904',
    guestName: 'Sophia Chen',
    amount: 105,
    paymentMethod: 'UPI',
    paymentDate: '2026-09-02',
    paymentStatus: 'Completed',
    invoiceNumber: 'INV-2026-0904',
    notes: 'Instant mobile settlement'
  },
  {
    id: 'PAY-7005',
    bookingId: 'BK-8906',
    guestName: 'Isabella Rodriguez',
    amount: 880,
    paymentMethod: 'Online Banking',
    paymentDate: '2026-08-31',
    paymentStatus: 'Completed',
    invoiceNumber: 'INV-2026-0831',
    notes: 'Direct wire transfer'
  },
  {
    id: 'PAY-7006',
    bookingId: 'BK-8907',
    guestName: 'Alexander Wright',
    amount: 285,
    paymentMethod: 'Cash',
    paymentDate: '2026-08-25',
    paymentStatus: 'Completed',
    invoiceNumber: 'INV-2026-0825',
    notes: 'Paid in cash at front desk'
  },
  {
    id: 'PAY-7007',
    bookingId: 'BK-8908',
    guestName: 'Marcus Sterling',
    amount: 1750,
    paymentMethod: 'Credit Card',
    paymentDate: '2026-08-10',
    paymentStatus: 'Completed',
    invoiceNumber: 'INV-2026-0810',
    notes: 'Amex payment'
  }
];

export const INITIAL_SETTINGS: HotelSettings = {
  name: 'GrandStay Luxury Hotel & Resort',
  tagline: 'Refined Hospitality & Timeless Luxury',
  email: 'reservations@grandstayhotel.com',
  phone: '+1 (800) 555-4726',
  address: '777 Ocean Grand Boulevard, Suite 100, Beverly Hills, CA 90210',
  website: 'https://www.grandstayhotel.com',
  currency: 'USD',
  currencySymbol: '$',
  taxRate: 12,
  checkInTime: '14:00',
  checkOutTime: '11:00',
  accentColor: '#b45309', // Warm amber / gold luxury theme
  hotelStars: 5
};

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'NOTIF-1',
    title: 'New Check-In Completed',
    message: 'Alexander Wright checked in to Deluxe Room 302.',
    time: '10 minutes ago',
    read: false,
    type: 'checkin'
  },
  {
    id: 'NOTIF-2',
    title: 'Payment Received ($940.00)',
    message: 'Invoice INV-2026-0902 successfully settled by Visa Corporate.',
    time: '25 minutes ago',
    read: false,
    type: 'payment'
  },
  {
    id: 'NOTIF-3',
    title: 'Room Maintenance Alert',
    message: 'Room 203 AC maintenance scheduled for completion at 4:00 PM.',
    time: '1 hour ago',
    read: false,
    type: 'maintenance'
  },
  {
    id: 'NOTIF-4',
    title: 'Upcoming Arrival Today',
    message: 'Eleanor Vance arrival expected for Room 202.',
    time: '3 hours ago',
    read: true,
    type: 'booking'
  }
];

// LocalStorage Persistence Keys & Handlers
const STORAGE_KEYS = {
  ROOMS: 'grandstay_rooms_v1',
  BOOKINGS: 'grandstay_bookings_v1',
  GUESTS: 'grandstay_guests_v1',
  STAFF: 'grandstay_staff_v1',
  PAYMENTS: 'grandstay_payments_v1',
  SETTINGS: 'grandstay_settings_v1',
  NOTIFICATIONS: 'grandstay_notifications_v1',
  AUTH: 'grandstay_auth_v1'
};

export const storage = {
  getRooms: (): Room[] => {
    const raw = localStorage.getItem(STORAGE_KEYS.ROOMS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(INITIAL_ROOMS));
      return INITIAL_ROOMS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_ROOMS;
    }
  },
  setRooms: (rooms: Room[]) => {
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
  },

  getBookings: (): Booking[] => {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
      return INITIAL_BOOKINGS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_BOOKINGS;
    }
  },
  setBookings: (bookings: Booking[]) => {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  },

  getGuests: (): Guest[] => {
    const raw = localStorage.getItem(STORAGE_KEYS.GUESTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.GUESTS, JSON.stringify(INITIAL_GUESTS));
      return INITIAL_GUESTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_GUESTS;
    }
  },
  setGuests: (guests: Guest[]) => {
    localStorage.setItem(STORAGE_KEYS.GUESTS, JSON.stringify(guests));
  },

  getStaff: (): Staff[] => {
    const raw = localStorage.getItem(STORAGE_KEYS.STAFF);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(INITIAL_STAFF));
      return INITIAL_STAFF;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_STAFF;
    }
  },
  setStaff: (staff: Staff[]) => {
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staff));
  },

  getPayments: (): Payment[] => {
    const raw = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(INITIAL_PAYMENTS));
      return INITIAL_PAYMENTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_PAYMENTS;
    }
  },
  setPayments: (payments: Payment[]) => {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
  },

  getSettings: (): HotelSettings => {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
      return INITIAL_SETTINGS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_SETTINGS;
    }
  },
  setSettings: (settings: HotelSettings) => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  getNotifications: (): AppNotification[] => {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  },
  setNotifications: (notifs: AppNotification[]) => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  },

  resetAllData: () => {
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(INITIAL_ROOMS));
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
    localStorage.setItem(STORAGE_KEYS.GUESTS, JSON.stringify(INITIAL_GUESTS));
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(INITIAL_STAFF));
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(INITIAL_PAYMENTS));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
  }
};

// Named Export Helpers
export const getRooms = storage.getRooms;
export const setRooms = storage.setRooms;
export const getBookings = storage.getBookings;
export const setBookings = storage.setBookings;
export const getGuests = storage.getGuests;
export const setGuests = storage.setGuests;
export const getStaff = storage.getStaff;
export const setStaff = storage.setStaff;
export const getPayments = storage.getPayments;
export const setPayments = storage.setPayments;
export const getSettings = storage.getSettings;
export const setSettings = storage.setSettings;
export const getNotifications = storage.getNotifications;
export const setNotifications = storage.setNotifications;
export const resetInitialData = storage.resetAllData;

export const getCurrentUser = (): UserProfile | null => {
  const raw = localStorage.getItem(STORAGE_KEYS.AUTH);
  if (!raw) {
    // Default logged-in demo user
    const defaultUser: UserProfile = {
      id: 'USR-01',
      isLoggedIn: true,
      rememberMe: true,
      name: 'Victoria Sterling',
      email: 'admin@grandstay.com',
      role: 'Super Admin',
      phone: '+1 (555) 234-5678',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    };
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(defaultUser));
    return defaultUser;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const setCurrentUser = (user: UserProfile | null) => {
  if (!user) {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  } else {
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(user));
  }
};


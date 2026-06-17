export interface Room {
  id: string;
  name: string;
  type: string;
  price: number;
  originalPrice: number;
  bedType: string;
  area: number;
  floor: string;
  maxGuests: number;
  facilities: string[];
  images: string[];
  description: string;
  status: 'available' | 'booked' | 'maintenance';
  rating: number;
  reviewCount: number;
}

export interface RoomCalendar {
  date: string;
  status: 'available' | 'booked' | 'pending';
  price: number;
}

export interface Activity {
  id: string;
  title: string;
  type: 'culture' | 'tea' | 'study' | 'festival';
  description: string;
  price: number;
  duration: string;
  date: string;
  time: string;
  maxParticipants: number;
  currentParticipants: number;
  image: string;
  tags: string[];
  location: string;
}

export interface Dish {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  isSpecial: boolean;
  spicyLevel: number;
}

export interface DiningBooking {
  id: string;
  date: string;
  time: string;
  guests: number;
  dishes: Dish[];
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

export interface Review {
  id: string;
  roomId?: string;
  userName: string;
  avatar: string;
  rating: number;
  content: string;
  images: string[];
  date: string;
  type: 'room' | 'activity' | 'dining';
  reply?: string;
}

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  guestName: string;
  phone: string;
  totalPrice: number;
  deposit: number;
  status: 'pending' | 'confirmed' | 'checkedIn' | 'checkedOut' | 'cancelled' | 'refunded';
  createTime: string;
  specialRequests?: string;
}

export interface RefundRecord {
  id: string;
  bookingId: string;
  reason: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  applyTime: string;
  processTime?: string;
  refundTime?: string;
}

export interface StatisticsData {
  todayCheckIn: number;
  todayCheckOut: number;
  occupancyRate: number;
  todayRevenue: number;
  monthRevenue: number;
  totalBookings: number;
  roomRevenue: number[];
  monthlyRevenue: { month: string; revenue: number }[];
  roomTypeStats: { type: string; count: number; revenue: number }[];
}

export interface TulouInfo {
  name: string;
  history: string;
  architecture: string;
  culture: string;
  location: string;
  buildTime: string;
  area: string;
  population: string;
  highlights: string[];
  images: string[];
}

export interface NearbyAttraction {
  id: string;
  name: string;
  distance: string;
  description: string;
  image: string;
  duration: string;
  ticketPrice: string;
}

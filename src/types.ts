export type ServiceType = 
  | 'Car Wash' 
  | 'Home Cleaning' 
  | 'Sofa Cleaning' 
  | 'Carpet Cleaning' 
  | 'Water Tank Cleaning';

export interface Addon {
  id: string;
  name: string;
  price: number;
}

export interface Service {
  id: ServiceType;
  name: string;
  basePrice: number;
  description: string;
  icon: string;
  imageUrl?: string;
  addons?: Addon[];
}

export interface Booking {
  id: string;
  serviceId: ServiceType;
  addons: string[];
  recurring: 'None' | 'Weekly' | 'Bi-weekly' | 'Monthly';
  totalPrice: number;
  date: string;
  time: string;
  customerName: string;
  customerPhone: string;
  address: string;
  lat?: number;
  lng?: number;
  carCategory?: string;
  carModel?: string;
  tankCapacity?: string;
  homeSize?: string;
  sofaType?: string;
  carpetSize?: string;
  status: 'Pending' | 'Confirmed' | 'Driver Dispatched' | 'In Progress' | 'Completed';
  driverId?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  text: string;
  date: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  currentLat?: number;
  currentLng?: number;
  status: 'Available' | 'Busy' | 'Offline';
}

import { api } from './api';

export interface BookingData {
  serviceId: string;
  packageId: string;
  date: string;
  time: string;
  fullName: string;
  mobile: string;
  email?: string;
  address: string;
  landmark?: string;
  notes?: string;
}

export const bookingService = {
  createBooking: async (bookingData: BookingData & { amount: number, serviceName: string, packageName: string }) => {
    // In a real application, this would use the api abstraction:
    // return api.post('/bookings', bookingData);
    
    // For the initial static deployment, we simulate a backend and use local state.
    return new Promise<{ success: boolean, bookingId: string }>((resolve) => {
      setTimeout(() => {
        const bookingId = `OE-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        
        const currentBookings = JSON.parse(localStorage.getItem('okar_bookings') || '[]');
        const newBooking = {
          id: bookingId,
          ...bookingData,
          status: 'Received',
          createdAt: new Date().toISOString()
        };
        localStorage.setItem('okar_bookings', JSON.stringify([...currentBookings, newBooking]));
        
        resolve({ success: true, bookingId });
      }, 600);
    });
  },
  
  getBookingDetails: async (bookingId: string) => {
    // return api.get(`/bookings/${bookingId}`);
    return Promise.resolve({
      id: bookingId,
      status: 'confirmed',
      date: new Date().toISOString()
    });
  }
};

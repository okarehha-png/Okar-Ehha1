import React, { createContext, useContext, useEffect, useState } from 'react';
import { Booking, Driver, Review } from './types';
import { INITIAL_REVIEWS, MOCK_DRIVERS } from './data/mockData';

interface AppContextType {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  updateBookingStatus: (id: string, status: Booking['status'], driverId?: string) => void;
  drivers: Driver[];
  updateDriverLocation: (id: string, lat: number, lng: number) => void;
  reviews: Review[];
  addReview: (review: Review) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('okar_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('okar_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [drivers, setDrivers] = useState<Driver[]>(MOCK_DRIVERS);

  useEffect(() => {
    localStorage.setItem('okar_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('okar_reviews', JSON.stringify(reviews));
  }, [reviews]);

  const addBooking = (booking: Booking) => {
    setBookings((prev) => [booking, ...prev]);
  };

  const updateBookingStatus = (id: string, status: Booking['status'], driverId?: string) => {
    setBookings((prev) => prev.map(b => {
      if (b.id === id) {
        return { ...b, status, ...(driverId ? { driverId } : {}) };
      }
      return b;
    }));
  };

  const updateDriverLocation = (id: string, lat: number, lng: number) => {
    setDrivers((prev) => prev.map(d => d.id === id ? { ...d, currentLat: lat, currentLng: lng } : d));
  };

  const addReview = (review: Review) => {
    setReviews((prev) => [review, ...prev]);
  };

  return (
    <AppContext.Provider value={{ bookings, addBooking, updateBookingStatus, drivers, updateDriverLocation, reviews, addReview }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

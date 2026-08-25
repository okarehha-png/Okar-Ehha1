import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppProvider } from './store';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { WhatsAppButton } from './components/layout/WhatsAppButton';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import DashboardPage from './pages/DashboardPage';
import TrackingPage from './pages/TrackingPage';
import LoginPage from './pages/LoginPage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="flex min-h-screen flex-col bg-black selection:bg-yellow-500/30">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/book" element={<BookingPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/track/:bookingId" element={<TrackingPage />} />
            </Routes>
          </main>
          <Footer />
          <WhatsAppButton />
        </div>
        <Toaster theme="dark" position="top-center" />
      </BrowserRouter>
    </AppProvider>
  );
}



import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import BookingPage from "./pages/BookingPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import TrackingPage from "./pages/TrackingPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/admin/LoginPage";
import DashboardPage from "./pages/admin/DashboardPage";
import ScrollToTop from "./components/layout/ScrollToTop";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="car-wash" element={<ServiceDetailPage serviceSlug="car-wash" />} />
          <Route path="interior-cleaning" element={<ServiceDetailPage serviceSlug="interior-cleaning" />} />
          <Route path="car-detailing" element={<ServiceDetailPage serviceSlug="car-detailing" />} />
          <Route path="sofa-cleaning" element={<ServiceDetailPage serviceSlug="sofa-cleaning" />} />
          <Route path="water-tank-cleaning" element={<ServiceDetailPage serviceSlug="water-tank-cleaning" />} />
                    <Route path="monthly-car-wash" element={<ServiceDetailPage serviceSlug="monthly-car-wash" />} />
          <Route path="bike-wash" element={<ServiceDetailPage serviceSlug="bike-wash" />} />
          <Route path="home-cleaning" element={<ServiceDetailPage serviceSlug="home-cleaning" />} />
          <Route path="solar-panel-cleaning" element={<ServiceDetailPage serviceSlug="solar-panel-cleaning" />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="services/:slug" element={<ServiceDetailPage />} />
          <Route path="book" element={<BookingPage />} />
          <Route path="book/:slug" element={<BookingPage />} />
          <Route path="confirmation/:id" element={<ConfirmationPage />} />
          <Route path="track" element={<TrackingPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>
        
        {/* Admin Routes without main Layout */}
        <Route path="/admin">
          <Route path="login" element={<LoginPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

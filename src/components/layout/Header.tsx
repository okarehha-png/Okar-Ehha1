import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, MapPin } from "lucide-react";
import { cn } from "../../lib/utils";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Passes & AMC", path: "/subscriptions" },
    { name: "Book Service", path: "/book" },
    { name: "Track Booking", path: "/track" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-8 shrink-0 transition-all duration-300">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between h-full">
        <Link to="/" className="flex items-center">
          <div className="flex items-center justify-center">
            <img src="/okar-ehha-logo.jpg.jpeg" alt="Okar Ehha" className="h-10 md:h-12 w-auto object-contain" />
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-gray-700 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "hover:text-black transition-colors font-semibold",
                location.pathname === link.path ? "text-black" : "text-gray-600"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center text-gray-800 text-xs font-bold bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
            <MapPin className="w-3 h-3 mr-1 text-black" />
            Korba, CG
          </div>
          <Link
            to="/book"
            className="bg-black text-white px-5 py-2 rounded-md font-bold text-xs hover:bg-gray-800 transition-colors uppercase tracking-wider"
          >
            Book Now
          </Link>
        </div>

        <button
          className="md:hidden p-2 text-black"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-xl overflow-hidden flex flex-col z-50">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-800">
             <MapPin className="w-4 h-4 text-black" />
             Service Area: Korba
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "block px-6 py-4 text-base font-semibold border-b border-gray-50",
                location.pathname === link.path ? "text-black bg-gray-50" : "text-gray-600"
              )}
            >
              {link.name}
            </Link>
          ))}
          <div className="p-6">
            <Link
              to="/book"
              className="block w-full text-center bg-black text-white px-5 py-3 rounded-md text-sm font-bold shadow-sm uppercase tracking-wider hover:bg-gray-800 transition-colors"
            >
              Book a Service
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

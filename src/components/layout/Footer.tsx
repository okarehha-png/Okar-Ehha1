import { Link } from "react-router-dom";
import { Phone, MapPin, Mail, Instagram, Facebook } from "lucide-react";
import { servicesData } from "../../data/services";

export default function Footer() {
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-gray-200 text-gray-900 pt-16 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          <div className="space-y-4">
            <Link to="/" className="inline-block mb-4">
              <img src="/okar-ehha-logo.jpg.jpeg" alt="Okar Ehha" className="h-12 w-auto object-contain bg-white px-2 py-1 rounded" />
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Professional doorstep cleaning services in Korba. Fast, reliable, and premium quality service.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center hover:border-black hover:text-black transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center hover:border-black hover:text-black transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-[11px] uppercase tracking-widest text-gray-500 font-bold mb-6">Services</h3>
            <ul className="space-y-3">
              {Object.values(servicesData).slice(0, 7).map((service) => (
                <li key={service.id}>
                  <Link to={`/${service.slug}`} className="text-gray-600 hover:text-black transition-colors text-sm">
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] uppercase tracking-widest text-gray-500 font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-600 hover:text-black transition-colors text-sm">Home</Link></li>
              <li><Link to="/car-wash" className="text-gray-600 hover:text-black transition-colors text-sm">Car Wash</Link></li>
              <li><Link to="/bike-wash" className="text-gray-600 hover:text-black transition-colors text-sm">Bike Wash</Link></li>
              <li><Link to="/sofa-cleaning" className="text-gray-600 hover:text-black transition-colors text-sm">Sofa Cleaning</Link></li>
              <li><Link to="/water-tank-cleaning" className="text-gray-600 hover:text-black transition-colors text-sm">Water Tank Cleaning</Link></li>
              <li><Link to="/book" className="text-gray-600 hover:text-black transition-colors text-sm">Book Service</Link></li>
              <li><Link to="/about" className="text-gray-600 hover:text-black transition-colors text-sm">About</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-black transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] uppercase tracking-widest text-gray-500 font-bold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-600 text-sm">
                <MapPin className="w-4 h-4 text-black shrink-0 mt-0.5" />
                <span>Korba, Chhattisgarh<br/>India</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600 text-sm">
                <Phone className="w-4 h-4 text-black shrink-0" />
                <a href="tel:+919522000118" className="hover:text-gray-900 transition-colors">+91 9522000118</a>
              </li>
              <li className="flex items-center gap-3 text-gray-600 text-sm">
                <Mail className="w-4 h-4 text-black shrink-0" />
                <a href="mailto:okarehha@gmail.com" className="hover:text-gray-900 transition-colors">okarehha@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-4 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-gray-100">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-12">
            <p className="text-gray-900 text-[11px] font-medium text-center md:text-left">
              © {new Date().getFullYear()} Okar Ehha. All rights reserved.
            </p>
            
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-gray-500 text-[9px] uppercase tracking-widest">Customer Support</span>
              <span className="text-black font-bold text-sm">+91 95220 00118</span>
            </div>
            <button 
              onClick={handleScrollTop}
              className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center border border-gray-200 text-gray-900 hover:border-black hover:text-black transition-colors"
            >
              ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

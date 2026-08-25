import React from 'react';
import { Phone, MapPin, Facebook, Instagram, Youtube, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img src="/okar-ehha-logo.jpg" alt="OkarEhha Logo" className="h-16 w-auto object-contain" />
              <div className="flex flex-col">
                <span className="font-serif text-3xl font-bold tracking-widest text-white uppercase leading-none">Okar <span className="text-yellow-500">Ehha</span></span>
                <span className="text-[10px] text-zinc-400 tracking-[0.2em] uppercase mt-2 whitespace-nowrap">Premium Cleaning Services</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed max-w-sm mb-8 font-light">
              Premium Detailing & Executive Cleaning Services. Redefining what it means to be pristine.
            </p>
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-transparent text-xs font-bold tracking-widest uppercase text-yellow-500 border border-yellow-500/30">✓ Verified Certified</div>
              <div className="px-4 py-2 bg-transparent text-xs font-bold tracking-widest uppercase text-yellow-500 border border-yellow-500/30">★ 5.0 Rating</div>
            </div>
            <div className="mt-8">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white mb-4">Get in touch!</h4>
              <div className="flex items-center gap-4">
                <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full border border-white/10 hover:border-yellow-500 hover:text-yellow-500 transition-colors">
                  <Facebook className="h-4 w-4" />
                </a>
                <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full border border-white/10 hover:border-yellow-500 hover:text-yellow-500 transition-colors">
                  <Instagram className="h-4 w-4" />
                </a>
                <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full border border-white/10 hover:border-yellow-500 hover:text-yellow-500 transition-colors">
                  <Youtube className="h-5 w-5" />
                </a>
                <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full border border-white/10 hover:border-yellow-500 hover:text-yellow-500 transition-colors">
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-6">Directory</h4>
            <ul className="space-y-4 text-sm font-light">
              <li><a href="/#services" className="hover:text-yellow-500 transition-colors">Services</a></li>
              <li><a href="/book" className="hover:text-yellow-500 transition-colors">Book Now</a></li>
              <li><a href="/dashboard" className="hover:text-yellow-500 transition-colors">Admin Dashboard</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-6">Contact</h4>
            <ul className="space-y-4 text-sm font-light">
              <li className="flex items-start gap-3 hover:text-yellow-500 transition-colors">
                <Phone className="h-5 w-5 text-yellow-500 shrink-0" />
                <span>9522000118</span>
              </li>
              <li className="flex items-start gap-3 hover:text-yellow-500 transition-colors">
                <MapPin className="h-5 w-5 text-yellow-500 shrink-0" />
                <span>Korba, Chhattisgarh</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-16 border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs tracking-widest uppercase text-zinc-600">
          <p>&copy; {new Date().getFullYear()} Okar Ehha. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-yellow-500 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-yellow-500 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

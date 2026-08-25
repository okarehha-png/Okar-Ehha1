import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Droplets, CarFront } from 'lucide-react';
import { cn } from '../../utils';


export function Header() {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/#services' },
    { name: 'Gallery', path: '/#gallery' },
    { name: 'Reviews', path: '/#reviews' },
    { name: 'Contact', path: '/#contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex py-3 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <img src="/okar-ehha-logo.jpg" alt="OkarEhha Logo" className="h-12 w-auto object-contain" />
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold tracking-widest text-white uppercase leading-none">Okar <span className="text-yellow-500">Ehha</span></span>
                <span className="text-[9px] text-zinc-400 tracking-[0.2em] uppercase mt-1 whitespace-nowrap">Premium Cleaning Services</span>
              </div>
            </Link>
          </div>
          
          <nav className="hidden md:block">
            <ul className="flex items-center gap-8">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.path}
                    className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-400 transition-colors hover:text-yellow-500"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
              <li className="flex items-center gap-4 border-l border-white/10 pl-8">
                <Link
                  to="/login"
                  className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-400 transition-colors hover:text-white"
                >
                  Login
                </Link>
                <Link
                  to="/book"
                  className="rounded-none border border-yellow-500 bg-transparent px-6 py-2 text-xs font-bold tracking-[0.2em] text-yellow-500 shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-all hover:bg-yellow-500 hover:text-black uppercase"
                >
                  BOOK NOW
                </Link>
              </li>
            </ul>
          </nav>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-zinc-400 hover:text-yellow-500 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-white/10 bg-black/95 backdrop-blur-xl px-4 py-6 shadow-2xl">
          <ul className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.path}
                  className="block text-sm font-bold uppercase tracking-[0.2em] text-zinc-300 hover:text-yellow-500 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              </li>
            ))}
            <li>
              <Link
                to="/login"
                className="block text-sm font-bold uppercase tracking-[0.2em] text-zinc-300 hover:text-white transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            </li>
            <li className="pt-4">
              <Link
                to="/book"
                className="block w-full text-center border border-yellow-500 bg-yellow-500/10 px-6 py-4 text-xs font-bold tracking-[0.2em] text-yellow-500 shadow-sm transition-colors hover:bg-yellow-500 hover:text-black uppercase"
                onClick={() => setIsOpen(false)}
              >
                BOOK NOW
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

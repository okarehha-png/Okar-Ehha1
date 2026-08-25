import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SERVICES } from '../data/mockData';
import { formatINR } from '../utils';

import carWashHeroImg from '../assets/images/car_wash_photo_1782142850661.jpg';

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SERVICES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col gap-32 pb-32">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32 sm:pt-40 sm:pb-48 border-b border-white/10">
        <div className="absolute inset-0 w-full h-full">
          {SERVICES.map((service, index) => (
            <img 
              key={service.id}
              src={service.imageUrl} 
              alt={service.name} 
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
              referrerPolicy="no-referrer"
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20"></div>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-500/30 text-yellow-500 text-xs font-bold tracking-[0.2em] uppercase mb-8 backdrop-blur-md bg-black/40">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
            </span>
            Premium Services in Korba
          </div>
          <h2 className="text-[56px] sm:text-[80px] leading-[1.1] font-serif font-bold tracking-tighter mb-6 text-white drop-shadow-2xl">
            Redefining <span className="text-yellow-500 italic">Clean</span><br/>Luxury at your doorstep.
          </h2>
          <p className="max-w-2xl text-lg sm:text-xl text-zinc-400 leading-relaxed mb-10 font-light">
            Exclusive care for your luxury vehicles, homes, and executive offices. Experience unparalleled attention to detail with premium eco-friendly treatments.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 w-full sm:w-auto mt-4 mb-4">
            <Link
              to="/book"
              className="px-10 py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-xs tracking-[0.2em] uppercase transition-all shadow-[0_0_40px_rgba(212,175,55,0.3)] hover:shadow-[0_0_60px_rgba(212,175,55,0.5)] transform hover:-translate-y-1"
            >
              Book Premium Service
            </Link>
            <a
              href="#services"
              className="px-10 py-4 bg-transparent hover:bg-white/5 text-white font-bold text-xs tracking-[0.2em] uppercase transition-all border border-white/20 backdrop-blur-sm"
            >
              Explore Collection
            </a>
          </div>
          
          <div className="flex justify-center gap-3 mt-8">
            {SERVICES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${index === currentSlide ? 'w-8 bg-yellow-500' : 'w-2 bg-white/30 hover:bg-white/50'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <div className="glass-panel p-8 sm:p-12 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
             {[
               { title: 'Professional Staff', icon: '👔' },
               { title: 'Eco-Friendly Products', icon: '🌿' },
               { title: 'Doorstep Service', icon: '🏠' },
               { title: 'Affordable Pricing', icon: '💎' },
               { title: '100% Satisfaction', icon: '⭐' }
             ].map((badge, i) => (
                <div key={i} className="flex flex-col items-center gap-3">
                  <span className="text-3xl grayscale opacity-80">{badge.icon}</span>
                  <span className="text-xs font-bold tracking-widest uppercase text-zinc-300">{badge.title}</span>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2 relative">
             <div className="absolute inset-0 bg-yellow-500/10 blur-3xl rounded-full"></div>
             {SERVICES.map((service, index) => (
               <img 
                 key={service.id}
                 src={service.imageUrl} 
                 alt="Premium Detailing" 
                 className={`w-full object-cover grayscale transition-opacity duration-1000 border border-white/10 ${index === currentSlide ? 'opacity-90 relative z-10' : 'opacity-0 absolute inset-0 h-full'}`} 
                 referrerPolicy="no-referrer" 
               />
             ))}
             <div className="absolute -bottom-8 -right-8 glass-panel p-6 z-20 border border-yellow-500/20">
                <div className="text-4xl font-serif font-bold text-yellow-500 mb-2">5+</div>
                <div className="text-xs tracking-widest uppercase text-white font-bold">Years of Excellence</div>
             </div>
          </div>
          <div className="lg:w-1/2">
             <span className="text-yellow-500 text-xs font-bold tracking-[0.2em] uppercase mb-4 block">The Okar Ehha Difference</span>
             <h2 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-6 leading-tight">Meticulous craftsmanship in every detail.</h2>
             <p className="text-zinc-400 leading-relaxed mb-8 font-light text-lg">
               We don't just clean; we restore, protect, and enhance. Using industry-leading compounds, ceramic formulations, and highly trained specialists, your prized possessions are in the safest hands.
             </p>
             <ul className="space-y-4">
                {[
                  'Certified & Background-Verified Experts',
                  'Waterless & Steam Wash Technologies',
                  'High-End Ceramic & Graphene Treatments',
                  'Flexible Subscription Plans'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-zinc-300">
                    <span className="w-6 h-6 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 text-sm">✓</span>
                    <span className="font-medium tracking-wide">{item}</span>
                  </li>
                ))}
             </ul>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <span className="text-yellow-500 text-xs font-bold tracking-[0.2em] uppercase mb-4 block">Our Portfolio</span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4">Premium Services</h2>
          <p className="text-lg text-zinc-400 font-light">Comprehensive luxury care tailored perfectly to your requirements.</p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <div key={service.id} className="group relative glass-panel flex flex-col justify-between overflow-hidden transition-all duration-500 hover:border-yellow-500/30 hover:bg-white/[0.02]">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500/0 via-yellow-500/50 to-yellow-500/0 opacity-0 group-hover:opacity-100 transition-opacity z-20"></div>
              {service.imageUrl && (
                <div className="h-48 w-full overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101010] to-transparent z-10"></div>
                  <img src={service.imageUrl} alt={service.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-100" referrerPolicy="no-referrer" />
                </div>
              )}
              <div className="p-8 flex-1 flex flex-col relative z-20">
                <h3 className="text-2xl font-serif font-bold text-white mb-3 group-hover:text-yellow-500 transition-colors">{service.name}</h3>
                <p className="text-zinc-400 mb-8 flex-1 text-sm leading-relaxed font-light">{service.description}</p>
                <div className="flex items-end justify-between border-t border-white/10 pt-6">
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Starting from</p>
                    <p className="text-xl text-white font-mono">{formatINR(service.basePrice)}</p>
                  </div>
                </div>
              </div>
              <Link
                to={`/book?service=${service.id}`}
                className="w-full text-center px-4 py-4 bg-transparent group-hover:bg-yellow-500 text-yellow-500 group-hover:text-black text-xs font-bold tracking-[0.2em] uppercase transition-all border-t border-white/5 relative z-20"
              >
                Select Service
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Tiers Section */}
      <section id="pricing" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <span className="text-yellow-500 text-xs font-bold tracking-[0.2em] uppercase mb-4 block">Packages</span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4">Service Tiers</h2>
          <p className="text-lg text-zinc-400 font-light">Select the perfect level of care tailored to your requirements and budget.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Basic Tier */}
          <div className="glass-panel p-8 border border-white/10 hover:border-white/30 transition-all flex flex-col">
            <h3 className="text-2xl font-serif font-bold text-white mb-2">Essential</h3>
            <p className="text-sm text-zinc-400 mb-6 flex-1">Routine maintenance for your everyday vehicle.</p>
            <div className="flex items-end gap-2 mb-8">
              <span className="text-4xl font-light font-mono text-white">{formatINR(499)}</span>
              <span className="text-xs text-zinc-500 mb-1 uppercase tracking-widest">/ session</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-sm text-zinc-300">
                <span className="text-white/30">✓</span>
                Exterior high-pressure wash
              </li>
              <li className="flex items-center gap-3 text-sm text-zinc-300">
                <span className="text-white/30">✓</span>
                Interior vacuuming
              </li>
              <li className="flex items-center gap-3 text-sm text-zinc-300">
                <span className="text-white/30">✓</span>
                Dashboard wipe down
              </li>
              <li className="flex items-center gap-3 text-sm text-zinc-500/30">
                <span className="text-transparent">✓</span>
                Tyre & trim dressing
              </li>
              <li className="flex items-center gap-3 text-sm text-zinc-500/30">
                <span className="text-transparent">✓</span>
                Ozone treatment
              </li>
            </ul>
            <Link to="/book?service=Car%20Wash&tier=Essential" className="block w-full py-4 border border-white/20 hover:border-white hover:bg-white text-white hover:text-black text-center text-xs font-bold tracking-[0.2em] uppercase transition-all">
              Choose Essential
            </Link>
          </div>

          {/* Premium Tier */}
          <div className="p-8 border border-yellow-500 bg-yellow-500/5 relative flex flex-col transform lg:-translate-y-4 shadow-[0_0_40px_rgba(212,175,55,0.15)]">
            <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] font-bold px-3 py-1 uppercase tracking-widest">Most Popular</div>
            <h3 className="text-2xl font-serif font-bold text-yellow-500 mb-2">Signature</h3>
            <p className="text-sm text-zinc-300 mb-6 flex-1">Deep cleaning and detailing for aesthetic perfection.</p>
            <div className="flex items-end gap-2 mb-8">
              <span className="text-5xl font-light font-mono text-white">{formatINR(999)}</span>
              <span className="text-xs text-zinc-400 mb-2 uppercase tracking-widest">/ session</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
               <li className="flex items-center gap-3 text-sm text-zinc-100">
                <span className="text-yellow-500">✓</span>
                Foam exterior hand wash
              </li>
              <li className="flex items-center gap-3 text-sm text-zinc-100">
                <span className="text-yellow-500">✓</span>
                Deep interior vacuuming
              </li>
              <li className="flex items-center gap-3 text-sm text-zinc-100">
                <span className="text-yellow-500">✓</span>
                Dashboard & console detailing
              </li>
              <li className="flex items-center gap-3 text-sm text-zinc-100">
                <span className="text-yellow-500">✓</span>
                Premium tyre & trim dressing
              </li>
              <li className="flex items-center gap-3 text-sm text-zinc-500/30">
                <span className="text-transparent">✓</span>
                Ozone odor treatment
              </li>
            </ul>
            <Link to="/book?service=Car%20Wash&tier=Signature" className="block w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-black text-center text-xs font-bold tracking-[0.2em] uppercase transition-all">
              Choose Signature
            </Link>
          </div>

          {/* Executive Tier */}
          <div className="glass-panel p-8 border border-white/10 hover:border-yellow-500/50 transition-all flex flex-col">
            <h3 className="text-2xl font-serif font-bold text-white mb-2">Executive</h3>
            <p className="text-sm text-zinc-400 mb-6 flex-1">The ultimate luxury care and protection package.</p>
            <div className="flex items-end gap-2 mb-8">
              <span className="text-4xl font-light font-mono text-white">{formatINR(1999)}</span>
              <span className="text-xs text-zinc-500 mb-1 uppercase tracking-widest">/ session</span>
            </div>
             <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-sm text-zinc-300">
                <span className="text-white/60">✓</span>
                Waterless/Steam premium wash
              </li>
              <li className="flex items-center gap-3 text-sm text-zinc-300">
                <span className="text-white/60">✓</span>
                Shampoo & stain removal
              </li>
              <li className="flex items-center gap-3 text-sm text-zinc-300">
                <span className="text-white/60">✓</span>
                Leather conditioning
              </li>
              <li className="flex items-center gap-3 text-sm text-zinc-300">
                <span className="text-white/60">✓</span>
                Ceramic spray sealant
              </li>
              <li className="flex items-center gap-3 text-sm text-zinc-300">
                <span className="text-white/60">✓</span>
                Ozone odor treatment
              </li>
            </ul>
            <Link to="/book?service=Car%20Wash&tier=Executive" className="block w-full py-4 border border-white/20 hover:border-yellow-500 hover:text-yellow-500 text-white text-center text-xs font-bold tracking-[0.2em] uppercase transition-all">
              Choose Executive
            </Link>
          </div>
        </div>
      </section>

      {/* Monthly Plans Section */}
      <section id="membership" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16">
        <div className="glass-panel p-10 sm:p-16 border border-yellow-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden">
             <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full border border-yellow-500/10 opacity-50"></div>
             <div className="absolute right-10 top-10 w-96 h-96 rounded-full border border-yellow-500/5 opacity-50 relative"></div>
          </div>
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-16">
            <div className="lg:w-1/2">
              <span className="text-yellow-500 text-xs font-bold tracking-[0.2em] uppercase mb-4 block">Executive Membership</span>
              <h2 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-6">The Okar Ehha Black Card</h2>
              <p className="text-zinc-400 mb-8 font-light text-lg leading-relaxed">Ensure your assets remain in pristine condition all year round with our exclusive monthly subscription. Lock in preferential rates and enjoy priority scheduling.</p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-4 text-zinc-300">
                  <span className="text-yellow-500">❖</span>
                  <span className="tracking-wide">Up to 20% privilege savings</span>
                </li>
                <li className="flex items-center gap-4 text-zinc-300">
                  <span className="text-yellow-500">❖</span>
                  <span className="tracking-wide">Dedicated master detailers</span>
                </li>
                <li className="flex items-center gap-4 text-zinc-300">
                  <span className="text-yellow-500">❖</span>
                  <span className="tracking-wide">Complimentary interior ozone treatment</span>
                </li>
              </ul>
            </div>
            
            <div className="lg:w-5/12 w-full">
              <div className="p-10 bg-black/80 backdrop-blur-xl border border-yellow-500/30 relative">
                <div className="absolute -top-4 right-8 bg-yellow-500 text-black text-[10px] font-bold px-4 py-1.5 uppercase tracking-widest">Most Requested</div>
                <h3 className="text-2xl font-serif font-bold mb-2 text-white">Signature Monthly Care</h3>
                <div className="flex items-end gap-2 mb-8 mt-6">
                  <span className="text-5xl font-light font-mono text-white">{formatINR(1499)}</span>
                  <span className="text-sm text-zinc-500 mb-2 uppercase tracking-widest">/ month</span>
                </div>
                <div className="space-y-4 mb-10 pt-6 border-t border-white/10">
                  <div className="text-sm flex justify-between"><span className="text-zinc-400 tracking-wide">Exterior Hand Wash</span> <span className="font-bold text-yellow-500">4x/mo</span></div>
                  <div className="text-sm flex justify-between"><span className="text-zinc-400 tracking-wide">Interior Deep Vacuum</span> <span className="font-bold text-yellow-500">2x/mo</span></div>
                  <div className="text-sm flex justify-between"><span className="text-zinc-400 tracking-wide">Tyre & Trim Dressing</span> <span className="font-bold text-yellow-500">4x/mo</span></div>
                </div>
                <Link to="/book?service=Car%20Wash&plan=Monthly" className="block w-full py-4 border border-yellow-500 hover:bg-yellow-500 text-yellow-500 hover:text-black text-center text-xs font-bold tracking-[0.2em] uppercase transition-all">
                  Apply for Membership
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Before & After Gallery */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
         <div className="mx-auto max-w-2xl text-center mb-16">
          <span className="text-yellow-500 text-xs font-bold tracking-[0.2em] uppercase mb-4 block">The Transformation</span>
          <h2 className="font-serif text-4xl font-bold tracking-tight text-white mb-4">Before & After</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="relative group overflow-hidden border border-white/10">
              <img src="https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=800&auto=format&fit=crop" className="w-full h-[400px] object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" alt="Car Before After"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
                 <h3 className="text-xl font-serif text-white">Paint Restoration</h3>
              </div>
           </div>
           <div className="relative group overflow-hidden border border-white/10">
              <img src="https://images.unsplash.com/photo-1527515637-ed170c0ba13e?w=800&auto=format&fit=crop" className="w-full h-[400px] object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" alt="Home Before After"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
                 <h3 className="text-xl font-serif text-white">Deep Home Cleaning</h3>
              </div>
           </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="testimonials" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <span className="text-yellow-500 text-xs font-bold tracking-[0.2em] uppercase mb-4 block">Testimonials</span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4">Client Experiences</h2>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            { name: 'Amit Sharma', rating: 5, text: 'Impeccable service. The attention to detail on my vehicle was simply outstanding. True professionals.', initials: 'AS', title: 'Business Owner' },
            { name: 'Priya Patel', rating: 5, text: 'They transformed our apartment completely. The staff were courteous, quiet, and highly efficient.', initials: 'PP', title: 'Architect' },
            { name: 'Rahul Verma', rating: 5, text: 'The deep cleaning for my pristine leather sofas was flawless. They use premium products that truly show.', initials: 'RV', title: 'Executive' }
          ].map((review, i) => (
            <div key={i} className="p-8 glass-panel flex flex-col border border-white/5 hover:border-yellow-500/20 transition-colors">
              <div className="flex gap-1 mb-6">
                 {[...Array(5)].map((_, j) => (
                    <span key={j} className={j < review.rating ? 'text-yellow-500 text-sm' : 'text-zinc-700 text-sm'}>★</span>
                 ))}
              </div>
              <p className="text-base text-zinc-300 mb-8 flex-1 leading-relaxed font-serif italic">"{review.text}"</p>
              <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                <div className="w-12 h-12 bg-zinc-900 border border-yellow-500/30 flex items-center justify-center text-sm font-serif font-bold text-yellow-500">
                  {review.initials}
                </div>
                <div>
                  <div className="font-bold text-sm tracking-wide text-white uppercase">{review.name}</div>
                  <div className="text-xs text-zinc-500">{review.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ & Contact Section */}
      <section id="faq" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <span className="text-yellow-500 text-xs font-bold tracking-[0.2em] uppercase mb-4 block">Inquiries</span>
            <h2 className="font-serif text-4xl font-bold tracking-tight text-white mb-10">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                { q: 'What areas do you service?', a: 'We provide exclusive coverage across Korba. Premium outbound services can be arranged upon special request.' },
                { q: 'Do I need to provide water or electricity?', a: 'For premium detailing, access to a standard power source is appreciated. We bring our own purified water reserves and cutting-edge equipment.' },
                { q: 'Are your cleaning products safe?', a: 'We exclusively use pH-neutral, environmentally conscious detailing products sourced globally to protect your investments.' },
                { q: 'How does the membership work?', a: 'Members enjoy automated scheduling, dedicated detailers, and preferential pricing. Billed seamlessly at the start of each month.' }
              ].map((faq, i) => (
                <div key={i} className="p-6 border-b border-white/10">
                  <h3 className="text-lg font-serif font-bold text-white mb-3">{faq.q}</h3>
                  <p className="text-sm text-zinc-400 font-light leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div id="contact" className="glass-panel p-10 border border-yellow-500/20">
             <span className="text-yellow-500 text-xs font-bold tracking-[0.2em] uppercase mb-4 block">Visit Us</span>
             <h2 className="font-serif text-4xl font-bold tracking-tight text-white mb-8">Headquarters</h2>
             
             <div className="space-y-6 mb-10">
                <div className="flex items-start gap-4">
                   <div className="text-yellow-500 text-xl mt-1">📍</div>
                   <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-1">Location</h4>
                      <p className="text-zinc-400 font-light text-sm">Korba, Chhattisgarh</p>
                   </div>
                </div>
                <div className="flex items-start gap-4">
                   <div className="text-yellow-500 text-xl mt-1">📞</div>
                   <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-1">Direct Line</h4>
                      <p className="text-zinc-400 font-light text-sm">9522000118</p>
                   </div>
                </div>
                <div className="flex items-start gap-4">
                   <div className="text-yellow-500 text-xl mt-1">🕒</div>
                   <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-1">Service Hours</h4>
                      <p className="text-zinc-400 font-light text-sm">Mon - Sun: 8:00 AM - 8:00 PM</p>
                   </div>
                </div>
             </div>

             <div className="w-full h-64 border border-white/10 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
               <iframe 
                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d118228.31885626297!2d82.63935279612086!3d22.35925345719918!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a278e3c4e40292b%3A0xc47e30d17042cb39!2sKorba%2C%20Chhattisgarh!5e0!3m2!1sen!2sin!4v1709823456789!5m2!1sen!2sin"  
                 width="100%" 
                 height="100%" 
                 style={{ border: 0 }} 
                 allowFullScreen 
                 loading="lazy" 
                 referrerPolicy="no-referrer-when-downgrade"
                 title="Google Maps Location"
               ></iframe>
             </div>
          </div>
        </div>
      </section>

    </div>
  );
}

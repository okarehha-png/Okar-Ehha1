import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Star, ShieldCheck, Check, Car, Bike, Sofa, Droplets, Home, Sparkles, Sun } from "lucide-react";
import { servicesData } from "../data/services";
import { motion } from "motion/react";
import { Helmet } from "react-helmet-async";
import carWashImg from "../assets/images/man_washing_car_1787638514237.jpg";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const popularServices = [
    "sofa-cleaning",
    "home-cleaning",
    "car-wash",
    "water-tank-cleaning"
  ];

  const steps = [
    { title: "Select Service", desc: "Choose from our wide range of professional cleaning services." },
    { title: "Pick a Time", desc: "Select a date and time that fits your schedule perfectly." },
    { title: "We Deliver", desc: "Our trained experts arrive and complete the job to perfection." },
    { title: "Pay Securely", desc: "Pay only after the service is done to your satisfaction." },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <Helmet>
        <title>Okar Ehha | Premium Car Wash & Doorstep Cleaning Services</title>
        <meta name="description" content="Okar Ehha provides premium doorstep car wash, interior cleaning, polishing and home cleaning services in Korba. Professional service at your doorstep. Services starting from ₹99." />
        <meta property="og:title" content="Okar Ehha | Premium Car Wash & Doorstep Cleaning Services" />
        <meta property="og:description" content="Okar Ehha provides premium doorstep car wash, interior cleaning, polishing and home cleaning services in Korba. Professional service at your doorstep. Services starting from ₹99." />
      </Helmet>
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-6"
            >
              Home services, on demand.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Professional doorstep cleaning services in Korba. Fast, reliable, and hassle-free.
            </motion.p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 overflow-hidden">
              <form onSubmit={handleSearch} className="flex items-center h-14 md:h-16">
                <div className="pl-5 text-gray-400">
                  <Search className="w-5 h-5" />
                </div>
                <input 
                  type="text" 
                  placeholder="Search for 'Sofa Cleaning', 'Car Wash' etc." 
                  className="w-full h-full px-4 text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="h-full bg-black text-white px-6 md:px-8 font-bold text-sm hover:bg-gray-800 transition-colors">
                  Search
                </button>
              </form>
            </div>
          </div>

          {/* Service Grid - Overlapping/Right below search */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-6 max-w-5xl mx-auto mt-16">
            {Object.values(servicesData).slice(0, 5).map((service) => (
              <Link 
                key={service.id} 
                to={`/services/${service.slug}`}
                className="flex flex-col items-center justify-center p-3 md:p-5 rounded-2xl hover:bg-gray-50 transition-colors group"
              >
                <div className="w-16 h-16 md:w-24 md:h-24 bg-gray-50 border-2 border-transparent rounded-2xl flex items-center justify-center mb-3 group-hover:border-black/5 group-hover:shadow-lg transition-all overflow-hidden relative shadow-sm">
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                </div>
                <span className="text-gray-800 text-[11px] md:text-sm font-semibold text-center leading-tight group-hover:text-black">
                  {service.title}
                </span>
              </Link>
            ))}
            <Link 
              to="/services"
              className="flex flex-col items-center justify-center p-3 md:p-5 rounded-2xl hover:bg-gray-50 transition-colors group"
            >
              <div className="w-16 h-16 md:w-24 md:h-24 bg-gray-50 border-2 border-transparent rounded-2xl flex items-center justify-center mb-3 group-hover:border-black/5 group-hover:shadow-lg transition-all text-gray-500 bg-white shadow-sm">
                <Search className="w-6 h-6 md:w-8 md:h-8 group-hover:scale-110 transition-transform duration-500 text-gray-400 group-hover:text-black" />
              </div>
              <span className="text-gray-800 text-[11px] md:text-sm font-semibold text-center leading-tight group-hover:text-black">
                View All
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
            <div className="flex-1 w-full relative">
              <img 
                src={carWashImg} 
                alt="Professional Cleaning"
                className="w-full aspect-[4/3] object-cover rounded-3xl"
              />
              <div className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
                <ShieldCheck className="text-green-600 w-5 h-5" />
                <span className="font-bold text-gray-900 text-sm">Verified Professionals</span>
              </div>
            </div>
            <div className="flex-1 w-full">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Quality services, guaranteed.</h2>
              <div className="space-y-6">
                {[
                  { title: "Transparent Pricing", desc: "See fixed prices before you book. No hidden charges." },
                  { title: "Experts Only", desc: "Our professionals are well-trained and background-checked." },
                  { title: "Fully Equipped", desc: "We bring everything needed, from chemicals to machines." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Popular Services</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularServices.map((id) => {
              const service = servicesData[id];
              if(!service) return null;
              
              return (
                <div key={id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-white text-gray-900 text-xs font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" /> 
                      {service.rating}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col h-[180px]">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{service.title}</h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{service.shortDescription}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Starts at</span>
                        <span className="font-bold text-gray-900">₹{service.startingPrice}</span>
                      </div>
                      <Link 
                        to={`/services/${service.slug}`}
                        className="bg-white text-gray-900 border border-gray-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
                      >
                        Book
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Trusted by people in Korba</h2>
            <p className="text-gray-600">See what our customers have to say about our services.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Rahul Sharma",
                location: "TP Nagar, Korba",
                review: "Booked sofa cleaning and the results were amazing! The team arrived on time and removed all the tough stains. Very professional service.",
              },
              {
                name: "Priya Singh",
                location: "Niharika, Korba",
                review: "Highly recommend Okar Ehha for water tank cleaning. The process was transparent, and the water is visibly much cleaner now.",
              },
              {
                name: "Amit Patel",
                location: "Darri, Korba",
                review: "Best car wash service I have experienced in Korba. They cleaned the interior and exterior to perfection right at my doorstep.",
              }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-gray-50 p-8 rounded-2xl border border-gray-100 relative">
                <div className="flex items-center gap-1 mb-4 text-yellow-500">
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.review}"</p>
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-12">How it works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gray-50 text-gray-900 flex items-center justify-center text-xl font-bold mb-4 shadow-sm border border-gray-100">
                  {idx + 1}
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600 px-4 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

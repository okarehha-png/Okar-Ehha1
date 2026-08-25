import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { servicesData } from "../data/services";
import { Star, Search, Filter } from "lucide-react";

export default function ServicesPage() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = ["all", "cleaning", "maintenance", "specialized"];

  const filteredServices = Object.values(servicesData).filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         service.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesCategory = true;
    if (activeCategory !== "all") {
      if (activeCategory === "cleaning" && !service.id.includes("cleaning") && !service.id.includes("wash")) matchesCategory = false;
      if (activeCategory === "maintenance" && (service.id.includes("cleaning") || service.id.includes("wash"))) matchesCategory = false;
    }
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Services</h1>
          
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text"
                placeholder="Search for services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-900 transition-all"
              />
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
              <div className="flex items-center gap-2 px-3 py-2 text-gray-500">
                <Filter className="w-4 h-4" />
                <span className="text-sm font-semibold">Filter:</span>
              </div>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap capitalize transition-colors ${
                    activeCategory === cat 
                      ? 'bg-black text-white' 
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredServices.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-5xl mb-4 opacity-50">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filters.</p>
            <button 
              onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}
              className="text-black font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredServices.map((service) => (
              <div key={service.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow group flex flex-col">
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white text-gray-900 text-xs font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" /> 
                    {service.rating} ({service.reviews})
                  </div>
                </div>
                
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">{service.shortDescription}</p>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Starts at</span>
                      <span className="font-bold text-gray-900 text-base">₹{service.startingPrice}</span>
                    </div>
                    <Link 
                      to={`/services/${service.slug}`}
                      className="bg-white text-gray-900 border border-gray-200 px-5 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

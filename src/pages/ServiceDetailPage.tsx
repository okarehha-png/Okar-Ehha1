import { useParams, Link, Navigate } from "react-router-dom";
import { servicesData } from "../data/services";
import { CheckCircle2, ShieldCheck, Clock, MapPin } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function ServiceDetailPage({ serviceSlug }: { serviceSlug?: string }) {
  const { slug: paramSlug } = useParams<{ slug: string }>();
  const slug = serviceSlug || paramSlug;
  const service = slug ? servicesData[slug] : null;

  if (!service) {
    return <Navigate to="/services" replace />;
  }
  
  // Use custom SEO data if available, fallback to defaults
  const seoTitle = service.seoTitle || `${service.title} in Korba | Okar Ehha`;
  const seoDescription = service.seoDescription || service.fullDescription;
  const canonicalUrl = `https://okarehha.in/${service.slug}`;

  return (
    <div className="bg-white min-h-screen pb-24">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>
      
      {/* Hero Section */}
      <div className="relative bg-white pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden border-b border-gray-200">
        <div className="absolute inset-0 opacity-40">
          <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/90 to-white/40" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-gray-900 z-10">
          <Link to="/services" className="text-gray-500 hover:text-black text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 mb-8 inline-block transition-colors">
            ← Back to Services
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <span className="bg-black text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">Top Rated</span>
            <span className="flex items-center gap-1 text-[11px] font-bold text-gray-600 uppercase tracking-widest bg-gray-50 border border-gray-200 px-3 py-1 rounded-full">
              <span className="text-black">★</span>
              {service.rating} ({service.reviews} reviews)
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-[54px] font-extrabold mb-6 leading-tight">{service.title}</h1>
          <p className="text-sm md:text-base text-gray-500 max-w-2xl mb-10 leading-relaxed">{service.fullDescription}</p>

          <Link 
            to={`/book/${service.slug}`}
            className="inline-flex bg-white border border-gray-200 text-gray-900 px-8 py-3.5 rounded-lg font-bold hover:border-black hover:text-black transition-colors text-sm uppercase tracking-wider shadow-lg"
          >
            Book Now
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Packages */}
            <div className="bg-gray-50 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-8">Select Package</h2>
              <div className="space-y-6">
                {service.packages.map((pkg) => (
                  <div key={pkg.id} className="border border-gray-100 bg-gray-50 rounded-xl p-6 hover:border-black transition-colors relative overflow-hidden group">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                        {pkg.price > 0 ? (
                          <div className="text-2xl font-black text-black">₹{pkg.price}</div>
                        ) : (
                          <div className="text-lg font-bold text-black uppercase tracking-wider">{pkg.description}</div>
                        )}
                      </div>
                      <Link 
                        to={`/book/${service.slug}?pkg=${pkg.id}`}
                        className="bg-white text-gray-900 border border-gray-200 px-8 py-3 rounded-lg font-bold text-xs uppercase tracking-widest hover:border-black hover:text-black transition-all text-center shrink-0"
                      >
                        Select
                      </Link>
                    </div>

                    <div className="bg-white -mx-6 -mb-6 px-6 py-5 border-t border-gray-100">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">What's included</p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                        {pkg.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-sm text-gray-500 font-medium">
                            <CheckCircle2 className="w-4 h-4 text-black shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs */}
            {service.faqs && service.faqs.length > 0 && (
              <div className="bg-gray-50 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-8">Frequently Asked Questions</h2>
                <div className="space-y-6">
                  {service.faqs.map((faq, idx) => (
                    <div key={idx} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                      <h4 className="text-base font-bold text-gray-900 mb-3">{faq.question}</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Why choose us?</h3>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <ShieldCheck className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm mb-1">Verified Professionals</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">Background checked and trained experts.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <Clock className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm mb-1">On-time Service</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">We value your time and arrive promptly.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <MapPin className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm mb-1">Doorstep Convenience</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">Service delivered right at your location.</p>
                  </div>
                </li>
              </ul>
              
              <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 text-center">Need help deciding?</p>
                <a href="tel:+919522000118" className="w-full flex justify-center bg-gray-50 text-gray-900 py-3.5 rounded-lg font-bold border border-gray-200 hover:border-black hover:text-black transition-colors text-xs uppercase tracking-wider">
                  Call Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

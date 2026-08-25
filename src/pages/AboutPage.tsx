import { ShieldCheck, Target, HeartHandshake, Zap } from "lucide-react";

export default function AboutPage() {
  const values = [
    { icon: Target, title: "Mission Driven", desc: "Our mission is to provide the most reliable and premium home cleaning services in Korba." },
    { icon: HeartHandshake, title: "Customer First", desc: "Your satisfaction is our priority. We listen, adapt, and deliver exactly what you need." },
    { icon: ShieldCheck, title: "Trusted Experts", desc: "Our team consists of background-verified, highly trained professionals." },
    { icon: Zap, title: "Fast & Convenient", desc: "From easy booking to timely doorstep service, we value your time." }
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Hero */}
      <div className="bg-white text-gray-900 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About <span className="text-black">Okar Ehha</span></h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            We are Korba's premier doorstep cleaning service, bringing professional, reliable, and convenient solutions right to your home.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold text-black mb-6">Redefining Home Services in Korba</h2>
            <div className="space-y-4 text-gray-500 leading-relaxed text-lg">
              <p>
                Okar Ehha was founded with a simple goal: to take the hassle out of cleaning. Whether it's your car, sofa, water tank, or entire home, we believe that maintaining a clean environment shouldn't require you to sacrifice your weekend.
              </p>
              <p>
                We bring industrial-grade equipment, premium eco-friendly chemicals, and a team of trained professionals directly to your doorstep. No more waiting at service stations or dealing with unreliable local cleaners.
              </p>
              <p>
                With transparent pricing, easy online booking, and a commitment to absolute customer satisfaction, Okar Ehha is your trusted partner for all deep cleaning needs.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-black rounded-3xl translate-x-4 translate-y-4 -z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="Professional Cleaning Team" 
              className="rounded-3xl shadow-xl w-full h-[400px] object-cover"
            />
          </div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-black mb-4">Our Core Values</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-xl font-bold text-black mb-3">{val.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{val.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

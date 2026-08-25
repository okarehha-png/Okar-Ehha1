import { useState } from "react";
import type { FormEvent } from "react";
import { Search, CheckCircle2, Circle } from "lucide-react";

export default function TrackingPage() {
  const [trackingId, setTrackingId] = useState("");
  const [booking, setBooking] = useState<any>(null);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setHasSearched(true);
    const stored = localStorage.getItem('okar_bookings');
    if (stored) {
      const bookings = JSON.parse(stored);
      const found = bookings.find((b: any) => b.id.toUpperCase() === trackingId.trim().toUpperCase());
      if (found) {
        setBooking(found);
        setError("");
      } else {
        setBooking(null);
        setError("No booking found with this ID.");
      }
    } else {
      setBooking(null);
      setError("No booking found with this ID.");
    }
  };

  const timelineSteps = [
    { status: "Received", title: "Booking Received", desc: "We have received your request." },
    { status: "Confirmed", title: "Booking Confirmed", desc: "Your slot is confirmed." },
    { status: "Assigned", title: "Professional Assigned", desc: "An expert has been assigned." },
    { status: "On The Way", title: "On The Way", desc: "The expert is heading to your location." },
    { status: "Started", title: "Service Started", desc: "Work is currently in progress." },
    { status: "Completed", title: "Service Completed", desc: "Thank you for choosing Okar Ehha!" }
  ];

  const getStepIndex = (status: string) => {
    const idx = timelineSteps.findIndex(s => s.status === status);
    return idx === -1 ? 0 : idx;
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-12 pb-24 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Track Your Booking</h1>
          <p className="text-gray-500 mb-8">Enter your Booking ID (e.g., OE-2026-1234) to see the current status.</p>
          
          <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                value={trackingId}
                onChange={e => setTrackingId(e.target.value)}
                placeholder="Enter Booking ID"
                className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#050505] focus:border-transparent outline-none uppercase"
              />
            </div>
            <button
              type="submit"
              className="bg-white text-gray-900 px-6 py-4 rounded-xl font-bold hover:bg-black hover:text-white transition-colors whitespace-nowrap"
            >
              Track
            </button>
          </form>
        </div>

        {hasSearched && error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center font-medium border border-red-100">
            {error}
          </div>
        )}

        {hasSearched && booking && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{booking.serviceName}</h3>
                <p className="text-gray-500 text-sm mt-1">{booking.date} at {booking.time}</p>
              </div>
              <div className="bg-gray-100 px-3 py-1 rounded-lg">
                <p className="text-xs text-gray-500 uppercase font-semibold">ID</p>
                <p className="font-bold text-black">{booking.id}</p>
              </div>
            </div>

            <div className="relative pl-4">
              <div className="absolute left-[23px] top-4 bottom-4 w-0.5 bg-gray-200" />
              
              {timelineSteps.map((step, idx) => {
                const currentIndex = getStepIndex(booking.status || 'Received');
                const isCompleted = idx <= currentIndex;
                const isCurrent = idx === currentIndex;
                
                return (
                  <div key={idx} className={`relative z-10 flex gap-6 mb-8 last:mb-0 ${isCompleted ? 'opacity-100' : 'opacity-40'}`}>
                    <div className="bg-white py-1">
                      {isCompleted ? (
                        <CheckCircle2 className={`w-6 h-6 ${isCurrent ? 'text-black' : 'text-gray-200'}`} />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <h4 className={`font-bold ${isCurrent ? 'text-black' : 'text-gray-900'}`}>{step.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

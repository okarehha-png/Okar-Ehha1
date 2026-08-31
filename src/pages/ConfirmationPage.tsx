import { useParams, Link, Navigate } from "react-router-dom";
import { CheckCircle2, MessageCircle, MapPin, Calendar, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { bookingService } from "../services/bookingService";

export default function ConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      if (id) {
        const found = await bookingService.getBookingDetails(id);
        if (found) {
          setBooking(found);
        } else {
          // Fallback to local storage if not found in Firebase (for backward compatibility if needed)
          const stored = localStorage.getItem('okar_bookings');
          if (stored) {
            const bookings = JSON.parse(stored);
            const localFound = bookings.find((b: any) => b.id === id);
            if (localFound) setBooking(localFound);
          }
        }
      }
      setLoading(false);
    };
    
    fetchBooking();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!booking) return <Navigate to="/" replace />;

  const whatsappMessage = encodeURIComponent(
    `Hi Okar Ehha, I just booked a service. Here are the details:\n\nBooking ID: ${booking.id}\nService: ${booking.serviceName} (${booking.packageName})\nName: ${booking.fullName}\nDate: ${booking.date}\nTime: ${booking.time}\nAmount: ₹${booking.amount}`
  );

  return (
    <div className="bg-gray-50 min-h-screen pt-12 pb-24 px-4 sm:px-6">
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 text-center">
          
          <div className="bg-white p-8 text-gray-900 relative">
            <div className="w-20 h-20 bg-[#25D366] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(37,211,102,0.4)]">
              <CheckCircle2 className="w-10 h-10 text-gray-900" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Booking Confirmed!</h1>
            <p className="text-gray-600">Your appointment has been successfully scheduled.</p>
          </div>

          <div className="p-8">
            <div className="inline-block bg-gray-100 rounded-lg px-4 py-2 mb-8">
              <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-0.5">Booking ID</p>
              <p className="text-xl font-bold tracking-widest text-black">{booking.id}</p>
            </div>

            <div className="text-left space-y-4 mb-8">
              <div className="border-b border-gray-100 pb-4">
                <p className="text-sm text-gray-500 mb-1">Service</p>
                <p className="font-semibold text-gray-900">{booking.serviceName}</p>
                <p className="text-sm text-gray-500">{booking.packageName}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1 flex items-center gap-1"><Calendar className="w-4 h-4"/> Date</p>
                  <p className="font-semibold text-gray-900">{new Date(booking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1 flex items-center gap-1"><Clock className="w-4 h-4"/> Time</p>
                  <p className="font-semibold text-gray-900">{booking.time}</p>
                </div>
              </div>

              <div className="border-b border-gray-100 pb-4">
                <p className="text-sm text-gray-500 mb-1 flex items-center gap-1"><MapPin className="w-4 h-4"/> Address</p>
                <p className="font-medium text-gray-900">{booking.address}</p>
              </div>

              {booking.amount > 0 && (
                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                  <span className="font-semibold text-gray-600">Estimated Total</span>
                  <span className="font-bold text-xl text-black">₹{booking.amount}</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <a 
                href={`https://wa.me/919522000118?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-gray-900 py-4 rounded-xl font-bold shadow-sm hover:bg-[#20bd5a] transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Send Details via WhatsApp
              </a>
              <div className="grid grid-cols-2 gap-3">
                <Link to="/track" className="w-full bg-gray-100 text-gray-900 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
                  Track Status
                </Link>
                <Link to="/" className="w-full bg-white border-2 border-gray-200 text-gray-900 py-3 rounded-xl font-semibold hover:border-gray-300 transition-colors">
                  Back to Home
                </Link>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

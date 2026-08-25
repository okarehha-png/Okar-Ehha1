import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export default function ContactPage() {
  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      <div className="bg-white text-gray-900 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl text-gray-600">
            Have a question or need assistance? We're here to help.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
              <div className="bg-black/10 p-3 rounded-full shrink-0">
                <Phone className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Phone / WhatsApp</h3>
                <a href="tel:+919522000118" className="text-gray-500 hover:text-black block">+91 9522000118</a>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
              <div className="bg-black/10 p-3 rounded-full shrink-0">
                <MapPin className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Office Location</h3>
                <p className="text-gray-500">Korba, Chhattisgarh, India</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
              <div className="bg-black/10 p-3 rounded-full shrink-0">
                <Mail className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Email</h3>
                <a href="mailto:okarehha@gmail.com" className="text-gray-500 hover:text-black">okarehha@gmail.com</a>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
              <div className="bg-black/10 p-3 rounded-full shrink-0">
                <Clock className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Working Hours</h3>
                <p className="text-gray-500">Mon - Sun: 9:00 AM - 7:00 PM</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                  <input type="text" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#050505] outline-none" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
                  <input type="tel" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#050505] outline-none" placeholder="Your phone number" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Subject</label>
                <input type="text" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#050505] outline-none" placeholder="How can we help?" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Message</label>
                <textarea rows={4} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#050505] outline-none" placeholder="Your message here..."></textarea>
              </div>
              <div className="flex gap-4 items-center">
                <button type="submit" className="bg-white text-gray-900 px-8 py-4 rounded-xl font-bold hover:bg-black hover:text-white transition-colors">
                  Send Message
                </button>
                <span className="text-sm text-gray-500">or</span>
                <Link to="/book" className="text-black font-bold hover:underline">Book a Service directly</Link>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

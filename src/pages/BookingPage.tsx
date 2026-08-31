import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { servicesData } from "../data/services";
import { ChevronRight, ArrowLeft, CheckCircle2, Car, Bike, Sofa, Droplets, Home, Sparkles, Sun } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { bookingService } from "../services/bookingService";

type BookingData = {
  serviceId: string;
  packageId: string;
  date: string;
  time: string;
  fullName: string;
  mobile: string;
  email: string;
  address: string;
  areaZone?: string;
  vehicleNumber?: string;
  landmark: string;
  notes: string;
};

export default function BookingPage() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialPackageId = queryParams.get("pkg") || "";

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<BookingData>({
    serviceId: slug || "",
    packageId: initialPackageId,
    date: "",
    time: "",
    fullName: "",
    mobile: "",
    email: "",
    address: "",
    landmark: "",
    notes: "",
  });

  const selectedService = formData.serviceId ? Object.values(servicesData).find(s => s.slug === formData.serviceId || s.id === formData.serviceId) : null;
  const selectedPackage = selectedService?.packages.find(p => p.id === formData.packageId);

  // If slug is missing, ensure we're at step 1
  useEffect(() => {
    if (!slug) {
      setStep(1);
    } else if (slug && !initialPackageId) {
      setStep(2);
      setFormData(prev => ({ ...prev, serviceId: slug }));
    } else if (slug && initialPackageId) {
      setStep(3);
      setFormData(prev => ({ ...prev, serviceId: slug, packageId: initialPackageId }));
    }
  }, [slug, initialPackageId]);

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const response = await bookingService.createBooking({
      ...formData,
      amount: selectedPackage?.price || 0,
      serviceName: selectedService?.title || '',
      packageName: selectedPackage?.name || ''
    });

    if (response.success) {
      const whatsappMessage = encodeURIComponent(
        `Hi Okar Ehha, I just booked a service. Here are the details:\n\nBooking ID: ${response.bookingId}\nService: ${selectedService?.title} (${selectedPackage?.name})\nName: ${formData.fullName}\nMobile: ${formData.mobile}\nAddress: ${formData.address}\nDate: ${formData.date}\nTime: ${formData.time}\nAmount: ₹${selectedPackage?.price || 0}`
      );
      // Auto-open WhatsApp in a new tab
      window.open(`https://wa.me/919522000118?text=${whatsappMessage}`, '_blank');
      
      // Navigate to confirmation page
      navigate(`/confirmation/${response.bookingId}`);
    }
  };

  const updateForm = (field: keyof BookingData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateDates = () => {
    const dates = [];
    for (let i = 1; i <= 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push(d);
    }
    return dates;
  };

  const timeSlots = ["09:00 AM", "11:00 AM", "01:00 PM", "03:00 PM", "05:00 PM"];

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      <div className="bg-white border-b border-gray-200 sticky top-[72px] md:top-[80px] z-30 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-5 flex items-center">
          {step > 1 && (
            <button onClick={handleBack} className="mr-4 p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-900" />
            </button>
          )}
          <div className="flex-grow">
            <h1 className="text-sm font-black text-gray-900 uppercase tracking-wider">
              {step === 1 && "Select Service"}
              {step === 2 && "Select Package"}
              {step === 3 && "Date & Time"}
              {step === 4 && "Your Details"}
              {step === 5 && "Review Booking"}
            </h1>
            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Step {step} of 5</div>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className={`h-1.5 w-6 rounded-full transition-colors duration-300 ${i <= step ? 'bg-black' : 'bg-gray-200'}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        
        {/* Step 1: Select Service */}
        {step === 1 && (
          <div className="space-y-4">
            {Object.values(servicesData).map(service => (
              <button
                key={service.id}
                onClick={() => {
                  updateForm("serviceId", service.id);
                  handleNext();
                }}
                className="w-full text-left bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-black transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center text-gray-600 group-hover:bg-gray-100 group-hover:text-white transition-colors">
                    {service.id === 'car-wash' && <Car className="w-6 h-6" />}
                    {service.id === 'bike-wash' && <Bike className="w-6 h-6" />}
                    {service.id === 'sofa-cleaning' && <Sofa className="w-6 h-6" />}
                    {service.id === 'water-tank-cleaning' && <Droplets className="w-6 h-6" />}
                    {service.id === 'home-cleaning' && <Home className="w-6 h-6" />}
                    {service.id === 'carpet-cleaning' && <Sparkles className="w-6 h-6" />}
                    {service.id === 'solar-panel-cleaning' && <Sun className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-gray-900 text-lg">{service.title}</h3>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mt-1">From ₹{service.startingPrice}</p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-black transition-colors">
                  <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-gray-900" />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Select Package */}
        {step === 2 && selectedService && (
          <div className="space-y-4">
            {selectedService.packages.map(pkg => (
              <div
                key={pkg.id}
                className={`bg-white p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                  formData.packageId === pkg.id ? 'border-[#050505] shadow-md' : 'border-transparent border-gray-100 shadow-sm hover:border-black'
                }`}
                onClick={() => updateForm("packageId", pkg.id)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-extrabold text-gray-900 text-xl mb-1">{pkg.name}</h3>
                    {pkg.price > 0 ? (
                       <p className="font-black text-lg text-black">₹{pkg.price}</p>
                    ) : (
                       <p className="font-bold text-gray-500 text-sm uppercase tracking-wider">{pkg.description}</p>
                    )}
                  </div>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                    formData.packageId === pkg.id ? 'border-[#050505] bg-black' : 'border-gray-200'
                  }`}>
                    {formData.packageId === pkg.id && <CheckCircle2 className="w-5 h-5 text-black" />}
                  </div>
                </div>
                <div className="text-sm text-gray-500 bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {pkg.features.slice(0, 4).map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs font-medium text-gray-500">
                        <div className="w-1.5 h-1.5 rounded-full bg-black" />
                        {f}
                      </li>
                    ))}
                    {pkg.features.length > 4 && (
                      <li className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1 ml-3.5">+ {pkg.features.length - 4} more</li>
                    )}
                  </ul>
                </div>
              </div>
            ))}
            <div className="mt-8">
              <button
                onClick={handleNext}
                disabled={!formData.packageId}
                className="w-full bg-black text-white py-4 rounded-xl font-bold text-sm uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black hover:text-white transition-colors shadow-lg"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Date & Time */}
        {step === 3 && (
          <div className="space-y-8 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
            <div>
              <h3 className="font-extrabold text-gray-900 text-lg mb-4">Select Date</h3>
              <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x">
                {generateDates().map((date, i) => {
                  const dateStr = date.toISOString().split('T')[0];
                  const isSelected = formData.date === dateStr;
                  return (
                    <button
                      key={i}
                      onClick={() => updateForm("date", dateStr)}
                      className={`snap-start shrink-0 w-24 py-4 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${
                        isSelected ? 'bg-black border-black text-white shadow-md' : 'bg-gray-50 border-transparent hover:border-black'
                      }`}
                    >
                      <span className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isSelected ? 'text-gray-600' : 'text-gray-500'}`}>
                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </span>
                      <span className={`text-2xl font-black ${isSelected ? 'text-gray-900' : 'text-gray-900'}`}>
                        {date.getDate()}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${isSelected ? 'text-black' : 'text-gray-500'}`}>
                        {date.toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="font-extrabold text-gray-900 text-lg mb-4">Select Time Slot</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {timeSlots.map(time => (
                  <button
                    key={time}
                    onClick={() => updateForm("time", time)}
                    className={`py-3.5 px-2 rounded-xl border-2 font-bold text-xs uppercase tracking-widest transition-all ${
                      formData.time === time ? 'bg-black border-black text-white shadow-md' : 'bg-gray-50 border-transparent text-gray-500 hover:border-black hover:text-gray-900'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleNext}
              disabled={!formData.date || !formData.time}
              className="w-full bg-black text-white py-4 rounded-xl font-bold text-sm uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black hover:text-white transition-colors shadow-lg mt-8"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 4: Details */}
        {step === 4 && (
          <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Full Name *</label>
              <input
                required
                type="text"
                value={formData.fullName}
                onChange={e => updateForm("fullName", e.target.value)}
                className="w-full p-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-[#050505] outline-none transition-all font-medium text-sm text-gray-900"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Mobile Number *</label>
              <input
                required
                type="tel"
                value={formData.mobile}
                onChange={e => updateForm("mobile", e.target.value)}
                className="w-full p-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-[#050505] outline-none transition-all font-medium text-sm text-gray-900"
                placeholder="+91 9876543210"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Email (Optional)</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => updateForm("email", e.target.value)}
                className="w-full p-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-[#050505] outline-none transition-all font-medium text-sm text-gray-900"
                placeholder="john@example.com"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Korba Service Zone / Area *</label>
                <select
                  value={formData.areaZone || "Kosabadi"}
                  onChange={e => updateForm("areaZone", e.target.value)}
                  className="w-full p-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-[#050505] outline-none transition-all font-bold text-sm text-gray-900 cursor-pointer"
                >
                  <option value="Kosabadi">Kosabadi / Surya Apt</option>
                  <option value="Transport Nagar">Transport Nagar</option>
                  <option value="Balco Colony">Balco Township & Colony</option>
                  <option value="NTPC Township">NTPC Township & Jamnipali</option>
                  <option value="Kusmunda">Kusmunda / Gevra</option>
                  <option value="Darri">Darri Barrage Colony</option>
                  <option value="Rajgamar">Rajgamar Road</option>
                  <option value="Budhwari">Budhwari & Rampur</option>
                  <option value="Other Korba Area">Other Korba Locality</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Vehicle No. / Item Model (Optional)</label>
                <input
                  type="text"
                  value={formData.vehicleNumber || ""}
                  onChange={e => updateForm("vehicleNumber", e.target.value)}
                  className="w-full p-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-[#050505] outline-none transition-all font-medium text-sm text-gray-900 uppercase"
                  placeholder="e.g. CG 12 BD 4501"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Complete Address *</label>
              <textarea
                required
                value={formData.address}
                onChange={e => updateForm("address", e.target.value)}
                className="w-full p-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-[#050505] outline-none transition-all font-medium text-sm text-gray-900 min-h-[100px] resize-y"
                placeholder="House No, Street, Locality, Korba"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Landmark (Optional)</label>
              <input
                type="text"
                value={formData.landmark}
                onChange={e => updateForm("landmark", e.target.value)}
                className="w-full p-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-[#050505] outline-none transition-all font-medium text-sm text-gray-900"
                placeholder="Near City Mall"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Additional Notes (Optional)</label>
              <input
                type="text"
                value={formData.notes}
                onChange={e => updateForm("notes", e.target.value)}
                className="w-full p-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-[#050505] outline-none transition-all font-medium text-sm text-gray-900"
                placeholder="Any specific instructions for the team"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-4 rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-black hover:text-white transition-colors mt-6 shadow-lg"
            >
              Review Booking
            </button>
          </form>
        )}

        {/* Step 5: Review */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-extrabold text-gray-900 text-xl mb-6 pb-4 border-b border-gray-100">Booking Summary</h3>
              
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Service</p>
                    <p className="font-bold text-gray-900 text-lg leading-tight">{selectedService?.title}</p>
                    <p className="text-sm font-medium text-gray-500 mt-1">{selectedPackage?.name}</p>
                  </div>
                  {selectedPackage && selectedPackage.price > 0 && (
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Amount</p>
                      <p className="font-black text-black text-xl">₹{selectedPackage.price}</p>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-gray-100 grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Date</p>
                    <p className="font-bold text-gray-900">{new Date(formData.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Time</p>
                    <p className="font-bold text-gray-900">{formData.time}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Customer Details</p>
                  <p className="font-bold text-gray-900">{formData.fullName}</p>
                  <p className="text-gray-500 text-sm font-medium mt-1">{formData.mobile}</p>
                  <p className="text-gray-500 text-sm font-medium mt-1 leading-relaxed">{formData.address}</p>
                  {formData.landmark && <p className="text-gray-500 text-xs font-medium mt-1">Landmark: {formData.landmark}</p>}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 flex items-start gap-4">
              <CheckCircle2 className="w-5 h-5 text-black shrink-0 mt-0.5" />
              <p className="text-sm text-gray-600 font-medium leading-relaxed">
                Payment is collected after the service is completed to your satisfaction. Our team will contact you to confirm the appointment.
              </p>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-black border border-gray-200 text-white py-4.5 rounded-xl font-bold text-sm uppercase tracking-widest shadow-xl hover:border-black hover:text-white transition-colors"
            >
              CONFIRM BOOKING
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

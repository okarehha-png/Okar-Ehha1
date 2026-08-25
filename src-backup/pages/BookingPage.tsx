import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { SERVICES } from '../data/mockData';
import { CAR_CATEGORIES } from '../data/carsData';
import { WATER_TANK_CATEGORIES } from '../data/waterTankData';
import { HOME_CLEANING_CATEGORIES } from '../data/homeCleaningData';
import { SOFA_CLEANING_CATEGORIES } from '../data/sofaCleaningData';
import { CARPET_CLEANING_CATEGORIES } from '../data/carpetCleaningData';
import { ServiceType, Service } from '../types';
import { formatINR } from '../utils';
import { Check, ChevronRight, MapPin, Calendar as CalendarIcon, Clock, CreditCard } from 'lucide-react';
import { useAppContext } from '../store';

const STEPS = [
  { id: 1, name: 'Service & Plan' },
  { id: 2, name: 'Date & Location' },
  { id: 3, name: 'Checkout' },
];

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addBooking } = useAppContext();
  
  const initialService = (searchParams.get('service') as ServiceType) || 'Car Wash';
  const initialPlan = searchParams.get('plan') || 'One-Time';
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedServiceId, setSelectedServiceId] = useState<ServiceType>(initialService);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [recurring, setRecurring] = useState<string>(initialPlan);
  const [selectedCarCategory, setSelectedCarCategory] = useState<string>('');
  const [selectedCarModel, setSelectedCarModel] = useState<string>('');
  const [selectedTankCapacity, setSelectedTankCapacity] = useState<string>('');
  const [selectedHomeSize, setSelectedHomeSize] = useState<string>('');
  const [selectedSofaType, setSelectedSofaType] = useState<string>('');
  const [selectedCarpetSize, setSelectedCarpetSize] = useState<string>('');
  
  const [details, setDetails] = useState({
    date: '',
    time: '',
    name: '',
    phone: '',
    address: '',
  });

  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const selectedService = useMemo(() => SERVICES.find(s => s.id === selectedServiceId)!, [selectedServiceId]);

  const totalPrice = useMemo(() => {
    let price = selectedService.basePrice;
    if (selectedService.addons) {
      selectedService.addons.forEach(addon => {
        if (selectedAddons.includes(addon.id)) price += addon.price;
      });
    }
    if (recurring === 'Weekly') price = price * 0.9;
    if (recurring === 'Bi-weekly') price = price * 0.85;
    if (recurring === 'Monthly') price = price * 0.8; // 20% off for monthly plans
    return price;
  }, [selectedService, selectedAddons, recurring]);

  const toggleAddon = (addonId: string) => {
    setSelectedAddons(prev => 
      prev.includes(addonId) ? prev.filter(id => id !== addonId) : [...prev, addonId]
    );
  };

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(c => c + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(c => c - 1);
  };

  const generateBookingId = () => `BK-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

  const handlePayment = () => {
    setPaymentProcessing(true);
    const bookingId = generateBookingId();
    // Simulate payment API call
    setTimeout(() => {
      const newBooking = {
        id: bookingId,
        serviceId: selectedServiceId,
        addons: selectedAddons,
        recurring: recurring as any,
        totalPrice,
        date: details.date,
        time: details.time,
        customerName: details.name,
        customerPhone: details.phone,
        address: details.address,
        carCategory: selectedServiceId === 'Car Wash' ? selectedCarCategory : undefined,
        carModel: selectedServiceId === 'Car Wash' ? selectedCarModel : undefined,
        tankCapacity: selectedServiceId === 'Water Tank Cleaning' ? selectedTankCapacity : undefined,
        homeSize: selectedServiceId === 'Home Cleaning' ? selectedHomeSize : undefined,
        sofaType: selectedServiceId === 'Sofa Cleaning' ? selectedSofaType : undefined,
        carpetSize: selectedServiceId === 'Carpet Cleaning' ? selectedCarpetSize : undefined,
        status: 'Pending' as const,
        createdAt: new Date().toISOString(),
        lat: 22.7196 + (Math.random() - 0.5) * 0.05,
        lng: 75.8577 + (Math.random() - 0.5) * 0.05,
      };
      
      addBooking(newBooking);
      setPaymentProcessing(false);
      toast.success('Booking Confirmed!', {
        description: `Your booking ${newBooking.id} has been placed successfully.`
      });
      navigate(`/track/${newBooking.id}`);
    }, 2000);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="font-serif text-3xl font-bold text-white mb-2">Configure Your Service</h1>
        <p className="text-slate-400 text-sm">Professional care, right at your doorstep.</p>
        
        {/* Progress Tracker */}
        <div className="mt-8 px-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -z-10 h-[1px] w-full -translate-y-1/2 bg-slate-800"></div>
            {STEPS.map((step) => {
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              return (
                <div key={step.id} className="flex flex-col items-center bg-[#0a0c10] px-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                    isCompleted ? 'bg-cyan-500 text-[#0a0c10]' :
                    isCurrent ? 'bg-slate-800 border-2 border-cyan-500 text-cyan-400' :
                    'bg-slate-900 border border-slate-800 text-slate-500'
                  }`}>
                    {isCompleted ? <Check className="h-4 w-4" /> : step.id}
                  </div>
                  <span className={`mt-2 text-[10px] uppercase tracking-wider font-bold ${isCurrent ? 'text-cyan-400' : 'text-slate-500'}`}>
                    {step.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 md:p-8 shadow-2xl backdrop-blur-sm">
        {currentStep === 1 && (
          <div className="space-y-10 animate-in fade-in duration-500">
            <div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">1. Select Service</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SERVICES.map(s => (
                  <button
                    key={s.id}
                    onClick={() => { setSelectedServiceId(s.id); setSelectedAddons([]); }}
                    className={`flex items-start p-4 rounded-xl border text-left transition-colors ${
                      selectedServiceId === s.id ? 'border-cyan-500 bg-cyan-500/10' : 'border-slate-800 hover:border-slate-600 bg-[#0a0c10]'
                    }`}
                  >
                    <div className="flex-1">
                      <div className={`font-bold ${selectedServiceId === s.id ? 'text-cyan-400' : 'text-white'}`}>{s.name}</div>
                      <div className="mt-1 text-xs text-slate-400">{formatINR(s.basePrice)}</div>
                    </div>
                    {selectedServiceId === s.id && <div className="text-cyan-400"><Check className="w-5 h-5" /></div>}
                  </button>
                ))}
              </div>
            </div>

            {selectedService.addons && selectedService.addons.length > 0 && (
              <div>
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">2. Customize (Add-ons)</h2>
                <div className="space-y-3">
                  {selectedService.addons.map(addon => {
                    const isSelected = selectedAddons.includes(addon.id);
                    return (
                      <label key={addon.id} className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-colors ${
                        isSelected ? 'border-cyan-500 bg-cyan-500/5' : 'border-slate-800 hover:border-slate-700 bg-[#0a0c10]'
                      }`}>
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleAddon(addon.id)}
                            className="h-5 w-5 rounded border-slate-600 bg-slate-900 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-0"
                          />
                          <span className={`${isSelected ? 'text-white' : 'text-slate-300'} font-medium`}>{addon.name}</span>
                        </div>
                        <span className="text-sm font-mono text-cyan-400">+{formatINR(addon.price)}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedServiceId === 'Car Wash' && (
              <div>
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Vehicle Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">Category</label>
                    <select
                      value={selectedCarCategory}
                      onChange={e => {
                        setSelectedCarCategory(e.target.value);
                        setSelectedCarModel(''); // Reset model when category changes
                      }}
                      className="w-full rounded-xl bg-[#0a0c10] border-slate-800 text-white p-3 border shadow-sm focus:border-cyan-500 focus:ring-cyan-500 outline-none appearance-none"
                    >
                      <option value="">Select Category</option>
                      {CAR_CATEGORIES.map(c => (
                        <option key={c.category} value={c.category}>{c.category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">Car Name / Model</label>
                    <select
                      value={selectedCarModel}
                      onChange={e => setSelectedCarModel(e.target.value)}
                      disabled={!selectedCarCategory}
                      className="w-full rounded-xl bg-[#0a0c10] border-slate-800 text-white p-3 border shadow-sm focus:border-cyan-500 focus:ring-cyan-500 outline-none appearance-none disabled:opacity-50"
                    >
                      <option value="">Select Car Name</option>
                      {selectedCarCategory && CAR_CATEGORIES.find(c => c.category === selectedCarCategory)?.models.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {selectedServiceId === 'Water Tank Cleaning' && (
              <div>
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Tank Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">Capacity</label>
                    <select
                      value={selectedTankCapacity}
                      onChange={e => setSelectedTankCapacity(e.target.value)}
                      className="w-full rounded-xl bg-[#0a0c10] border-slate-800 text-white p-3 border shadow-sm focus:border-cyan-500 focus:ring-cyan-500 outline-none appearance-none"
                    >
                      <option value="">Select Capacity</option>
                      {WATER_TANK_CATEGORIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {selectedServiceId === 'Home Cleaning' && (
              <div>
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Home Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">Size / Type</label>
                    <select
                      value={selectedHomeSize}
                      onChange={e => setSelectedHomeSize(e.target.value)}
                      className="w-full rounded-xl bg-[#0a0c10] border-slate-800 text-white p-3 border shadow-sm focus:border-cyan-500 focus:ring-cyan-500 outline-none appearance-none"
                    >
                      <option value="">Select Size</option>
                      {HOME_CLEANING_CATEGORIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {selectedServiceId === 'Sofa Cleaning' && (
              <div>
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Sofa Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">Type / Size</label>
                    <select
                      value={selectedSofaType}
                      onChange={e => setSelectedSofaType(e.target.value)}
                      className="w-full rounded-xl bg-[#0a0c10] border-slate-800 text-white p-3 border shadow-sm focus:border-cyan-500 focus:ring-cyan-500 outline-none appearance-none"
                    >
                      <option value="">Select Type</option>
                      {SOFA_CLEANING_CATEGORIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {selectedServiceId === 'Carpet Cleaning' && (
              <div>
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Carpet Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">Size</label>
                    <select
                      value={selectedCarpetSize}
                      onChange={e => setSelectedCarpetSize(e.target.value)}
                      className="w-full rounded-xl bg-[#0a0c10] border-slate-800 text-white p-3 border shadow-sm focus:border-cyan-500 focus:ring-cyan-500 outline-none appearance-none"
                    >
                      <option value="">Select Size</option>
                      {CARPET_CLEANING_CATEGORIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div>
              <div className="flex justify-between items-end mb-4">
                 <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">3. Plan Type</h2>
                 {recurring !== 'One-Time' && <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded uppercase tracking-wider font-bold border border-cyan-500/20">Subscription Discount Applied</span>}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { id: 'One-Time', label: 'One-Time', suffix: '' },
                  { id: 'Weekly', label: 'Weekly', suffix: 'Save 10%' },
                  { id: 'Bi-weekly', label: 'Bi-weekly', suffix: 'Save 15%' },
                  { id: 'Monthly', label: 'Monthly', suffix: 'Save 20%' }
                ].map(option => (
                  <button
                    key={option.id}
                    onClick={() => setRecurring(option.id)}
                    className={`flex flex-col items-center justify-center rounded-xl p-3 border transition-colors ${
                      recurring === option.id ? 'bg-cyan-500 border-cyan-500 text-[#0a0c10]' : 'bg-[#0a0c10] border-slate-800 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <span className="font-bold text-sm">{option.label}</span>
                    {option.suffix && <span className={`text-[10px] mt-1 font-bold tracking-wider uppercase ${recurring === option.id ? 'text-black/60' : 'text-cyan-500/80'}`}>{option.suffix}</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Personal Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={details.name}
                    onChange={e => setDetails(d => ({ ...d, name: e.target.value }))}
                    className="w-full rounded-xl bg-[#0a0c10] border-slate-800 text-white p-3 border shadow-sm focus:border-cyan-500 focus:ring-cyan-500 outline-none"
                    placeholder="e.g. Rahul Sharma"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Contact Number</label>
                  <input
                    type="tel"
                    required
                    value={details.phone}
                    onChange={e => setDetails(d => ({ ...d, phone: e.target.value }))}
                    className="w-full rounded-xl bg-[#0a0c10] border-slate-800 text-white p-3 border shadow-sm focus:border-cyan-500 focus:ring-cyan-500 outline-none"
                    placeholder="+91 9522..."
                  />
                </div>
              </div>
            </div>
            
            <div className="h-[1px] w-full bg-slate-800/50"></div>

            <div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2"><MapPin className="w-4 h-4 text-cyan-400"/> Service Location & Schedule</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Date</label>
                  <input
                    type="date"
                    required
                    value={details.date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => setDetails(d => ({ ...d, date: e.target.value }))}
                    className="w-full rounded-xl bg-[#0a0c10] border-slate-800 text-white p-3 border shadow-sm focus:border-cyan-500 focus:ring-cyan-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Arrival Time</label>
                  <input
                    type="time"
                    required
                    value={details.time}
                    onChange={e => setDetails(d => ({ ...d, time: e.target.value }))}
                    className="w-full rounded-xl bg-[#0a0c10] border-slate-800 text-white p-3 border shadow-sm focus:border-cyan-500 focus:ring-cyan-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Complete Address</label>
                <textarea
                  required
                  rows={3}
                  value={details.address}
                  onChange={e => setDetails(d => ({ ...d, address: e.target.value }))}
                  className="w-full rounded-xl bg-[#0a0c10] border-slate-800 text-white p-3 border shadow-sm focus:border-cyan-500 focus:ring-cyan-500 outline-none resize-none"
                  placeholder="Plot No., Street Name, Landmark..."
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Order Summary & Payment</h2>
            
            <div className="rounded-2xl bg-[#0a0c10] border border-slate-800 p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-white text-lg">{selectedService.name}</h3>
                  {recurring !== 'One-Time' && (
                    <span className="inline-block rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-bold text-cyan-400 uppercase tracking-wider mt-2">
                      {recurring} Plan (Active)
                    </span>
                  )}
                </div>
                <span className="font-mono text-lg font-bold text-slate-300">{formatINR(selectedService.basePrice)}</span>
              </div>

              {selectedAddons.length > 0 && (
                <div className="border-t border-slate-800 pt-4 space-y-3">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Selected Add-ons</p>
                  {selectedService.addons?.filter(a => selectedAddons.includes(a.id)).map(addon => (
                    <div key={addon.id} className="flex justify-between text-sm text-slate-300">
                      <span>{addon.name}</span>
                      <span className="font-mono text-cyan-400/80">+{formatINR(addon.price)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-slate-800 pt-5 flex justify-between items-end">
                <div>
                  <div className="text-xs text-slate-400 mb-1">Total Payable</div>
                  {recurring !== 'One-Time' && <div className="text-[10px] text-cyan-500 font-bold tracking-wider uppercase">Subscription Discount Applied</div>}
                </div>
                <span className="text-3xl font-mono font-bold text-cyan-400">{formatINR(totalPrice)}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-800/30 p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#0a0c10] rounded-lg border border-slate-700 flex items-center justify-center">
                   <CreditCard className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <p className="font-bold text-sm text-white">Payment Method</p>
                  <p className="text-xs text-slate-400">Mock gateway for demo purposes.</p>
                </div>
              </div>
              <div className="flex gap-1">
                <div className="w-8 h-5 bg-slate-800 rounded"></div>
                <div className="w-8 h-5 text-[8px] flex items-center justify-center bg-[#12151c] text-slate-400 rounded">UPI</div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-between items-center pt-6 border-t border-slate-800/50">
          <button
            onClick={handleBack}
            disabled={currentStep === 1 || paymentProcessing}
            className="px-5 py-2.5 text-xs font-bold tracking-widest uppercase text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Go Back
          </button>
          
          {currentStep < 3 ? (
            <button
              onClick={handleNext}
              disabled={
                (currentStep === 1 && selectedServiceId === 'Car Wash' && (!selectedCarCategory || !selectedCarModel)) ||
                (currentStep === 1 && selectedServiceId === 'Water Tank Cleaning' && !selectedTankCapacity) ||
                (currentStep === 1 && selectedServiceId === 'Home Cleaning' && !selectedHomeSize) ||
                (currentStep === 1 && selectedServiceId === 'Sofa Cleaning' && !selectedSofaType) ||
                (currentStep === 1 && selectedServiceId === 'Carpet Cleaning' && !selectedCarpetSize) ||
                (currentStep === 2 && (!details.name || !details.phone || !details.address || !details.date || !details.time))
              }
              className="flex items-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-6 py-3 text-xs font-bold tracking-widest text-[#0a0c10] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/10"
            >
              CONTINUE <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handlePayment}
              disabled={paymentProcessing}
              className="flex items-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-8 py-3 text-xs font-bold tracking-widest text-[#0a0c10] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20"
            >
              {paymentProcessing ? 'PROCESSING...' : `PAY ${formatINR(totalPrice)}`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  LogOut, 
  Home, 
  LayoutDashboard, 
  CalendarCheck, 
  Users, 
  Wallet, 
  Settings, 
  Menu,
  X,
  Wrench
} from "lucide-react";
import { bookingService } from "../../services/bookingService";
import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";

import DashboardTab from "../../components/admin/DashboardTab";
import BookingsTab from "../../components/admin/BookingsTab";
import CustomersTab from "../../components/admin/CustomersTab";
import FinancialsTab from "../../components/admin/FinancialsTab";

export default function DashboardPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const fetchBookings = async () => {
    setIsLoading(true);
    const data = await bookingService.getAllBookings();
    setBookings(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/admin/login");
    } catch (e) {
      console.error(e);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'bookings', label: 'Bookings', icon: CalendarCheck },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'payments', label: 'Payments', icon: Wallet },
    { id: 'services', label: 'Services', icon: Wrench },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col md:flex-row font-sans">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="font-black text-xl tracking-tight">Okar Ehha</span>
          <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">Admin</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 -mr-2 text-gray-600">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-200/60 
        flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8 hidden md:block">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-black text-2xl tracking-tight">Okar Ehha</span>
            <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">Admin</span>
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Control Panel</p>
        </div>
        
        <nav className="flex-1 px-4 py-6 md:py-0 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === item.id 
                  ? 'bg-black text-white shadow-sm' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'text-gray-400'}`} />
              {item.label}
            </button>
          ))}
          
          <div className="pt-8 pb-4">
            <div className="border-t border-gray-100 mb-4"></div>
            <Link 
              to="/" 
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all"
            >
              <Home className="w-5 h-5 text-gray-400" />
              View Website
            </Link>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm text-red-600 hover:bg-red-50 transition-all mt-1"
            >
              <LogOut className="w-5 h-5 text-red-500" />
              Sign Out
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-x-hidden min-h-screen">
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mb-4"></div>
            <p className="text-gray-500 font-medium">Loading operations data...</p>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && <DashboardTab bookings={bookings} />}
            {activeTab === 'bookings' && <BookingsTab bookings={bookings} onUpdate={fetchBookings} />}
            {activeTab === 'customers' && <CustomersTab bookings={bookings} />}
            {activeTab === 'payments' && <FinancialsTab bookings={bookings} />}
            {activeTab === 'services' && (
               <div>
                 <h2 className="text-3xl font-black text-gray-900 tracking-tight">Services</h2>
                 <p className="text-gray-500 mt-2">Service management functionality goes here.</p>
               </div>
            )}
            {activeTab === 'settings' && (
               <div>
                 <h2 className="text-3xl font-black text-gray-900 tracking-tight">Settings</h2>
                 <p className="text-gray-500 mt-2">Admin preferences and settings go here.</p>
               </div>
            )}
          </div>
        )}
      </main>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}

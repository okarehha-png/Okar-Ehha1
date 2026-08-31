import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  LogOut, 
  Home, 
  Search, 
  LayoutDashboard, 
  CalendarCheck, 
  Users, 
  Wallet, 
  Settings, 
  Bell, 
  ChevronDown, 
  TrendingUp, 
  CheckCircle2, 
  Clock,
  MapPin,
  Star
} from "lucide-react";
import { bookingService } from "../../services/bookingService";

export default function DashboardPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [filter, setFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuth = localStorage.getItem("okar_admin_auth");
    if (!isAuth) {
      navigate("/admin/login");
    }

    const fetchBookings = async () => {
      setIsLoading(true);
      const data = await bookingService.getAllBookings();
      setBookings(data);
      setIsLoading(false);
    };

    fetchBookings();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("okar_admin_auth");
    navigate("/admin/login");
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const updated = bookings.map(b => b.id === id ? { ...b, status: newStatus } : b);
    setBookings(updated);
    await bookingService.updateBookingStatus(id, newStatus);
  };

  const filteredBookings = filter === "All" ? bookings : bookings.filter(b => b.status === filter);

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'Received' || b.status === 'Confirmed').length,
    completed: bookings.filter(b => b.status === 'Completed').length,
    revenue: bookings.filter(b => b.status === 'Completed').reduce((acc, curr) => acc + (curr.amount || 0), 0)
  };

  return (
    <div className="flex h-screen bg-[#FAFAFC] overflow-hidden font-sans">
      
      {/* Sidebar - Premium Minimalist */}
      <aside className="w-[280px] bg-white border-r border-gray-200/60 hidden md:flex flex-col">
        <div className="h-20 flex items-center px-8 border-b border-gray-100">
          <span className="text-2xl font-black text-gray-900 tracking-tight">Okar Ehha</span>
          <span className="ml-3 text-[10px] font-bold bg-black text-white px-2 py-1 rounded-md uppercase tracking-widest">Admin</span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-8 px-6 space-y-2">
          <button 
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === 'dashboard' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
          >
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab("bookings")}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === 'bookings' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
          >
            <CalendarCheck className="w-5 h-5" /> Bookings
          </button>
          <button className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all">
            <Users className="w-5 h-5" /> Customers
          </button>
          <button className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all">
            <Wallet className="w-5 h-5" /> Financials
          </button>
        </div>

        <div className="p-6 border-t border-gray-100">
          <Link to="/" className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all">
            <Home className="w-5 h-5" /> View Website
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 hover:text-red-600 transition-all mt-2">
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#FAFAFC]">
        
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200/60 flex items-center justify-between px-6 md:px-10 z-10 shrink-0">
          <div className="flex items-center gap-4">
             <div className="relative hidden md:block w-80">
               <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
               <input type="text" placeholder="Search operations..." className="w-full pl-11 pr-4 py-3 bg-gray-100/50 border border-transparent rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all" />
             </div>
          </div>
          <div className="flex items-center gap-6 md:gap-8">
            <button className="relative p-2 text-gray-400 hover:text-gray-900 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1.5 w-2 h-2 bg-black rounded-full"></span>
            </button>
            <div className="flex items-center gap-4 pl-6 border-l border-gray-200">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-gray-900">Bhanu</p>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-0.5">Admin</p>
              </div>
              <div className="w-10 h-10 bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center text-gray-900 font-bold text-sm">
                B
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          
          <div className="max-w-[1400px] mx-auto space-y-10">
            
            {/* Page Title */}
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">Overview</h2>
              <p className="text-gray-500 text-base mt-2">Monitor your operations and recent booking activities.</p>
            </div>

            {/* Premium Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-white p-6 rounded-[24px] border border-gray-200/60 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-gray-900" />
                  </div>
                </div>
                <div>
                  <h3 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">₹{stats.revenue.toLocaleString()}</h3>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Gross Revenue</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-[24px] border border-gray-200/60 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-gray-900" />
                  </div>
                </div>
                <div>
                  <h3 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">{stats.completed}</h3>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Completed Jobs</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-[24px] border border-gray-200/60 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-gray-900" />
                  </div>
                </div>
                <div>
                  <h3 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">{stats.pending}</h3>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Active Bookings</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-[24px] border border-gray-200/60 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                    <Star className="w-6 h-6 text-gray-900 fill-gray-900" />
                  </div>
                </div>
                <div>
                  <h3 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">4.9</h3>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Client Rating</p>
                </div>
              </div>

            </div>

            {/* Bookings Section */}
            <div className="bg-white rounded-[24px] border border-gray-200/60 shadow-sm overflow-hidden mt-6">
              <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 tracking-tight">Recent Operations</h3>
                  <p className="text-sm text-gray-500 mt-1">Manage and track your service assignments.</p>
                </div>
                
                {/* Scrollable Pills */}
                <div className="flex items-center gap-3 overflow-x-auto pb-4 xl:pb-0 scrollbar-hide -mx-6 px-6 xl:mx-0 xl:px-0">
                  {["All", "Received", "Confirmed", "Started", "Completed", "Cancelled"].map(f => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all border ${
                        filter === f 
                          ? 'bg-black text-white border-black shadow-md' 
                          : 'bg-white text-gray-600 border-gray-200/80 hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100">Job Reference</th>
                      <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100">Client Details</th>
                      <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100">Schedule</th>
                      <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100">Value</th>
                      <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100">Status</th>
                      <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-8 py-16 text-center">
                           <div className="flex flex-col items-center justify-center">
                             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                               <CalendarCheck className="w-10 h-10 text-gray-300" />
                             </div>
                             <p className="text-xl font-bold text-gray-900">No records found</p>
                             <p className="text-gray-500 text-base mt-2">Try adjusting your filters or search criteria.</p>
                           </div>
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-gray-50/80 transition-colors group">
                          <td className="px-8 py-6">
                            <div className="flex flex-col">
                              <span className="font-bold text-gray-900 text-base tracking-tight">{b.serviceName}</span>
                              <span className="text-sm font-medium text-gray-500 mt-1 line-clamp-1">{b.packageName}</span>
                              <span className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-widest">{b.id}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex flex-col">
                              <span className="font-bold text-gray-900 text-base tracking-tight">{b.fullName}</span>
                              <span className="text-sm font-medium text-gray-500 mt-1">{b.mobile}</span>
                              <span className="text-xs font-semibold text-gray-400 mt-2 flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5" /> Client Address
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex flex-col">
                              <span className="font-bold text-gray-900 text-base tracking-tight">{b.date}</span>
                              <span className="text-sm font-medium text-gray-500 flex items-center gap-1.5 mt-1">
                                <Clock className="w-3.5 h-3.5" /> {b.time}
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className="font-black text-gray-900 text-lg tracking-tight">₹{b.amount}</span>
                          </td>
                          <td className="px-8 py-6">
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest ${
                              b.status === 'Completed' ? 'bg-black text-white' :
                              b.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                              b.status === 'Started' || b.status === 'On The Way' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {b.status || 'Received'}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <select
                              value={b.status || 'Received'}
                              onChange={(e) => updateStatus(b.id, e.target.value)}
                              className="text-sm font-bold text-gray-900 bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent cursor-pointer appearance-none pr-10 relative hover:bg-gray-50 transition-colors shadow-sm"
                              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'currentColor\' stroke-width=\'2.5\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1em 1em' }}
                            >
                              <option value="Received">Mark Received</option>
                              <option value="Confirmed">Mark Confirmed</option>
                              <option value="Assigned">Assign Professional</option>
                              <option value="On The Way">On The Way</option>
                              <option value="Started">Start Job</option>
                              <option value="Completed">Mark Completed</option>
                              <option value="Cancelled">Cancel Job</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </main>

    </div>
  );
}

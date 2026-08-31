import React from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  Wrench,
  TrendingUp,
  Wallet,
  Receipt,
  PieChart,
  Landmark,
  Package,
  ShoppingCart,
  Truck,
  UserCheck,
  Clock,
  Coins,
  FileSpreadsheet,
  BarChart3,
  MessageSquare,
  ShieldCheck,
  Settings,
  Home,
  LogOut,
  X,
  Sparkles
} from "lucide-react";
import { AdminRole } from "../../types/admin";

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  onLogout: () => void;
  userRole: AdminRole;
  setUserRole: (role: AdminRole) => void;
  pendingBookingsCount: number;
  lowStockCount: number;
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  mobileMenuOpen,
  setMobileMenuOpen,
  onLogout,
  userRole,
  setUserRole,
  pendingBookingsCount,
  lowStockCount
}: AdminSidebarProps) {

  const navGroups = [
    {
      group: "Overview & Operations",
      items: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { 
          id: "bookings", 
          label: "Orders / Bookings", 
          icon: CalendarCheck,
          badge: pendingBookingsCount > 0 ? pendingBookingsCount : undefined,
          badgeColor: "bg-amber-500 text-black font-bold"
        },
        { id: "customers", label: "Customers (CRM)", icon: Users },
        { id: "services", label: "Services & Pricing", icon: Wrench },
      ]
    },
    {
      group: "Finance & Accounts",
      items: [
        { id: "sales", label: "Sales & Revenue", icon: TrendingUp },
        { id: "payments", label: "Payments & Pending", icon: Wallet },
        { id: "expenses", label: "Expense Management", icon: Receipt },
        { id: "profit-loss", label: "Profit & Loss (P&L)", icon: PieChart },
        { id: "cash-bank", label: "Cash / UPI / Bank", icon: Landmark },
      ]
    },
    {
      group: "Inventory & Purchases",
      items: [
        { 
          id: "inventory", 
          label: "Stock / Inventory", 
          icon: Package,
          badge: lowStockCount > 0 ? `${lowStockCount} Low` : undefined,
          badgeColor: "bg-red-500 text-white font-bold"
        },
        { id: "purchases", label: "Purchases & Suppliers", icon: ShoppingCart },
      ]
    },
    {
      group: "Staff & Payroll",
      items: [
        { id: "staff", label: "Staff Management", icon: UserCheck },
        { id: "attendance", label: "Daily Attendance", icon: Clock },
        { id: "salary", label: "Salary & Payouts", icon: Coins },
      ]
    },
    {
      group: "Insights & Tools",
      items: [
        { id: "analytics", label: "Business Analytics", icon: BarChart3 },
        { id: "reports", label: "Reports & Exports", icon: FileSpreadsheet },
        { id: "whatsapp", label: "WhatsApp Marketing", icon: MessageSquare },
      ]
    },
    {
      group: "Administration",
      items: [
        { id: "admin-users", label: "Admin & Roles", icon: ShieldCheck },
        { id: "settings", label: "Business Settings", icon: Settings },
      ]
    }
  ];

  return (
    <aside
      className={`
        fixed md:sticky top-0 left-0 z-50 h-screen w-72 bg-[#0C1017] border-r border-amber-500/20 
        flex flex-col transition-transform duration-300 ease-in-out text-gray-300
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
    >
      {/* Brand Header */}
      <div className="p-6 border-b border-gray-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20 font-black text-black text-xl">
            OE
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-white text-lg tracking-tight">Okar Ehha</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            </div>
            <p className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
              Korba Enterprise Admin
            </p>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Role Switcher Pill */}
      <div className="px-5 py-3 border-b border-gray-800/50 bg-[#080B10]">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Access Role:</span>
          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value as AdminRole)}
            className="bg-[#141A24] text-amber-400 text-xs font-bold px-2.5 py-1 rounded-md border border-amber-500/30 focus:outline-none cursor-pointer"
          >
            <option value="Owner">👑 Owner (Full)</option>
            <option value="Manager">💼 Manager</option>
            <option value="Accountant">📊 Accountant</option>
            <option value="Staff">🛠️ Staff</option>
          </select>
        </div>
      </div>

      {/* Navigation Links (Scrollable) */}
      <div className="flex-1 px-3 py-4 space-y-6 overflow-y-auto custom-scrollbar">
        {navGroups.map((group, idx) => (
          <div key={idx} className="space-y-1">
            <h3 className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-gray-500 mb-1.5">
              {group.group}
            </h3>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`
                    w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-xs tracking-wide transition-all
                    ${
                      isActive
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold shadow-md shadow-amber-500/10"
                        : "text-gray-400 hover:bg-gray-800/60 hover:text-gray-100"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-black" : "text-gray-400"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Controls */}
      <div className="p-4 border-t border-gray-800/80 bg-[#080B10] space-y-2">
        <Link
          to="/"
          target="_blank"
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white bg-gray-800/60 hover:bg-gray-800 transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Open Live Website</span>
        </Link>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out Admin</span>
        </button>
      </div>
    </aside>
  );
}

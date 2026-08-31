import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc 
} from "firebase/firestore";
import { bookingService } from "../../services/bookingService";

import {
  Booking,
  Customer,
  ServiceItem,
  Expense,
  Transaction,
  InventoryItem,
  PurchaseOrder,
  Supplier,
  StaffMember,
  AttendanceRecord,
  SalaryRecord,
  NotificationItem,
  AdminRole
} from "../../types/admin";

import {
  initialServicesData,
  initialStaffData,
  initialInventoryData,
  initialSuppliersData,
  initialExpensesData,
  initialTransactionsData
} from "../../services/adminService";

// Sub-components
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import DashboardTab from "../../components/admin/DashboardTab";
import OrdersTab from "../../components/admin/OrdersTab";
import CustomersTab from "../../components/admin/CustomersTab";
import ServicesTab from "../../components/admin/ServicesTab";
import SalesTab from "../../components/admin/SalesTab";
import PaymentsTab from "../../components/admin/PaymentsTab";
import ExpensesTab from "../../components/admin/ExpensesTab";
import CashBankTab from "../../components/admin/CashBankTab";
import InventoryTab from "../../components/admin/InventoryTab";
import PurchasesTab from "../../components/admin/PurchasesTab";
import SuppliersTab from "../../components/admin/SuppliersTab";
import StaffTab from "../../components/admin/StaffTab";
import AttendanceTab from "../../components/admin/AttendanceTab";
import SalariesTab from "../../components/admin/SalariesTab";
import WhatsAppMarketingTab from "../../components/admin/WhatsAppMarketingTab";
import SettingsTab from "../../components/admin/SettingsTab";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [userRole, setUserRole] = useState<AdminRole>("Owner");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Entities state
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [purchases, setPurchases] = useState<PurchaseOrder[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [salaries, setSalaries] = useState<SalaryRecord[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Modals controlled by header quick actions
  const [quickOrderOpen, setQuickOrderOpen] = useState(false);
  const [quickExpenseOpen, setQuickExpenseOpen] = useState(false);

  // Fetch all business collections
  const loadAllData = async () => {
    setIsLoading(true);
    try {
      // 1. Bookings
      const bookingsData = await bookingService.getAllBookings();
      const normalizedBookings: Booking[] = (bookingsData || []).map((b: any) => {
        const amount = Number(b.finalAmount || b.amount || 499);
        const received = Number(b.paymentReceived || (b.paymentStatus === 'Paid' ? amount : 0));
        const pending = Math.max(0, amount - received);
        return {
          id: b.id || `b-${Date.now()}`,
          fullName: b.fullName || b.customerName || 'Customer',
          mobile: b.mobile || b.phone || '98261XXXXX',
          email: b.email || '',
          serviceName: b.serviceName || 'Doorstep Car Wash',
          packageName: b.packageName || '',
          vehicleType: b.vehicleType || '',
          vehicleNumber: b.vehicleNumber || '',
          address: b.address || 'Korba, Chhattisgarh',
          date: b.date || new Date().toISOString().split('T')[0],
          time: b.time || '10:00 AM',
          amount: Number(b.amount || amount),
          discount: Number(b.discount || 0),
          finalAmount: amount,
          paymentReceived: received,
          pendingAmount: pending,
          paymentMethod: b.paymentMethod || 'UPI',
          paymentStatus: b.paymentStatus || (pending === 0 ? 'Paid' : 'Pending'),
          status: b.status || 'New',
          assignedStaff: b.assignedStaff || 'Ramesh Patel',
          notes: b.notes || '',
          createdAt: b.createdAt || new Date().toISOString()
        };
      });
      setBookings(normalizedBookings);

      // 2. Services
      try {
        const servSnap = await getDocs(collection(db, 'services'));
        if (!servSnap.empty) {
          setServices(servSnap.docs.map(d => ({ id: d.id, ...d.data() } as ServiceItem)));
        } else {
          setServices(initialServicesData.map((s, idx) => ({ id: `serv-${idx + 1}`, ...s } as ServiceItem)));
        }
      } catch {
        setServices(initialServicesData.map((s, idx) => ({ id: `serv-${idx + 1}`, ...s } as ServiceItem)));
      }

      // 3. Expenses
      try {
        const expSnap = await getDocs(collection(db, 'expenses'));
        if (!expSnap.empty) {
          setExpenses(expSnap.docs.map(d => ({ id: d.id, ...d.data() } as Expense)));
        } else {
          setExpenses(initialExpensesData.map((e, idx) => ({ id: `exp-${idx + 1}`, ...e } as Expense)));
        }
      } catch {
        setExpenses(initialExpensesData.map((e, idx) => ({ id: `exp-${idx + 1}`, ...e } as Expense)));
      }

      // 4. Transactions / Cash-Bank
      try {
        const txSnap = await getDocs(collection(db, 'transactions'));
        if (!txSnap.empty) {
          setTransactions(txSnap.docs.map(d => ({ id: d.id, ...d.data() } as Transaction)));
        } else {
          setTransactions(initialTransactionsData.map((t, idx) => ({ id: `tx-${idx + 1}`, ...t } as Transaction)));
        }
      } catch {
        setTransactions(initialTransactionsData.map((t, idx) => ({ id: `tx-${idx + 1}`, ...t } as Transaction)));
      }

      // 5. Inventory
      try {
        const invSnap = await getDocs(collection(db, 'inventory'));
        if (!invSnap.empty) {
          setInventory(invSnap.docs.map(d => ({ id: d.id, ...d.data() } as InventoryItem)));
        } else {
          setInventory(initialInventoryData.map((i, idx) => ({
            id: `inv-${idx + 1}`,
            productName: i.productName,
            category: 'Chemicals & Shampoos',
            openingStock: i.openingStock,
            purchases: i.purchases,
            used: i.used,
            currentStock: i.currentStock,
            unit: i.unit,
            unitCost: i.costPerUnit,
            costPerUnit: i.costPerUnit,
            supplierName: i.supplier,
            minStockLevel: i.minStockLevel,
            lastRestocked: i.lastUpdated
          } as InventoryItem)));
        }
      } catch {
        setInventory(initialInventoryData.map((i, idx) => ({
          id: `inv-${idx + 1}`,
          productName: i.productName,
          category: 'Chemicals & Shampoos',
          openingStock: i.openingStock,
          purchases: i.purchases,
          used: i.used,
          currentStock: i.currentStock,
          unit: i.unit,
          unitCost: i.costPerUnit,
          costPerUnit: i.costPerUnit,
          supplierName: i.supplier,
          minStockLevel: i.minStockLevel,
          lastRestocked: i.lastUpdated
        } as InventoryItem)));
      }

      // 6. Suppliers
      try {
        const supSnap = await getDocs(collection(db, 'suppliers'));
        if (!supSnap.empty) {
          setSuppliers(supSnap.docs.map(d => ({ id: d.id, ...d.data() } as Supplier)));
        } else {
          setSuppliers(initialSuppliersData.map((s, idx) => ({
            id: `sup-${idx + 1}`,
            name: s.name,
            mobile: s.mobile,
            contactPerson: 'Sales Manager',
            suppliesCategory: s.products,
            products: s.products,
            address: 'Transport Nagar, Korba',
            totalPurchased: s.totalPurchases,
            pendingBalance: s.pendingAmount
          } as Supplier)));
        }
      } catch {
        setSuppliers(initialSuppliersData.map((s, idx) => ({
          id: `sup-${idx + 1}`,
          name: s.name,
          mobile: s.mobile,
          contactPerson: 'Sales Manager',
          suppliesCategory: s.products,
          products: s.products,
          address: 'Transport Nagar, Korba',
          totalPurchased: s.totalPurchases,
          pendingBalance: s.pendingAmount
        } as Supplier)));
      }

      // 7. Purchases
      setPurchases([
        {
          id: 'po-1',
          date: new Date().toISOString().split('T')[0],
          supplierName: 'Chhattisgarh Auto Chemical Hub',
          invoiceNumber: 'INV-2026-081',
          totalAmount: 4800,
          paymentStatus: 'Paid',
          itemsSummary: '4x Snow Foam Car Shampoos (5L)'
        },
        {
          id: 'po-2',
          date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
          supplierName: 'Royal Detailing Supplies Raipur',
          invoiceNumber: 'INV-2026-079',
          totalAmount: 3750,
          paymentStatus: 'Paid',
          itemsSummary: '25x Microfiber 800 GSM Towels'
        }
      ]);

      // 8. Staff
      try {
        const staffSnap = await getDocs(collection(db, 'staff'));
        if (!staffSnap.empty) {
          setStaff(staffSnap.docs.map(d => ({ id: d.id, ...d.data() } as StaffMember)));
        } else {
          setStaff(initialStaffData.map((st, idx) => ({
            id: `st-${idx + 1}`,
            name: st.name,
            mobile: st.mobile,
            role: st.role,
            baseSalary: st.salary,
            salary: st.salary,
            commissionPercentage: 5,
            status: 'Active',
            isActive: true,
            emergencyContact: 'Family: 98260XXXXX',
            joinedDate: st.joiningDate,
            assignedJobsCount: st.assignedJobsCount,
            completedJobsCount: st.completedJobsCount
          } as StaffMember)));
        }
      } catch {
        setStaff(initialStaffData.map((st, idx) => ({
          id: `st-${idx + 1}`,
          name: st.name,
          mobile: st.mobile,
          role: st.role,
          baseSalary: st.salary,
          salary: st.salary,
          commissionPercentage: 5,
          status: 'Active',
          isActive: true,
          emergencyContact: 'Family: 98260XXXXX',
          joinedDate: st.joiningDate,
          assignedJobsCount: st.assignedJobsCount,
          completedJobsCount: st.completedJobsCount
        } as StaffMember)));
      }

      // 9. Attendance
      setAttendance([
        {
          id: 'att-1',
          staffId: 'st-1',
          staffName: 'Ramesh Patel',
          date: new Date().toISOString().split('T')[0],
          status: 'Present',
          overtimeHours: 1,
          checkInTime: '09:00 AM',
          checkOutTime: '08:00 PM'
        },
        {
          id: 'att-2',
          staffId: 'st-2',
          staffName: 'Sunil Kumar Yadav',
          date: new Date().toISOString().split('T')[0],
          status: 'Present',
          overtimeHours: 2,
          checkInTime: '08:30 AM',
          checkOutTime: '08:30 PM'
        }
      ]);

      // 10. Salaries
      setSalaries([
        {
          id: 'sal-1',
          staffId: 'st-1',
          staffName: 'Ramesh Patel',
          month: '2026-07',
          baseSalary: 16000,
          commission: 1500,
          bonus: 800,
          deductions: 0,
          netSalary: 18300,
          status: 'Paid',
          paidDate: '2026-08-01',
          paymentMethod: 'Bank'
        }
      ]);

      // 11. Compute System Notifications
      const notifs: NotificationItem[] = [];
      const newBookings = normalizedBookings.filter(b => b.status === 'New');
      if (newBookings.length > 0) {
        notifs.push({
          id: 'n-1',
          title: `${newBookings.length} New Booking Requests`,
          message: `Pending doorstep services in Korba await dispatch assignment.`,
          type: 'booking',
          read: false,
          createdAt: 'Just now',
          linkTab: 'bookings'
        });
      }

      const pendingReceivables = normalizedBookings.filter(b => b.pendingAmount > 0);
      if (pendingReceivables.length > 0) {
        notifs.push({
          id: 'n-2',
          title: `Pending Client Collections`,
          message: `${pendingReceivables.length} clients have unpaid service balances.`,
          type: 'payment',
          read: false,
          createdAt: 'Today',
          linkTab: 'payments'
        });
      }

      setNotifications(notifs);

    } catch (err) {
      console.error("Error loading admin data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/admin/login");
    } catch (e) {
      console.error(e);
      navigate("/admin/login");
    }
  };

  // CRUD Handlers
  const handleUpdateBooking = async (updated: Booking) => {
    setBookings(prev => prev.map(b => b.id === updated.id ? updated : b));
    try {
      const bRef = doc(db, 'bookings', updated.id);
      await updateDoc(bRef, updated as any);
    } catch (e) {
      console.warn("Updated locally:", e);
    }
  };

  const handleAddBooking = async (newB: Omit<Booking, 'id'>) => {
    const tempId = `b-${Date.now()}`;
    const fullBooking: Booking = { id: tempId, ...newB };
    setBookings(prev => [fullBooking, ...prev]);
    try {
      const docRef = await addDoc(collection(db, 'bookings'), fullBooking);
      setBookings(prev => prev.map(b => b.id === tempId ? { ...b, id: docRef.id } : b));
    } catch (e) {
      console.warn("Added locally:", e);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
    try {
      await deleteDoc(doc(db, 'bookings', id));
    } catch (e) {
      console.warn("Deleted locally:", e);
    }
  };

  const handleAddExpense = async (newExp: Omit<Expense, 'id'>) => {
    const tempId = `exp-${Date.now()}`;
    const fullExp: Expense = { id: tempId, ...newExp };
    setExpenses(prev => [fullExp, ...prev]);

    // Also record transaction in ledger
    const tx: Transaction = {
      id: `tx-${Date.now()}`,
      date: newExp.date,
      account: newExp.paymentMethod === 'Other' ? 'Cash' : newExp.paymentMethod,
      type: 'Out',
      amount: newExp.amount,
      description: `Expense: ${newExp.description} (${newExp.category})`,
      category: newExp.category,
      createdAt: new Date().toISOString()
    };
    setTransactions(prev => [tx, ...prev]);

    try {
      await addDoc(collection(db, 'expenses'), fullExp);
      await addDoc(collection(db, 'transactions'), tx);
    } catch (e) {
      console.warn("Expense saved locally:", e);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    try {
      await deleteDoc(doc(db, 'expenses', id));
    } catch (e) {
      console.warn("Deleted locally:", e);
    }
  };

  const handleAddTransaction = async (newTx: Omit<Transaction, 'id'>) => {
    const tempId = `tx-${Date.now()}`;
    const fullTx: Transaction = { id: tempId, ...newTx };
    setTransactions(prev => [fullTx, ...prev]);
    try {
      await addDoc(collection(db, 'transactions'), fullTx);
    } catch (e) {
      console.warn("Transaction saved locally:", e);
    }
  };

  const handleUpdateService = async (service: ServiceItem) => {
    setServices(prev => prev.map(s => s.id === service.id ? service : s));
    try {
      await updateDoc(doc(db, 'services', service.id), service as any);
    } catch (e) {
      console.warn("Service updated locally:", e);
    }
  };

  const handleAddService = async (newS: Omit<ServiceItem, 'id'>) => {
    const tempId = `serv-${Date.now()}`;
    const fullS: ServiceItem = { id: tempId, ...newS };
    setServices(prev => [...prev, fullS]);
    try {
      await addDoc(collection(db, 'services'), fullS);
    } catch (e) {
      console.warn("Service added locally:", e);
    }
  };

  const handleDeleteService = async (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
    try {
      await deleteDoc(doc(db, 'services', id));
    } catch (e) {
      console.warn("Service deleted locally:", e);
    }
  };

  const handleUpdateInventory = async (item: InventoryItem) => {
    setInventory(prev => prev.map(i => i.id === item.id ? item : i));
    try {
      await updateDoc(doc(db, 'inventory', item.id), item as any);
    } catch (e) {
      console.warn("Inventory updated locally:", e);
    }
  };

  const handleAddInventory = async (newI: Omit<InventoryItem, 'id'>) => {
    const tempId = `inv-${Date.now()}`;
    const fullI: InventoryItem = { id: tempId, ...newI };
    setInventory(prev => [...prev, fullI]);
    try {
      await addDoc(collection(db, 'inventory'), fullI);
    } catch (e) {
      console.warn("Inventory added locally:", e);
    }
  };

  const handleDeleteInventory = async (id: string) => {
    setInventory(prev => prev.filter(i => i.id !== id));
    try {
      await deleteDoc(doc(db, 'inventory', id));
    } catch (e) {
      console.warn("Inventory deleted locally:", e);
    }
  };

  const handleAddPurchase = async (newP: Omit<PurchaseOrder, 'id'>) => {
    const tempId = `po-${Date.now()}`;
    const fullP: PurchaseOrder = { id: tempId, ...newP };
    setPurchases(prev => [fullP, ...prev]);

    // Also create an expense for settled bills
    if (newP.paymentStatus === 'Paid') {
      const exp: Expense = {
        id: `exp-${Date.now()}`,
        date: newP.date,
        category: 'Chemicals',
        description: `Purchase Bill #${newP.invoiceNumber || 'PO'} from ${newP.supplierName}: ${newP.itemsSummary || 'Stock'}`,
        amount: newP.totalAmount,
        paymentMethod: 'UPI',
        paidBy: 'Owner',
        createdAt: new Date().toISOString()
      };
      setExpenses(prev => [exp, ...prev]);
    }
  };

  const handleDeletePurchase = async (id: string) => {
    setPurchases(prev => prev.filter(p => p.id !== id));
  };

  const handleAddSupplier = async (newS: Omit<Supplier, 'id'>) => {
    const tempId = `sup-${Date.now()}`;
    const fullS: Supplier = { id: tempId, ...newS };
    setSuppliers(prev => [...prev, fullS]);
  };

  const handleUpdateSupplier = async (supplier: Supplier) => {
    setSuppliers(prev => prev.map(s => s.id === supplier.id ? supplier : s));
  };

  const handleDeleteSupplier = async (id: string) => {
    setSuppliers(prev => prev.filter(s => s.id !== id));
  };

  const handleAddStaff = async (newSt: Omit<StaffMember, 'id'>) => {
    const tempId = `st-${Date.now()}`;
    const fullSt: StaffMember = { id: tempId, ...newSt };
    setStaff(prev => [...prev, fullSt]);
    try {
      await addDoc(collection(db, 'staff'), fullSt);
    } catch (e) {
      console.warn("Staff added locally:", e);
    }
  };

  const handleUpdateStaff = async (st: StaffMember) => {
    setStaff(prev => prev.map(s => s.id === st.id ? st : s));
    try {
      await updateDoc(doc(db, 'staff', st.id), st as any);
    } catch (e) {
      console.warn("Staff updated locally:", e);
    }
  };

  const handleDeleteStaff = async (id: string) => {
    setStaff(prev => prev.filter(s => s.id !== id));
    try {
      await deleteDoc(doc(db, 'staff', id));
    } catch (e) {
      console.warn("Staff deleted locally:", e);
    }
  };

  const handleSaveAttendance = async (records: AttendanceRecord[]) => {
    setAttendance(prev => {
      const map = new Map<string, AttendanceRecord>();
      prev.forEach(r => map.set(r.id, r));
      records.forEach(r => map.set(r.id, r));
      return Array.from(map.values());
    });
  };

  const handlePaySalary = async (salaryRecord: Omit<SalaryRecord, 'id'>) => {
    const tempId = `sal-${Date.now()}`;
    const fullSal: SalaryRecord = { id: tempId, ...salaryRecord };
    setSalaries(prev => [...prev, fullSal]);

    // Record in expenses
    const exp: Expense = {
      id: `exp-sal-${Date.now()}`,
      date: salaryRecord.paidDate || new Date().toISOString().split('T')[0],
      category: 'Staff Salary',
      description: `Salary Payout: ${salaryRecord.staffName} for Month ${salaryRecord.month}`,
      amount: salaryRecord.netSalary || salaryRecord.finalSalary || 0,
      paymentMethod: (salaryRecord.paymentMethod as any) || 'Bank',
      paidBy: 'Owner',
      createdAt: new Date().toISOString()
    };
    setExpenses(prev => [exp, ...prev]);

    // Record in ledger
    const tx: Transaction = {
      id: `tx-sal-${Date.now()}`,
      date: salaryRecord.paidDate || new Date().toISOString().split('T')[0],
      account: (salaryRecord.paymentMethod as any) || 'Bank',
      type: 'Out',
      amount: salaryRecord.netSalary || salaryRecord.finalSalary || 0,
      description: `Staff Salary: ${salaryRecord.staffName} (${salaryRecord.month})`,
      category: 'Staff Salary',
      createdAt: new Date().toISOString()
    };
    setTransactions(prev => [tx, ...prev]);
  };

  const handleCollectPayment = async (bookingId: string, amount: number, method: string) => {
    const b = bookings.find(item => item.id === bookingId);
    if (!b) return;

    const newReceived = (b.paymentReceived || 0) + amount;
    const newPending = Math.max(0, (b.finalAmount || b.amount) - newReceived);
    const newStatus = newPending === 0 ? 'Paid' : 'Partially Paid';

    const updated: Booking = {
      ...b,
      paymentReceived: newReceived,
      pendingAmount: newPending,
      paymentStatus: newStatus,
      paymentMethod: method
    };

    await handleUpdateBooking(updated);

    // Record in ledger
    const tx: Transaction = {
      id: `tx-coll-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      account: (method as any) || 'UPI',
      type: 'In',
      amount: amount,
      description: `Payment Collection: ${b.fullName} (${b.serviceName})`,
      category: 'Booking Revenue',
      createdAt: new Date().toISOString()
    };
    setTransactions(prev => [tx, ...prev]);
  };

  const pendingBookingsCount = bookings.filter(b => b.status === 'New' || b.status === 'Confirmed').length;
  const lowStockCount = inventory.filter(i => i.currentStock <= i.minStockLevel).length;

  const tabTitles: Record<string, string> = {
    dashboard: "Enterprise Operations Dashboard",
    bookings: "Doorstep Service Orders",
    customers: "Customer Directory & CRM",
    services: "Service Catalog & Pricing",
    sales: "Sales Analytics & Revenue",
    payments: "Payment Collection & Receivables",
    expenses: "Business Expense Management",
    "profit-loss": "Profit & Loss (P&L) Statement",
    "cash-bank": "Cash, UPI & Bank Accounts Ledger",
    inventory: "Chemicals & Equipment Stock",
    purchases: "Purchase Orders & Vendor Bills",
    staff: "Cleaning Staff & Technicians",
    attendance: "Daily Staff Attendance",
    salary: "Staff Payroll & Payslips",
    analytics: "Business Analytics",
    reports: "Financial Reports & Exports",
    whatsapp: "WhatsApp Broadcast & Notifications",
    "admin-users": "Admin Roles & Security",
    settings: "Business Settings"
  };

  return (
    <div className="min-h-screen bg-[#080B10] flex text-gray-100 font-sans selection:bg-amber-500 selection:text-black">
      {/* Sidebar Navigation */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onLogout={handleLogout}
        userRole={userRole}
        setUserRole={setUserRole}
        pendingBookingsCount={pendingBookingsCount}
        lowStockCount={lowStockCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <AdminHeader
          setMobileMenuOpen={setMobileMenuOpen}
          activeTabTitle={tabTitles[activeTab] || "Admin Dashboard"}
          notifications={notifications}
          onRefresh={loadAllData}
          onQuickNewBooking={() => {
            setActiveTab("bookings");
          }}
          onQuickNewExpense={() => {
            setActiveTab("expenses");
          }}
          userRole={userRole}
          setActiveTab={setActiveTab}
        />

        {/* Dynamic Tab Body */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="h-96 flex flex-col items-center justify-center space-y-4 animate-fadeIn">
              <div className="w-12 h-12 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin"></div>
              <p className="text-sm font-bold text-amber-400">Loading Okar Ehha Operations Database...</p>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto">
              {activeTab === "dashboard" && (
                <DashboardTab
                  bookings={bookings}
                  expenses={expenses}
                  customers={[]}
                  inventory={inventory}
                  setActiveTab={setActiveTab}
                  onSelectBooking={(b) => {
                    setActiveTab("bookings");
                  }}
                />
              )}

              {activeTab === "bookings" && (
                <OrdersTab
                  bookings={bookings}
                  staff={staff}
                  services={services}
                  onUpdateBooking={handleUpdateBooking}
                  onCreateBooking={handleAddBooking}
                  onDeleteBooking={handleDeleteBooking}
                  onClearSelectedBookingModal={() => {}}
                />
              )}

              {activeTab === "customers" && (
                <CustomersTab
                  bookings={bookings}
                  customers={[]}
                  onOpenNewBookingWithCustomer={(c) => {
                    setActiveTab("bookings");
                  }}
                />
              )}

              {activeTab === "services" && (
                <ServicesTab
                  services={services}
                  onUpdateService={handleUpdateService}
                  onAddService={handleAddService}
                  onDeleteService={handleDeleteService}
                />
              )}

              {(activeTab === "sales" || activeTab === "profit-loss" || activeTab === "analytics" || activeTab === "reports") && (
                <SalesTab
                  bookings={bookings}
                  staff={staff}
                />
              )}

              {activeTab === "payments" && (
                <PaymentsTab
                  bookings={bookings}
                  onUpdateBooking={handleUpdateBooking}
                />
              )}

              {activeTab === "expenses" && (
                <ExpensesTab
                  expenses={expenses}
                  onAddExpense={handleAddExpense}
                  onDeleteExpense={handleDeleteExpense}
                />
              )}

              {activeTab === "cash-bank" && (
                <CashBankTab
                  accounts={[
                    { id: 'acc-cash', name: 'Cash in Hand', accountType: 'Cash', balance: 15000 },
                    { id: 'acc-upi', name: 'UPI (QR / PhonePe / GPay)', accountType: 'UPI', balance: 28500 },
                    { id: 'acc-bank', name: 'Current Bank Account', accountType: 'Bank', balance: 85000, accountNumber: 'HDFC-XXXX9821' }
                  ]}
                  transactions={transactions}
                  bookings={bookings}
                  expenses={expenses}
                  onAddTransaction={handleAddTransaction}
                />
              )}

              {activeTab === "inventory" && (
                <InventoryTab
                  inventory={inventory}
                  onUpdateItem={handleUpdateInventory}
                  onAddItem={handleAddInventory}
                  onDeleteItem={handleDeleteInventory}
                />
              )}

              {activeTab === "purchases" && (
                <PurchasesTab
                  purchases={purchases}
                  suppliers={suppliers}
                  onAddPurchase={handleAddPurchase}
                  onDeletePurchase={handleDeletePurchase}
                />
              )}

              {activeTab === "suppliers" && (
                <SuppliersTab
                  suppliers={suppliers}
                  onAddSupplier={handleAddSupplier}
                  onUpdateSupplier={handleUpdateSupplier}
                  onDeleteSupplier={handleDeleteSupplier}
                />
              )}

              {activeTab === "staff" && (
                <StaffTab
                  staff={staff}
                  bookings={bookings}
                  onAddStaff={handleAddStaff}
                  onUpdateStaff={handleUpdateStaff}
                  onDeleteStaff={handleDeleteStaff}
                />
              )}

              {activeTab === "attendance" && (
                <AttendanceTab
                  staff={staff}
                  attendance={attendance}
                  onSaveAttendance={handleSaveAttendance}
                />
              )}

              {activeTab === "salary" && (
                <SalariesTab
                  staff={staff}
                  salaries={salaries}
                  bookings={bookings}
                  attendance={attendance}
                  onPaySalary={handlePaySalary}
                />
              )}

              {activeTab === "whatsapp" && (
                <WhatsAppMarketingTab
                  customers={[]}
                  bookings={bookings}
                />
              )}

              {(activeTab === "settings" || activeTab === "admin-users") && (
                <SettingsTab
                  userRole={userRole}
                  allData={{
                    bookings,
                    customers: [],
                    services,
                    expenses,
                    inventory,
                    suppliers,
                    staff
                  }}
                />
              )}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}

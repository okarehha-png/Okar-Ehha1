export type AdminRole = 'Owner' | 'Manager' | 'Accountant' | 'Staff';

export type BookingStatus = 
  | 'New'
  | 'Confirmed'
  | 'Assigned'
  | 'On The Way'
  | 'In Progress'
  | 'Completed'
  | 'Cancelled'
  | 'Received'; // Legacy support

export type PaymentStatus = 'Paid' | 'Partially Paid' | 'Pending';

export type PaymentMethod = 'Cash' | 'UPI' | 'Bank' | 'Other';

export interface Booking {
  id: string;
  fullName: string;
  mobile: string;
  email?: string;
  serviceName: string;
  packageName?: string;
  vehicleType?: string;
  vehicleNumber?: string;
  address: string;
  location?: string;
  areaZone?: string;
  date: string;
  time: string;
  amount: number;
  discount?: number;
  finalAmount: number;
  paymentReceived: number;
  pendingAmount: number;
  paymentMethod?: PaymentMethod | string;
  paymentStatus: PaymentStatus | string;
  status: BookingStatus;
  assignedStaff?: string;
  assignedStaffPhone?: string;
  notes?: string;
  technicianNotes?: string;
  beforePhotoUrl?: string;
  afterPhotoUrl?: string;
  customerRating?: number;
  customerReview?: string;
  isSubscription?: boolean;
  subscriptionPlanId?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  address?: string;
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalSpent: number;
  pendingAmount: number;
  lastService?: string;
  customerSince: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  estimatedDuration: string;
  description: string;
  isActive: boolean;
  packages?: { name: string; price: number; description?: string }[];
}

export type ExpenseCategory = 
  | 'Staff Salary'
  | 'Petrol'
  | 'Petrol / Vehicle Fuel'
  | 'Shampoo'
  | 'Car Shampoo & Foam'
  | 'Chemicals'
  | 'Chemicals & Degreasers'
  | 'Cleaning Equipment'
  | 'Equipment'
  | 'Equipment Repair'
  | 'Equipment Repair & Service'
  | 'Marketing'
  | 'Marketing & WhatsApp Ads'
  | 'Rent'
  | 'Office / Shed Rent'
  | 'Electricity'
  | 'Electricity & Power'
  | 'Phone/Internet'
  | 'Mobile & Internet'
  | 'Packaging'
  | 'Packaging & Gloves'
  | 'Other'
  | 'Other Operations'
  | string;

export interface Expense {
  id: string;
  date: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paidBy: string;
  paidTo?: string;
  receipt?: string;
  notes?: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  date: string;
  account?: 'Cash' | 'UPI' | 'Bank' | string;
  accountType?: 'Cash' | 'UPI' | 'Bank' | string;
  type: 'In' | 'Out' | 'Transfer' | string;
  amount: number;
  description: string;
  category: string;
  referenceId?: string;
  notes?: string;
  createdAt?: string;
}

export type FinancialTransaction = Transaction;

export interface FinancialAccount {
  id: string;
  name: string;
  accountType: 'Cash' | 'UPI' | 'Bank';
  balance: number;
  accountNumber?: string;
}

export interface InventoryItem {
  id: string;
  productName: string;
  category?: string;
  openingStock?: number;
  purchases?: number;
  used?: number;
  currentStock: number;
  unit: string; // 'Liters', 'Pcs', 'Kgs', 'Bottles', 'Cans'
  unitCost?: number;
  costPerUnit?: number;
  supplier?: string;
  supplierName?: string;
  minStockLevel: number;
  lastUpdated?: string;
  lastRestocked?: string;
}

export interface PurchaseOrder {
  id: string;
  supplierName: string;
  date: string;
  invoiceNumber?: string;
  productName?: string;
  itemsSummary?: string;
  quantity?: number;
  rate?: number;
  totalAmount: number;
  paidAmount?: number;
  pendingAmount?: number;
  paymentStatus?: 'Paid' | 'Partially Paid' | 'Pending';
  paymentMethod?: PaymentMethod;
  notes?: string;
  createdAt?: string;
}

export type Purchase = PurchaseOrder;

export interface Supplier {
  id: string;
  name: string;
  contactPerson?: string;
  mobile: string;
  email?: string;
  address?: string;
  products?: string;
  suppliesCategory?: string;
  totalPurchases?: number;
  totalPurchased?: number;
  pendingAmount?: number;
  pendingBalance?: number;
  lastPurchaseDate?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  mobile: string;
  role: string;
  joiningDate?: string;
  joinedDate?: string;
  salary?: number;
  baseSalary?: number;
  commissionPercentage?: number;
  status?: 'Active' | 'Inactive';
  isActive?: boolean;
  emergencyContact?: string;
  assignedJobsCount?: number;
  completedJobsCount?: number;
}

export interface AttendanceRecord {
  id: string;
  staffId: string;
  staffName: string;
  date: string;
  status: 'Present' | 'Absent' | 'Half Day' | 'Leave';
  checkInTime?: string;
  checkOutTime?: string;
  overtimeHours?: number;
  notes?: string;
}

export interface SalaryRecord {
  id: string;
  staffId: string;
  staffName: string;
  month: string; // 'YYYY-MM'
  baseSalary?: number;
  basicSalary?: number;
  commission?: number;
  incentive?: number;
  bonus?: number;
  overtime?: number;
  deductions?: number;
  advanceDeduction?: number;
  netSalary?: number;
  finalSalary?: number;
  paidDate?: string;
  paymentDate?: string;
  paymentMethod?: PaymentMethod | string;
  status: 'Paid' | 'Pending';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'stock' | 'salary' | 'supplier' | 'system';
  read: boolean;
  createdAt: string;
  linkTab?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  phone?: string;
}

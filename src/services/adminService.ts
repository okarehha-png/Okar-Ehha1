import { 
  collection, 
  getDocs, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  Booking, 
  Customer, 
  ServiceItem, 
  Expense, 
  Transaction, 
  InventoryItem, 
  Purchase, 
  Supplier, 
  StaffMember, 
  AttendanceRecord, 
  SalaryRecord, 
  NotificationItem,
  BookingStatus,
  PaymentStatus,
  PaymentMethod
} from '../types/admin';

// Default initial mock/seed data if Firestore collections are empty
export const initialServicesData: Omit<ServiceItem, 'id'>[] = [
  {
    name: 'Doorstep Car Wash',
    slug: 'car-wash',
    category: 'Vehicle Care',
    price: 499,
    estimatedDuration: '45-60 mins',
    description: 'High-pressure water wash, foam wash, tyre dressing & interior vacuuming at your doorstep.',
    isActive: true,
    packages: [
      { name: 'Eco Wash (Hatchback/Sedan)', price: 499 },
      { name: 'Deep Clean (SUV/Luxury)', price: 799 },
      { name: 'Complete Interior & Exterior Combo', price: 1299 }
    ]
  },
  {
    name: 'Bike & Scooter Wash',
    slug: 'bike-wash',
    category: 'Vehicle Care',
    price: 199,
    estimatedDuration: '30 mins',
    description: 'High-pressure foam wash, chain degreasing, tyre polish and rust-preventive coat.',
    isActive: true,
    packages: [
      { name: 'Standard Foam Wash', price: 199 },
      { name: 'Superbike / Premium Detail', price: 349 }
    ]
  },
  {
    name: 'Sofa & Upholstery Cleaning',
    slug: 'sofa-cleaning',
    category: 'Home Care',
    price: 799,
    estimatedDuration: '60-90 mins',
    description: 'Deep fabric extraction shampooing, stain removal, and anti-bacterial sanitization.',
    isActive: true,
    packages: [
      { name: '3-Seater Sofa Wash', price: 799 },
      { name: '5-Seater L-Shape Sofa Wash', price: 1299 },
      { name: '7-Seater Full Living Set', price: 1799 }
    ]
  },
  {
    name: 'Water Tank Cleaning',
    slug: 'water-tank-cleaning',
    category: 'Sanitization',
    price: 999,
    estimatedDuration: '90-120 mins',
    description: 'Mechanized 6-stage de-sludging, high-pressure rotary jet wash, UV sanitization & anti-bacterial treatment.',
    isActive: true,
    packages: [
      { name: 'Up to 1,000 Liters Tank', price: 999 },
      { name: '2,000 to 5,000 Liters Underground/Overhead', price: 1999 }
    ]
  },
  {
    name: 'Solar Panel Cleaning',
    slug: 'solar-panel-cleaning',
    category: 'Eco Cleaning',
    price: 699,
    estimatedDuration: '45 mins',
    description: 'De-mineralized soft brush cleaning for maximum solar efficiency and power output.',
    isActive: true,
    packages: [
      { name: 'Up to 10 Panels', price: 699 },
      { name: '11 to 25 Panels', price: 1399 }
    ]
  },
  {
    name: 'Carpet & Rug Cleaning',
    slug: 'carpet-cleaning',
    category: 'Home Care',
    price: 599,
    estimatedDuration: '45 mins',
    description: 'Deep fiber agitation, hot extraction wash and fast-dry technology.',
    isActive: true
  },
  {
    name: 'Kitchen Deep Cleaning',
    slug: 'kitchen-cleaning',
    category: 'Home Care',
    price: 1499,
    estimatedDuration: '2-3 hours',
    description: 'Oil, grease, chimney, tile degreasing and food-grade sanitization.',
    isActive: true
  }
];

export const initialStaffData: Omit<StaffMember, 'id'>[] = [
  {
    name: 'Ramesh Patel',
    mobile: '9826198711',
    role: 'Senior Washer / Driver',
    joiningDate: '2025-01-10',
    salary: 16000,
    status: 'Active',
    assignedJobsCount: 42,
    completedJobsCount: 40
  },
  {
    name: 'Sunil Kumar Yadav',
    mobile: '9826198722',
    role: 'Pressure Jet Specialist',
    joiningDate: '2025-02-01',
    salary: 15000,
    status: 'Active',
    assignedJobsCount: 38,
    completedJobsCount: 37
  },
  {
    name: 'Amit Verma',
    mobile: '9826198733',
    role: 'Detailing & Sofa Specialist',
    joiningDate: '2025-03-15',
    salary: 17500,
    status: 'Active',
    assignedJobsCount: 29,
    completedJobsCount: 28
  },
  {
    name: 'Vikas Sahu',
    mobile: '9826198744',
    role: 'Field Technician',
    joiningDate: '2025-05-01',
    salary: 14000,
    status: 'Active',
    assignedJobsCount: 22,
    completedJobsCount: 20
  }
];

export const initialInventoryData: Omit<InventoryItem, 'id'>[] = [
  {
    productName: 'Snow Foam Pro Car Shampoo (5L)',
    openingStock: 20,
    purchases: 10,
    used: 18,
    currentStock: 12,
    unit: 'Cans',
    costPerUnit: 1200,
    supplier: 'Chhattisgarh Auto Chemical Hub',
    minStockLevel: 5,
    lastUpdated: new Date().toISOString().split('T')[0]
  },
  {
    productName: 'Microfiber Drying Towels (800 GSM)',
    openingStock: 50,
    purchases: 25,
    used: 40,
    currentStock: 35,
    unit: 'Pcs',
    costPerUnit: 150,
    supplier: 'Royal Detailing Supplies Raipur',
    minStockLevel: 15,
    lastUpdated: new Date().toISOString().split('T')[0]
  },
  {
    productName: 'Tyre & Trim High-Gloss Dressing (5L)',
    openingStock: 10,
    purchases: 5,
    used: 11,
    currentStock: 4,
    unit: 'Cans',
    costPerUnit: 950,
    supplier: 'Chhattisgarh Auto Chemical Hub',
    minStockLevel: 6, // Low stock triggered!
    lastUpdated: new Date().toISOString().split('T')[0]
  },
  {
    productName: 'Sofa & Fabric Extraction Shampoo',
    openingStock: 15,
    purchases: 5,
    used: 12,
    currentStock: 8,
    unit: 'Liters',
    costPerUnit: 450,
    supplier: 'SafeClean Chemical Industries',
    minStockLevel: 5,
    lastUpdated: new Date().toISOString().split('T')[0]
  },
  {
    productName: 'Tank Sanitizer UV/Chlorine Granules',
    openingStock: 30,
    purchases: 10,
    used: 22,
    currentStock: 18,
    unit: 'Kgs',
    costPerUnit: 320,
    supplier: 'WaterGuard Solutions Bilaspur',
    minStockLevel: 10,
    lastUpdated: new Date().toISOString().split('T')[0]
  }
];

export const initialSuppliersData: Omit<Supplier, 'id'>[] = [
  {
    name: 'Chhattisgarh Auto Chemical Hub',
    mobile: '9893012345',
    products: 'Car Foam Shampoo, Tyre Polish, Degreaser',
    totalPurchases: 45000,
    pendingAmount: 6500,
    lastPurchaseDate: '2026-08-20'
  },
  {
    name: 'Royal Detailing Supplies Raipur',
    mobile: '9425267890',
    products: 'Microfiber Towels, Foam Cannons, Machine Pads',
    totalPurchases: 28000,
    pendingAmount: 0,
    lastPurchaseDate: '2026-08-15'
  },
  {
    name: 'WaterGuard Solutions Bilaspur',
    mobile: '9827112233',
    products: 'Tank Cleaning Tablets, Rotary Nozzles',
    totalPurchases: 18500,
    pendingAmount: 2200,
    lastPurchaseDate: '2026-08-24'
  }
];

export const initialExpensesData: Omit<Expense, 'id'>[] = [
  {
    date: new Date().toISOString().split('T')[0],
    category: 'Petrol',
    description: 'Fuel for Doorstep Service Van #CG12-AB-1234',
    amount: 1200,
    paymentMethod: 'UPI',
    paidBy: 'Ramesh Patel',
    notes: 'Covered 6 doorstep car wash locations across Korba TP Nagar & Kosabadi',
    createdAt: new Date().toISOString()
  },
  {
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    category: 'Shampoo',
    description: 'Restocked 2 Cans of Snow Foam High Gloss Shampoo',
    amount: 2400,
    paymentMethod: 'UPI',
    paidBy: 'Owner',
    notes: 'Bought from Auto Chemical Hub',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    category: 'Equipment Repair',
    description: 'High Pressure Jet Washer Hose nozzle replacement',
    amount: 850,
    paymentMethod: 'Cash',
    paidBy: 'Sunil Yadav',
    notes: 'Repaired at Power Tools Workshop Transport Nagar',
    createdAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    date: new Date(Date.now() - 432000000).toISOString().split('T')[0],
    category: 'Marketing',
    description: 'Local Instagram & WhatsApp Business Ads in Korba',
    amount: 1500,
    paymentMethod: 'Bank',
    paidBy: 'Owner',
    notes: 'Doorstep Monsoon Car Wash offer campaign',
    createdAt: new Date(Date.now() - 432000000).toISOString()
  }
];

export const initialTransactionsData: Omit<Transaction, 'id'>[] = [
  {
    date: new Date().toISOString().split('T')[0],
    account: 'UPI',
    type: 'In',
    amount: 799,
    description: 'Customer Payment - Rajesh Sharma (SUV Deep Clean)',
    category: 'Booking Revenue',
    referenceId: 'UPI-OKAR-9812',
    createdAt: new Date().toISOString()
  },
  {
    date: new Date().toISOString().split('T')[0],
    account: 'UPI',
    type: 'Out',
    amount: 1200,
    description: 'Van Petrol Expense - HP Petrol Pump Kosabadi',
    category: 'Petrol',
    referenceId: 'UPI-FUEL-4411',
    createdAt: new Date().toISOString()
  },
  {
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    account: 'Cash',
    type: 'In',
    amount: 1299,
    description: 'Cash Payment - Anita Mishra (Sofa Cleaning)',
    category: 'Booking Revenue',
    referenceId: 'CASH-REC-01',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    account: 'Bank',
    type: 'In',
    amount: 1999,
    description: 'NEFT Transfer - Water Tank Cleaning Korba Club House',
    category: 'Booking Revenue',
    referenceId: 'NEFT-55667788',
    createdAt: new Date(Date.now() - 172800000).toISOString()
  }
];

// Helper to calculate balances
export const calculateBalances = (transactions: Transaction[]) => {
  let cashIn = 0, cashOut = 0;
  let upiIn = 0, upiOut = 0;
  let bankIn = 0, bankOut = 0;

  // Base opening balances for Korba business branch
  const openingCash = 15000;
  const openingUpi = 28500;
  const openingBank = 85000;

  transactions.forEach((tx) => {
    const amt = Number(tx.amount) || 0;
    if (tx.account === 'Cash') {
      if (tx.type === 'In') cashIn += amt;
      else cashOut += amt;
    } else if (tx.account === 'UPI') {
      if (tx.type === 'In') upiIn += amt;
      else upiOut += amt;
    } else if (tx.account === 'Bank') {
      if (tx.type === 'In') bankIn += amt;
      else bankOut += amt;
    }
  });

  return {
    cash: {
      opening: openingCash,
      in: cashIn,
      out: cashOut,
      closing: openingCash + cashIn - cashOut
    },
    upi: {
      opening: openingUpi,
      in: upiIn,
      out: upiOut,
      closing: openingUpi + upiIn - upiOut
    },
    bank: {
      opening: openingBank,
      in: bankIn,
      out: bankOut,
      closing: openingBank + bankIn - bankOut
    },
    totalClosing: (openingCash + cashIn - cashOut) + (openingUpi + upiIn - upiOut) + (openingBank + bankIn - bankOut)
  };
};

// WhatsApp Message Builders for Okar Ehha
export const whatsAppTemplates = {
  bookingConfirmation: (b: Partial<Booking>) => {
    return encodeURIComponent(
      `✨ *OKAR EHHA - Booking Confirmed!* ✨\n\n` +
      `Namaste *${b.fullName || 'Customer'}*,\n` +
      `Your doorstep service request has been received and confirmed.\n\n` +
      `📋 *Booking ID:* ${b.id || 'OKAR-' + Math.floor(1000 + Math.random() * 9000)}\n` +
      `🛠️ *Service:* ${b.serviceName || 'Doorstep Car Wash'} ${b.packageName ? `(${b.packageName})` : ''}\n` +
      `📅 *Date & Time:* ${b.date || 'Today'} at ${b.time || 'Preferred Slot'}\n` +
      `📍 *Location:* ${b.address || 'Korba'}\n` +
      `💰 *Total Amount:* ₹${b.finalAmount || b.amount || 499}\n\n` +
      `Our verified team with high-pressure cleaning equipment will arrive on time.\n` +
      `For any query or reschedule: 📞 Call +91 79997 29630\n\n` +
      `Thank you for choosing *Okar Ehha Doorstep Services*!`
    );
  },

  bookingReminder: (b: Partial<Booking>) => {
    return encodeURIComponent(
      `🔔 *OKAR EHHA - Service Reminder* 🔔\n\n` +
      `Hello *${b.fullName || 'Customer'}*,\n` +
      `This is a gentle reminder that your *${b.serviceName || 'Car Wash'}* is scheduled for *${b.date}* at *${b.time}*.\n\n` +
      `📍 *Address:* ${b.address}\n` +
      `👤 *Assigned Technician:* ${b.assignedStaff || 'Senior Field Specialist'}\n\n` +
      `Please ensure water and vehicle access are available.\n` +
      `See you soon! 🚗✨`
    );
  },

  paymentReminder: (b: Partial<Booking>) => {
    const pending = (b.finalAmount || b.amount || 0) - (b.paymentReceived || 0);
    return encodeURIComponent(
      `💳 *OKAR EHHA - Payment Reminder* 💳\n\n` +
      `Hello *${b.fullName || 'Customer'}*,\n` +
      `Hope you loved our service! A pending balance of *₹${pending}* is due for your Booking #${b.id?.slice(0, 8)} (${b.serviceName}).\n\n` +
      `📱 *Pay via UPI:* 7999729630@okbizaxis / GPay / PhonePe / Paytm\n` +
      `Or pay in Cash to the service team.\n\n` +
      `Thank you for your prompt payment!\n` +
      `*Okar Ehha Korba*`
    );
  },

  serviceCompleted: (b: Partial<Booking>) => {
    return encodeURIComponent(
      `✅ *OKAR EHHA - Service Completed Successfully!* ✅\n\n` +
      `Dear *${b.fullName || 'Customer'}*,\n` +
      `Your *${b.serviceName}* has been completed with our highest quality standards.\n\n` +
      `💵 *Amount Paid:* ₹${b.finalAmount || b.amount}\n` +
      `⭐ Please take 10 seconds to share your valuable rating:\n` +
      `https://g.page/r/okar-ehha-korba/review\n\n` +
      `We look forward to serving you again! 🌟`
    );
  },

  thankYou: (b: Partial<Booking>) => {
    return encodeURIComponent(
      `🙏 *Thank You for Choosing Okar Ehha!* 🙏\n\n` +
      `Dear *${b.fullName || 'Customer'}*,\n` +
      `It was our absolute pleasure to serve you in Korba today. We hope your ${b.vehicleType || 'vehicle'} or home looks sparkling fresh!\n\n` +
      `Save this WhatsApp number for future bookings & special VIP discounts.\n` +
      `Website: https://okarehha.in`
    );
  },

  reviewRequest: (b: Partial<Booking>) => {
    return encodeURIComponent(
      `🌟 *How was your experience with Okar Ehha?* 🌟\n\n` +
      `Hi *${b.fullName || 'Customer'}*,\n` +
      `Your feedback helps our Korba team grow and improve. Could you please give us a 5-star Google review?\n\n` +
      `👉 Click here to review: https://g.page/r/okar-ehha-korba/review\n\n` +
      `Thank you so much for supporting local business!`
    );
  }
};

// CSV Export Utility
export const exportToCSV = (data: any[], filename: string) => {
  if (!data || !data.length) {
    alert("No data available to export.");
    return;
  }
  const headers = Object.keys(data[0]);
  const csvRows: string[] = [];
  
  // Header row
  csvRows.push(headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','));
  
  // Data rows
  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header];
      const escaped = ('' + (val ?? '')).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }
  
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

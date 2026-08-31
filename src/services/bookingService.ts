import { db } from '../lib/firebase';
import { collection, addDoc, getDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

export interface BookingData {
  serviceId: string;
  packageId: string;
  date: string;
  time: string;
  fullName: string;
  mobile: string;
  email?: string;
  address: string;
  landmark?: string;
  notes?: string;
}

export const bookingService = {
  createBooking: async (bookingData: BookingData & { amount: number, serviceName: string, packageName: string, vehicleType?: string, areaZone?: string }) => {
    try {
      const docRef = await addDoc(collection(db, 'bookings'), {
        ...bookingData,
        status: 'Received',
        paymentStatus: 'Pending',
        paymentReceived: 0,
        pendingAmount: bookingData.amount,
        finalAmount: bookingData.amount,
        createdAt: new Date().toISOString()
      });
      return { success: true, bookingId: docRef.id };
    } catch (e) {
      console.error("Error adding document: ", e);
      return { success: false, bookingId: `OE-${Date.now().toString().slice(-6)}` };
    }
  },
  
  getBookingDetails: async (bookingId: string) => {
    try {
      const docRef = doc(db, 'bookings', bookingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (e) {
      console.error("Error getting document: ", e);
      return null;
    }
  },

  getAllBookings: async () => {
    try {
      const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const bookings: any[] = [];
      querySnapshot.forEach((doc) => {
        bookings.push({ id: doc.id, ...doc.data() });
      });
      return bookings;
    } catch (e) {
      console.error("Error getting documents: ", e);
      return [];
    }
  },

  updateBookingStatus: async (bookingId: string, status: string) => {
    try {
      const docRef = doc(db, 'bookings', bookingId);
      await updateDoc(docRef, { status });
      return true;
    } catch (e) {
      console.error("Error updating document: ", e);
      return false;
    }
  },

  updatePaymentStatus: async (bookingId: string, paymentStatus: string, paymentReceived?: number, paymentMethod?: string) => {
    try {
      const docRef = doc(db, 'bookings', bookingId);
      const payload: any = { paymentStatus };
      if (paymentReceived !== undefined) payload.paymentReceived = paymentReceived;
      if (paymentMethod) payload.paymentMethod = paymentMethod;
      await updateDoc(docRef, payload);
      return true;
    } catch (e) {
      console.error("Error updating document: ", e);
      return false;
    }
  },

  submitRating: async (bookingId: string, rating: number, review?: string) => {
    try {
      const docRef = doc(db, 'bookings', bookingId);
      await updateDoc(docRef, {
        customerRating: rating,
        customerReview: review || '',
        reviewedAt: new Date().toISOString()
      });
      return true;
    } catch (e) {
      console.error("Error submitting rating: ", e);
      return false;
    }
  },

  updatePhotosAndNotes: async (bookingId: string, data: { beforePhotoUrl?: string, afterPhotoUrl?: string, technicianNotes?: string }) => {
    try {
      const docRef = doc(db, 'bookings', bookingId);
      await updateDoc(docRef, data);
      return true;
    } catch (e) {
      console.error("Error updating photos: ", e);
      return false;
    }
  },

  deleteBooking: async (bookingId: string) => {
    try {
      const docRef = doc(db, 'bookings', bookingId);
      await deleteDoc(docRef);
      return true;
    } catch (e) {
      console.error("Error deleting document: ", e);
      return false;
    }
  }
};

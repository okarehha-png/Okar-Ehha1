import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: "sincere-flow-zlkqp",
  appId: "1:631779108949:web:2cceac21bcecf85e2b0cdc",
  apiKey: "AIzaSyCyxOQvpei_WEWe_kbPc5IpKjdCyTMmHFU",
  authDomain: "sincere-flow-zlkqp.firebaseapp.com",
  storageBucket: "sincere-flow-zlkqp.firebasestorage.app",
  messagingSenderId: "631779108949"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "ai-studio-okarehha-b313167f-c99f-49bc-8cb4-7b6338019793");
export const auth = getAuth(app);

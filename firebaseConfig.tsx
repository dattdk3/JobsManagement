// firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getMessaging } from 'firebase/messaging';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyC8IS059bnNVIRrChb3RBqfU5_jkCO-gxE",
  authDomain: "jobproject-fa9d8.firebaseapp.com",
  projectId: "jobproject-fa9d8",
  storageBucket: "jobproject-fa9d8.firebasestorage.app", 
  messagingSenderId: "882927411419",
  appId: "1:882927411419:web:3dbecae8193ccaf2caacfe",
  measurementId: "G-HG43RDX18X"
};

// ✅ Khởi tạo app Firebase
const app = initializeApp(firebaseConfig);

// ✅ Khởi tạo các dịch vụ
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);

// ✅ Messaging chỉ dùng khi có môi trường trình duyệt (web/PWA)
let messaging;
if (typeof window !== 'undefined' && 'Notification' in window) {
  messaging = getMessaging(app);
}

export { app, messaging as message };

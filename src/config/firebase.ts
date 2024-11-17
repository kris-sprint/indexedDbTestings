import { getMessaging } from "@firebase/messaging";
import { initializeApp } from '@firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyAqkmdTEdSblfmpf236_RKibuks-3zGRBI",
  authDomain: "pinpoint-fdef8.firebaseapp.com",
  projectId: "pinpoint-fdef8",
  storageBucket: "pinpoint-fdef8.firebasestorage.app",
  messagingSenderId: "855562263974",
  appId: "1:855562263974:web:faa12bd356b8b9e3b9c367"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const messaging = getMessaging(firebaseApp);
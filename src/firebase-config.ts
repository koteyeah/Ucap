import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// export const firebaseConfig = {
//   apiKey: "AIzaSyDPSC6sMG-C-vT8XS674tlcXQOU0JfqY6Y",
//   authDomain: "tintest-4acf9.firebaseapp.com",
//   projectId: "tintest-4acf9",
//   storageBucket: "tintest-4acf9.appspot.com",
//   messagingSenderId: "941617256767",
//   appId: "1:941617256767:web:fffc18676784ebdad31b8a",
//   measurementId: "G-77WWJE7CNG",
// };
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const mapApiKey = process.env.NEXT_PUBLIC_MAP_API_KEY;

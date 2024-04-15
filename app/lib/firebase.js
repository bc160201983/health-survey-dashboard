// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBCbarwY5FQZ0hY0iufyULVMjKMzZoRNj0",
  authDomain: "health-app-react.firebaseapp.com",
  projectId: "health-app-react",
  storageBucket: "health-app-react.appspot.com",
  messagingSenderId: "912573667215",
  appId: "1:912573667215:web:3012fd42a8ec64c7e31dfa",
  measurementId: "G-7LM1B2RCS7",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export default db;

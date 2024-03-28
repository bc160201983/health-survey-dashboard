// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBI7es8AhqdbsOaR5x_Efl8s-mwLU47ons",
  authDomain: "health-app-3d491.firebaseapp.com",
  projectId: "health-app-3d491",
  storageBucket: "health-app-3d491.appspot.com",
  messagingSenderId: "415856308958",
  appId: "1:415856308958:web:129f171d0b8b7364ba084f",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export default db;

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyARFxPYVnUpFvUdmCMMgOspOMGSX_Y26Pg",
  authDomain: "webprofitai.firebaseapp.com",
  projectId: "webprofitai",
  storageBucket: "webprofitai.firebasestorage.app",
  messagingSenderId: "29810089088",
  appId: "1:29810089088:web:ca3923e23a62779d1d1a65",
  measurementId: "G-E6SHYTKE8F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
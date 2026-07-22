import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyARFxPYVnUpFvUdmCMMgOspOMGSX_Y26Pg",
  authDomain: "webprofitai.firebaseapp.com",
  projectId: "webprofitai",
  storageBucket: "webprofitai.firebasestorage.app",
  messagingSenderId: "29810089088",
  appId: "1:29810089088:web:ca3923e23a62779d1d1a65",
  measurementId: "G-E6SHYTKE8F"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
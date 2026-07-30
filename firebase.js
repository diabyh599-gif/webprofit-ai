// ==========================================
// FIREBASE.JS - Version CDN (pour GitHub Pages)
// ==========================================

// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyARFxPYVnUpFvUdmCMMgOspOMGSX_Y26Pg",
    authDomain: "webprofitai.firebaseapp.com",
    projectId: "webprofitai",
    storageBucket: "webprofitai.firebasestorage.app",
    messagingSenderId: "29810089088",
    appId: "1:29810089088:web:ca3923e23a62779d1d1a65",
    measurementId: "G-E6SHYTKE8F"
};

// Initialiser Firebase
firebase.initializeApp(firebaseConfig);

// Services disponibles
const auth = firebase.auth();
const db = firebase.firestore();
const provider = new firebase.auth.GoogleAuthProvider();

console.log('🔥 Firebase connecté avec succès !');
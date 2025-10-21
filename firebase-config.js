// firebase-config.js
// ✅ Must be loaded AFTER firebase-app-compat.js, BEFORE any other scripts

const firebaseConfig = {
    apiKey: "AIzaSyBcb4VreNGceQNxyCWh2tDl8ARGkCiptSQ",
    authDomain: "vendor-pos.firebaseapp.com",
    projectId: "vendor-pos",
    storageBucket: "vendor-pos.firebasestorage.app",
    messagingSenderId: "729715567147",
    appId: "1:729715567147:web:2b04c4ff14fd09daa7186e"
  };
  
  // Initialize once
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  
  const auth = firebase.auth();
  const db = firebase.firestore();
  const storage = firebase.storage();
  
  // ✅ Attach globally so other scripts can use them
  window.firebaseConfig = firebaseConfig;
  window.auth = auth;
  window.db = db;
  window.storage = storage;
  
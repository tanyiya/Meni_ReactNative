// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC0Pgghg7vwh5GI67Mq1yl8PLmX-XaJZ20",
  authDomain: "meni-reactnative.firebaseapp.com",
  projectId: "meni-reactnative",
  storageBucket: "meni-reactnative.firebasestorage.app",
  messagingSenderId: "296699811775",
  appId: "1:296699811775:web:4165deb1712d670610b30a"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
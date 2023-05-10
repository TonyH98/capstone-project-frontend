// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCEkyTPxozZRuN-yvW423veOhog-6fJv2I",
  authDomain: "kickit-b6381.firebaseapp.com",
  projectId: "kickit-b6381",
  storageBucket: "kickit-b6381.appspot.com",
  messagingSenderId: "22182656502",
  appId: "1:22182656502:web:7462d74abb940d4cb7afd7",
  measurementId: "G-SNN7BY9N2N",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;
export const auth = getAuth(app);

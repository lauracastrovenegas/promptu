// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC0dBiY-wDc_hMuwjAdHHjpgKgDqmDL2W4",
  authDomain: "promptu-cs278.firebaseapp.com",
  projectId: "promptu-cs278",
  storageBucket: "promptu-cs278.appspot.com",
  messagingSenderId: "20940171622",
  appId: "1:20940171622:web:096c16007ad10c3459c0a7",
  measurementId: "G-SNGG5GLP88"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});


// export const auth = getAuth(app);
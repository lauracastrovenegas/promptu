import { initializeApp, getApps } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, setDoc, doc, getDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Firebase Storage
const storage = getStorage();

// Initialize Firestore
const db = getFirestore(app);

// Initialize Authentication
let auth;
if (!getAuth(app)) {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
} else {
  auth = getAuth(app);
}

export const addUserToFirestore = async (user) => {
  try {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        name: user.displayName,
        id: user.uid,
        photo: user.photoURL
      });
    }
  } catch (err) {
    console.log("Error in adding user to DB", error.message);
  }
};

export const uploadImageAsync = async (uri) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const storageRef = ref(storage, `images/${filename}`);
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.log("Error uploading image: ", error);
    throw error;
  }
};

export const getUserData = async (uid) => {
  try {
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      console.log("No user document exists.")
    }
  } catch (error) {
    console.log("Error getting document: ", error.message);
  }
}

// Export db, auth, and app to be accessible for other files.
export { db, auth, app };
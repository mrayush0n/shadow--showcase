
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDJFppvZDz1kAuHgK_S5akDBOTIdlSHbUk",
  authDomain: "wtfmf-c573b.firebaseapp.com",
  projectId: "wtfmf-c573b",
  storageBucket: "wtfmf-c573b.firebasestorage.app",
  messagingSenderId: "311204761651",
  appId: "1:311204761651:web:40088a5fab7332de839346",
  measurementId: "G-41TDZSYZJN"
};

// Initialize Firebase
// Check if apps are already initialized to prevent errors with global script loading
const app = firebase.apps.length > 0 ? firebase.app() : firebase.initializeApp(firebaseConfig);

// Export services with safety checks
export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();
export const googleProvider = new firebase.auth.GoogleAuthProvider();

// Fix for "operation-not-supported-in-this-environment"
const configurePersistence = async () => {
  try {
    if (auth) {
      await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    }
  } catch (e) {
    console.warn("Local persistence not supported (likely file:// or restricted env). Auth state may not persist.", e);
    try {
      if (auth) {
        await auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
      }
    } catch (e2) {
       // Last resort: no persistence
       if (auth) {
         auth.setPersistence(firebase.auth.Auth.Persistence.NONE).catch(console.error);
       }
    }
  }
};

configurePersistence();

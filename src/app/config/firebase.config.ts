import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getAnalytics } from "firebase/analytics"

const firebaseConfig = {
  apiKey: "AIzaSyDdFkcrV3VhyoDgBk97EAbNhNfy3EQNSHA",
  authDomain: "employeeapp-2f7d8.firebaseapp.com",
  projectId: "employeeapp-2f7d8",
  storageBucket: "employeeapp-2f7d8.appspot.com",
  messagingSenderId: "772928379708",
  appId: "1:772928379708:web:364ff7918509e0e13f5c39",
  measurementId: "G-QHSE318L6Y",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const analytics = getAnalytics(app)

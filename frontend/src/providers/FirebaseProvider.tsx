import React, { createContext, useContext, ReactNode } from 'react'
import { initializeApp } from 'firebase/app'
import { getFirestore, Firestore } from 'firebase/firestore'
//import { getAnalytics } from "firebase/analytics";

// Define the type for the Firebase context
interface FirebaseContextType {
  db: Firestore
}

// Provider component
interface FirebaseProviderProps {
  children: ReactNode
}

// Initialize Firebase with config
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
}

const app = initializeApp(firebaseConfig)

// Create the Firebase context
const FirebaseContext = createContext<FirebaseContextType | undefined>(
  undefined,
)

// Custom hook to access the Firebase context
export const useFirebase = () => {
  const context = useContext(FirebaseContext)
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider')
  }
  return context
}

// Provider component
export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  children,
}) => {
  const db = getFirestore(app)

  return (
    <FirebaseContext.Provider value={{ db }}>
      {children}
    </FirebaseContext.Provider>
  )
}

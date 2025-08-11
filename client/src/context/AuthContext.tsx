// /client/src/context/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { onAuthStateChanged, type User as FirebaseAuthUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase-config';  

// Define the structure of our user object, combining Auth and Firestore data
interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: string;
  customId: string;
  // Add any other user-specific fields from your 'users' collection here
  profile: {
    degree: string;
    curriculum: string;
    avatarUrl: string;
    advisorId: string;
  }
}

interface AuthContextType {
  currentUser: AppUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseAuthUser | null) => {
      if (firebaseUser) {
        // User is signed in, now fetch their Firestore data
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const firestoreData = userDocSnap.data();
          setCurrentUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            role: firestoreData.role,
            customId: firestoreData.customId,
            profile: firestoreData.profile
          });
        } else {
          console.error("No user document found in Firestore for UID:", firebaseUser.uid);
          setCurrentUser(null);
        }
      } else {
        // User is signed out
        setCurrentUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
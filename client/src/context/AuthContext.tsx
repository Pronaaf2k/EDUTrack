// /client/src/context/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect, type ReactNode, useMemo } from 'react'; // ✅ Import useMemo
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
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ✅ FIX: Memoize the context value to prevent unnecessary re-renders of consuming components.
  // This is the critical fix for the live application.
  const value = useMemo(() => ({ currentUser, loading }), [currentUser, loading]);

  return (
    <AuthContext.Provider value={value}>
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
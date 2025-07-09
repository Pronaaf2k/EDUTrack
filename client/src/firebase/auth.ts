import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase-config";

export const signInUser = async (customId: string, password: string) => {
  // 1. Find the user document in Firestore based on the customId
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("customId", "==", customId));
  
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    // If no user is found with that customId, throw an error.
    console.error("No user found with customId:", customId);
    throw new Error("Invalid username or password.");
  }

  // 2. Get the user's data, including the dummy email
  const userData = querySnapshot.docs[0].data();
  const email = userData.email;

  if (!email) {
    // This is a data integrity check
    console.error("User document is missing the email field.");
    throw new Error("User account is not configured correctly. Please contact an admin.");
  }

  try {
    // 3. Use the retrieved email and the provided password to sign in with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log("Firebase Auth sign-in successful for:", user.uid);

    // 4. Return the user data along with the role from Firestore
    return {
      uid: user.uid,
      email: user.email,
      role: userData.role,
      customId: userData.customId,
    };
  } catch (error: any) {
    // If Firebase Auth fails (e.g., wrong password), throw a user-friendly error.
    console.error("Firebase Auth sign-in error:", error.code);
    throw new Error("Invalid username or password.");
  }
};
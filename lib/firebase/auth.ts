import { auth, firestore } from "./client";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as fbSignOut,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

const provider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  if (!auth) throw new Error("Firebase auth not configured");
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  if (!user) return null;

  if (firestore) {
    const ref = doc(firestore, "users", user.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        uid: user.uid,
        email: user.email || null,
        displayName: user.displayName || null,
        photoURL: user.photoURL || null,
        role: "reader", // Default role for new users
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  }

  return user;
}

export function signOut() {
  if (!auth) return Promise.resolve();
  return fbSignOut(auth);
}

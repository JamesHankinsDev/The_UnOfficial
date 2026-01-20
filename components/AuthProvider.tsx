"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, firestore } from "../lib/firebase/client";
import {
  signInWithGoogle as _signInWithGoogle,
  signOut as _signOut,
} from "../lib/firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import type { NotificationPreferences } from "../lib/firebase/users";

type Profile = {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  role?: "owner" | "admin" | "writer" | "reader";
  notificationPreferences?: NotificationPreferences;
};

type AuthContextValue = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<any>;
  signOut: () => Promise<any>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export default function Providers({ children }: { children: React.ReactNode }) {
  const authValue = useProvideAuth();
  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

function useProvideAuth(): AuthContextValue {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setUser(null);
      setProfile(null);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setLoading(false); // Set loading false immediately after auth state is known

      // Fetch profile asynchronously without blocking
      if (u && firestore) {
        try {
          const ref = doc(firestore, "users", u.uid);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            setProfile(snap.data() as Profile);
          } else {
            setProfile(null);
          }
        } catch (error) {
          console.error("Error fetching profile (non-blocking):", error);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    profile,
    loading,
    signInWithGoogle: _signInWithGoogle,
    signOut: _signOut,
  };
}

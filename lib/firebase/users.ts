import { firestore } from "./client";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";

export interface NotificationPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  phoneNumber?: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: string;
  notificationPreferences?: NotificationPreferences;
  createdAt: any;
  updatedAt: any;
}

export async function getUserProfile(
  userId: string,
): Promise<UserProfile | null> {
  if (!firestore) return null;

  const userDoc = await getDoc(doc(firestore, "users", userId));
  if (!userDoc.exists()) return null;

  return userDoc.data() as UserProfile;
}

export async function updateNotificationPreferences(
  userId: string,
  preferences: NotificationPreferences,
): Promise<void> {
  if (!firestore) throw new Error("Firestore not initialized");

  await updateDoc(doc(firestore, "users", userId), {
    notificationPreferences: preferences,
    updatedAt: serverTimestamp(),
  });
}

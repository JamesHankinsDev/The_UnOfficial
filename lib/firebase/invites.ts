import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { firestore } from "./client";

export type InviteCode = {
  id?: string;
  code: string;
  role: "writer" | "reader";
  createdBy: string;
  createdByName: string;
  usedBy?: string;
  usedByName?: string;
  usedAt?: any;
  createdAt?: any;
  expiresAt?: any;
};

export async function generateInviteCode(
  userId: string,
  userName: string,
  role: "writer" | "reader" = "writer"
): Promise<string> {
  if (!firestore) throw new Error("Firestore not initialized");

  // Generate a random 8-character code
  const code = Math.random().toString(36).substring(2, 10).toUpperCase();

  const invitesRef = collection(firestore, "inviteCodes");
  const docRef = await addDoc(invitesRef, {
    code,
    role,
    createdBy: userId,
    createdByName: userName,
    createdAt: serverTimestamp(),
    expiresAt: null, // No expiration for now
    usedBy: null,
    usedByName: null,
    usedAt: null,
  });

  return code;
}

export async function validateInviteCode(
  code: string
): Promise<InviteCode | null> {
  if (!firestore) throw new Error("Firestore not initialized");

  const invitesRef = collection(firestore, "inviteCodes");
  const q = query(invitesRef, where("code", "==", code.toUpperCase()));
  const snap = await getDocs(q);

  if (snap.empty) return null;

  const doc = snap.docs[0];
  const data = doc.data() as InviteCode;

  // Check if code has already been used
  if (data.usedBy) return null;

  // Check if code has expired (if expiration is set)
  if (data.expiresAt && data.expiresAt.toMillis() < Date.now()) {
    return null;
  }

  return { id: doc.id, ...data };
}

export async function useInviteCode(
  inviteId: string,
  userId: string,
  userName: string
): Promise<void> {
  if (!firestore) throw new Error("Firestore not initialized");

  const inviteRef = doc(firestore, "inviteCodes", inviteId);
  await updateDoc(inviteRef, {
    usedBy: userId,
    usedByName: userName,
    usedAt: serverTimestamp(),
  });
}

export async function getInviteCodes(userId: string): Promise<InviteCode[]> {
  if (!firestore) throw new Error("Firestore not initialized");

  const invitesRef = collection(firestore, "inviteCodes");
  const q = query(invitesRef, where("createdBy", "==", userId));
  const snap = await getDocs(q);

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as InviteCode),
  }));
}

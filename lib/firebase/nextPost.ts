import { firestore } from "./client";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";

export async function getNextScheduledPost(currentReleaseDate: Date) {
  if (!firestore) throw new Error("Firestore not initialized");
  const postsRef = collection(firestore, "posts");
  const q = query(
    postsRef,
    where("status", "==", "published"),
    where("releaseDate", ">", currentReleaseDate),
    orderBy("releaseDate", "asc"),
    orderBy("createdAt", "asc"),
    limit(1),
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const doc = snap.docs[0];
  return { id: doc.id, ...doc.data() };
}

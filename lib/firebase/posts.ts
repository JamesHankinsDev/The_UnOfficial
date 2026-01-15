import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "./client";

export type PostStatus = "draft" | "published" | "archived";

export type Post = {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  status: PostStatus;
  tags?: string[];
  coverImage?: string;
  publishedAt?: any;
  createdAt?: any;
  updatedAt?: any;
};

export async function createPost(
  post: Omit<Post, "id" | "createdAt" | "updatedAt">
) {
  if (!firestore) throw new Error("Firestore not initialized");

  const postsRef = collection(firestore, "posts");
  const docRef = await addDoc(postsRef, {
    ...post,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    publishedAt: post.status === "published" ? serverTimestamp() : null,
  });

  return docRef.id;
}

export async function updatePost(postId: string, updates: Partial<Post>) {
  if (!firestore) throw new Error("Firestore not initialized");

  const postRef = doc(firestore, "posts", postId);
  await updateDoc(postRef, {
    ...updates,
    updatedAt: serverTimestamp(),
    ...(updates.status === "published" && { publishedAt: serverTimestamp() }),
  });
}

export async function deletePost(postId: string) {
  if (!firestore) throw new Error("Firestore not initialized");

  const postRef = doc(firestore, "posts", postId);
  await deleteDoc(postRef);
}

export async function getPost(postId: string) {
  if (!firestore) throw new Error("Firestore not initialized");

  const postRef = doc(firestore, "posts", postId);
  const snap = await getDoc(postRef);

  if (!snap.exists()) return null;

  return { id: snap.id, ...snap.data() } as Post;
}

export async function getPostBySlug(slug: string) {
  if (!firestore) throw new Error("Firestore not initialized");

  const postsRef = collection(firestore, "posts");
  const q = query(postsRef, where("slug", "==", slug));
  const snap = await getDocs(q);

  if (snap.empty) return null;

  const doc = snap.docs[0];
  return { id: doc.id, ...doc.data() } as Post;
}

"use client";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { firestore } from "../lib/firebase/client";
import PostCard from "../components/PostCard";

type Post = {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  authorName: string;
  publishedAt?: { seconds: number };
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      if (!firestore) {
        // Firestore not configured; skip loading posts during local dev
        setPosts([]);
        setLoading(false);
        return;
      }
      const q = query(
        collection(firestore, "posts"),
        where("status", "==", "published"),
        orderBy("publishedAt", "desc"),
        limit(10)
      );
      const snap = await getDocs(q);
      const items: Post[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      }));
      setPosts(items);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Latest posts</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      )}
    </div>
  );
}

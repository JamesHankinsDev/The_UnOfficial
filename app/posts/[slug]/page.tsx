"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { firestore } from "../../../lib/firebase/client";
import MarkdownRenderer from "../../../components/MarkdownRenderer";

export default function PostDetail({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [post, setPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      setLoading(true);
      if (!firestore) {
        setPost(null);
        setLoading(false);
        return;
      }
      const q = query(
        collection(firestore, "posts"),
        where("slug", "==", slug),
        where("status", "==", "published"),
        limit(1)
      );
      const snap = await getDocs(q);
      if (snap.empty) {
        setPost(null);
        setLoading(false);
        return;
      }
      const d = snap.docs[0];
      setPost({ id: d.id, ...(d.data() as any) });
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) return <p>Loading...</p>;
  if (!post) return <p>Post not found or not published.</p>;

  return (
    <article>
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <div className="text-sm text-gray-500 mb-6">By {post.authorName}</div>
      {post.coverImageUrl ? (
        <img
          src={post.coverImageUrl}
          alt="cover"
          className="w-full rounded mb-4"
        />
      ) : null}
      <MarkdownRenderer content={post.content || ""} />
    </article>
  );
}

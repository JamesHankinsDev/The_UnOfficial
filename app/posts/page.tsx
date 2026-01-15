"use client";
import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { firestore } from "../../lib/firebase/client";
import PostCard from "../../components/PostCard";

export default function PostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      if (!firestore) {
        setPosts([]);
        setLoading(false);
        return;
      }
      const q = query(
        collection(firestore, "posts"),
        where("status", "==", "published"),
        orderBy("publishedAt", "desc")
      );
      const snap = await getDocs(q);
      const items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
      setPosts(items);
      setLoading(false);
    }
    load();
  }, []);

  const tags = useMemo(() => {
    const s = new Set<string>();
    posts.forEach((p) => (p.tags || []).forEach((t: string) => s.add(t)));
    return Array.from(s);
  }, [posts]);

  const filtered = posts.filter((p) => {
    const matchesSearch = [p.title, p.excerpt, ...(p.tags || [])]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesTag = selectedTag
      ? (p.tags || []).includes(selectedTag)
      : true;
    return matchesSearch && matchesTag;
  });

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-4">All posts</h1>
      <div className="mb-4 flex gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search posts"
          className="px-3 py-2 border rounded w-full"
        />
      </div>
      <div className="mb-4 flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedTag(null)}
          className={`px-2 py-1 rounded ${
            selectedTag == null ? "bg-gray-800 text-white" : "bg-gray-100"
          }`}
        >
          All
        </button>
        {tags.map((t) => (
          <button
            key={t}
            onClick={() => setSelectedTag(t)}
            className={`px-2 py-1 rounded ${
              selectedTag === t ? "bg-gray-800 text-white" : "bg-gray-100"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {filtered.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      )}
    </div>
  );
}

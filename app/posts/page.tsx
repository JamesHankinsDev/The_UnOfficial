"use client";
import { useMemo, useState } from "react";
import { usePosts } from "../../lib/usePosts";
import PostCard from "../../components/PostCard";
import Head from "next/head";

export default function PostsPage() {
  const { posts, loading } = usePosts();
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // ...existing code...

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
    // Hide posts with a future releaseDate
    const now = new Date();
    const isReleased =
      !p.releaseDate ||
      (p.releaseDate.toDate && p.releaseDate.toDate() <= now) ||
      (!p.releaseDate.toDate && new Date(p.releaseDate) <= now);

    return matchesSearch && matchesTag && isReleased;
  });

  return (
    <>
      <Head>
        <title>All Posts | The UnOfficial</title>
        <meta name="description" content="Browse all NBA articles, stories, and hot takes from The UnOfficial community." />
      </Head>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary dark:text-tertiary mb-2">
            All Posts
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explore our latest articles and insights
          </p>
        </div>

        <div className="mb-6">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts by title, excerpt, or tags..."
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-primary.main dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-tertiary focus:border-transparent"
          />
        </div>

        {tags.length > 0 && (
          <div className="mb-8">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Filter by tag:
            </p>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedTag == null
                    ? "bg-tertiary text-primary shadow-md"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                All
              </button>
              {tags.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTag(t)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedTag === t
                      ? "bg-tertiary text-primary shadow-md"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Loading posts...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              No posts found matching your criteria.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
            {filtered.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

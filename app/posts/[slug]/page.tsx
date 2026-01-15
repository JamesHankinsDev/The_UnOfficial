"use client";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPostBySlug } from "../../../lib/firebase/posts";
import type { Post } from "../../../lib/firebase/posts";
import MarkdownRenderer from "../../../components/MarkdownRenderer";

export default function PostDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const postData = await getPostBySlug(slug);

        if (!postData || postData.status !== "published") {
          setPost(null);
        } else {
          setPost(postData);
        }
      } catch (err) {
        console.error("Error loading post:", err);
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600 dark:text-gray-400">Loading post...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Post Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The post you're looking for doesn't exist or is no longer published.
        </p>
        <a
          href="/posts"
          className="px-6 py-3 bg-tertiary text-primary font-medium rounded-lg hover:bg-accent transition-colors inline-block"
        >
          Browse All Posts
        </a>
      </div>
    );
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <article className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-tertiary mb-4">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-4 italic">
            {post.excerpt}
          </p>
        )}
        <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
          <span className="font-medium text-gray-900 dark:text-gray-100">
            By {post.authorName}
          </span>
          {post.publishedAt && (
            <>
              <span>•</span>
              <time>{formatDate(post.publishedAt)}</time>
            </>
          )}
        </div>
        {post.tags && post.tags.length > 0 && (
          <div className="flex gap-2 mt-4">
            {post.tags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-tertiary/10 text-tertiary dark:bg-tertiary/20 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {post.coverImage && (
        <img
          src={post.coverImage}
          alt="cover"
          className="w-full rounded-lg mb-8 shadow-lg"
        />
      )}

      <div className="prose prose-lg dark:prose-invert prose-gray dark:prose-gray max-w-none">
        <MarkdownRenderer content={post.content || ""} />
      </div>

      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <a
          href="/posts"
          className="text-tertiary hover:text-accent transition-colors inline-flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to all posts
        </a>
      </div>
    </article>
  );
}

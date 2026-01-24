"use client";
import { use, useEffect, useState } from "react";
import { formatDate } from "../../../lib/formatDate";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { getPostBySlug } from "../../../lib/firebase/posts";
import type { Post } from "../../../lib/firebase/posts";
import { getNextScheduledPost } from "../../../lib/firebase/nextPost";
import MarkdownRenderer from "../../../components/MarkdownRenderer";
import SubscribeForm from "../../../components/SubscribeForm";

export default function PostDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [post, setPost] = useState<Post | null>(null);
  const [nextPost, setNextPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const postData = await getPostBySlug(slug);
        const now = new Date();
        if (
          !postData ||
          postData.status !== "published" ||
          (postData.releaseDate &&
            ((postData.releaseDate.toDate &&
              postData.releaseDate.toDate() > now) ||
              (!postData.releaseDate.toDate &&
                new Date(postData.releaseDate) > now)))
        ) {
          setPost(null);
        } else {
          setPost(postData);
          // Fetch next scheduled post
          let releaseDate = postData.releaseDate;
          if (releaseDate?.toDate) releaseDate = releaseDate.toDate();
          else if (releaseDate?.seconds)
            releaseDate = new Date(releaseDate.seconds * 1000);
          else releaseDate = new Date(releaseDate);
          const next = await getNextScheduledPost(releaseDate);
          setNextPost(next);
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
      <>
        <Head>
          <title>Loading... | The UnOfficial</title>
          <meta name="robots" content="noindex" />
        </Head>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-gray-600 dark:text-gray-400">Loading post...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Head>
          <title>Error | The UnOfficial</title>
          <meta name="robots" content="noindex" />
        </Head>
        <div className="max-w-4xl mx-auto text-center py-12">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Head>
          <title>Post Not Found | The UnOfficial</title>
          <meta name="robots" content="noindex" />
        </Head>
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
      </>
    );
  }



  // Calculate read time (average 200 words/minute)
  const getReadTime = (text: string) => {
    if (!text) return 1;
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.round(words / 200));
  };
  // Listen time: try to get from post.audioDuration (in seconds), else null
  const getListenTime = (audioDuration?: number | null) => {
    if (!audioDuration) return null;
    return Math.max(1, Math.round(audioDuration / 60));
  };

  const readTime = getReadTime(post.content || "");
  const listenTime = getListenTime(post.audioDuration);

  return (
    <>
      <Head>
        <title>{post.title} | The UnOfficial</title>
        <meta name="description" content={post.excerpt || post.title} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || post.title} />
        {post.coverImage && (
          <meta property="og:image" content={post.coverImage} />
        )}
        <meta property="og:type" content="article" />
        <meta
          property="og:url"
          content={typeof window !== "undefined" ? window.location.href : ""}
        />
      </Head>
      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-tertiary mb-4">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400">
            <span className="font-medium text-gray-900 dark:text-gray-100">
              By {post.authorName}
            </span>
            {post.publishedAt && (
              <>
                <span>•</span>
                <time>{formatDate(post.publishedAt)}</time>
              </>
            )}
            <span className="flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3"
                />
              </svg>
              {readTime} min read
            </span>
            {listenTime && (
              <span className="flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19V6l12-2v16l-12-2z"
                  />
                </svg>
                {listenTime} min listen
              </span>
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
          {/* Share and navigation actions */}
          <nav className="mt-4 flex gap-2" aria-label="Post actions">
            <button
              type="button"
              className="flex items-center gap-2 px-3 py-1 bg-primary text-white rounded hover:bg-accent transition-colors text-sm"
              onClick={async () => {
                const shareUrl =
                  typeof window !== "undefined" ? window.location.href : "";
                const shareData = {
                  title: post.title,
                  text: post.excerpt || post.title,
                  url: shareUrl,
                };
                if (navigator.share) {
                  try {
                    await navigator.share(shareData);
                  } catch {}
                } else if (navigator.clipboard) {
                  try {
                    await navigator.clipboard.writeText(shareUrl);
                    alert("Link copied to clipboard!");
                  } catch {
                    alert("Failed to copy link.");
                  }
                } else {
                  alert("Sharing not supported on this device.");
                }
              }}
              aria-label="Share this article"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 12v7a2 2 0 002 2h12a2 2 0 002-2v-7"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 6l-4-4-4 4m4-4v16"
                />
              </svg>
              <span className="sr-only">Share this article</span>
              <span aria-hidden="true">Share</span>
            </button>
          </nav>
        </header>

        {/* Subscribe CTA removed from top of article */}

        {post.coverImage && (
          <img
            src={post.coverImage}
            alt="cover"
            className="w-full rounded-lg mb-8 shadow-lg"
          />
        )}

        {post.audioUrl && (
          <div className="mb-8 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-lg text-primary dark:text-tertiary">
                Listen to this story
              </span>
              <svg
                className="w-6 h-6 text-tertiary animate-pulse"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19V6l12-2v16l-12-2z"
                />
              </svg>
            </div>
            <audio controls src={post.audioUrl} className="w-full max-w-xl" />
          </div>
        )}

        <div className="prose prose-lg dark:prose-invert prose-gray dark:prose-gray max-w-none">
          <MarkdownRenderer content={post.content || ""} />
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          {nextPost ? (
            <div className="mt-4 flex justify-center">
              <SubscribeForm />
            </div>
          ) : null}
          <a
            href="/posts"
            className="text-primary dark:text-tertiary hover:text-accent transition-colors inline-flex items-center gap-2"
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
    </>
  );
}

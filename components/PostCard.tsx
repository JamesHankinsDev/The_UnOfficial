import Link from "next/link";
import { formatDate } from "@/lib/formatDate";
import { estimateReadingTime } from "@/lib/utils";

export default function PostCard({ post }: { post: any }) {
  // Listen time (audioDuration in seconds)
  const getListenTime = (audioDuration?: number | null) => {
    if (!audioDuration) return null;
    return Math.max(1, Math.round(audioDuration / 60));
  };
  const readTime = estimateReadingTime(post.content || "");
  const listenTime = getListenTime(post.audioDuration);

  return (
    <article className="bg-slate-200/40 dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-primary dark:border-gray-700">
      <header>
        <Link href={`/posts/${post.slug}`}>
          <h2 className="text-2xl font-bold text-primary dark:text-tertiary hover:text-accent dark:hover:text-accent transition-colors mb-3">
            {post.title}
          </h2>
        </Link>
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {post.authorName}
            </span>
          </div>
          {post.publishedAt && (
            <time className="text-gray-800 dark:text-gray-500">
              {formatDate(post.publishedAt, { month: "short", day: "numeric", year: "numeric" })}
            </time>
          )}
        </div>
        <div className="flex gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
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
                d="M12 8v4l3 3"
              />
            </svg>
            <span className="sr-only">Read time</span>
            <span aria-hidden="true">{readTime} min read</span>
          </span>
          {listenTime && (
            <span className="flex items-center gap-1">
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
                  d="M9 19V6l12-2v16l-12-2z"
                />
              </svg>
              <span className="sr-only">Listen time</span>
              <span aria-hidden="true">{listenTime} min listen</span>
            </span>
          )}
        </div>
      </header>

      <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
        {post.excerpt}
      </p>

      {post.tags && post.tags.length > 0 && (
        <ul className="flex gap-2 mt-4 flex-wrap" aria-label="Post tags">
          {post.tags.slice(0, 3).map((tag: string, i: number) => (
            <li key={i} className="px-2 py-1 bg-tertiary/10 text-tertiary dark:bg-tertiary/20 text-xs rounded-full">
              {tag}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

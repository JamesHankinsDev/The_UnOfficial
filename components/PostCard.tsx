import Link from "next/link";

export default function PostCard({ post }: { post: any }) {
  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200 dark:border-gray-700">
      <Link href={`/posts/${post.slug}`}>
        <h2 className="text-2xl font-bold text-primary dark:text-tertiary hover:text-accent dark:hover:text-accent transition-colors mb-3">
          {post.title}
        </h2>
      </Link>
      
      <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
        {post.excerpt}
      </p>
      
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {post.authorName}
          </span>
        </div>
        {post.publishedAt && (
          <time className="text-gray-500 dark:text-gray-500">
            {formatDate(post.publishedAt)}
          </time>
        )}
      </div>
      
      {post.tags && post.tags.length > 0 && (
        <div className="flex gap-2 mt-4 flex-wrap">
          {post.tags.slice(0, 3).map((tag: string, i: number) => (
            <span
              key={i}
              className="px-2 py-1 bg-tertiary/10 text-tertiary dark:bg-tertiary/20 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}

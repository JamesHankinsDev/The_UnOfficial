import Link from "next/link";

export default function PostCard({ post }: { post: any }) {
  return (
    <article className="bg-white rounded shadow-sm p-4">
      <h2 className="text-xl font-semibold">
        <Link href={`/posts/${post.slug}`}>{post.title}</Link>
      </h2>
      <p className="text-sm text-gray-600 mt-2">{post.excerpt}</p>
      <div className="mt-3 text-xs text-gray-500">By {post.authorName}</div>
    </article>
  );
}

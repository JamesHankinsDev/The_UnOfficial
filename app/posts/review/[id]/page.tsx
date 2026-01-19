"use client";
import { useAuth } from "../../../../components/AuthProvider";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getPost,
  addComment,
  getComments,
} from "../../../../lib/firebase/posts";
import type { Post, Comment } from "../../../../lib/firebase/posts";
import MarkdownRenderer from "../../../../components/MarkdownRenderer";

export default function ReviewDraftPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [loadingPost, setLoadingPost] = useState(true);
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function loadPost() {
      try {
        const postData = await getPost(postId);
        if (!postData) {
          alert("Post not found");
          router.push("/dashboard");
          return;
        }

        // Check permissions - only writers and owners can review drafts
        if (profile?.role !== "writer" && profile?.role !== "owner") {
          alert("You don't have permission to review drafts");
          router.push("/dashboard");
          return;
        }

        // Only allow viewing drafts
        if (postData.status !== "draft") {
          router.push(`/posts/${postData.slug}`);
          return;
        }

        setPost(postData);
      } catch (error) {
        console.error("Error loading post:", error);
        alert("Failed to load post");
        router.push("/dashboard");
      } finally {
        setLoadingPost(false);
      }
    }

    if (!loading && user && postId && profile) {
      loadPost();
    }
  }, [user, profile, loading, postId, router]);

  useEffect(() => {
    async function loadComments() {
      try {
        const commentsData = await getComments(postId);
        setComments(commentsData);
      } catch (error) {
        console.error("Error loading comments:", error);
      } finally {
        setLoadingComments(false);
      }
    }

    if (postId) {
      loadComments();
    }
  }, [postId]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setSubmittingComment(true);
    try {
      await addComment(
        postId,
        user.uid,
        user.displayName || "Unknown",
        user.email || "",
        newComment.trim()
      );

      // Reload comments
      const commentsData = await getComments(postId);
      setComments(commentsData);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment. Please try again.");
    } finally {
      setSubmittingComment(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (loading || loadingPost) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!user || !post) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => router.push("/dashboard")}
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
          Back to Dashboard
        </button>
        <div className="flex gap-2">
          {(post.authorId === user.uid || profile?.role === "owner") && (
            <a
              href={`/posts/edit/${post.id}`}
              className="px-4 py-2 bg-tertiary text-primary rounded-lg hover:bg-accent transition-colors"
            >
              Edit Draft
            </a>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-sm rounded-full font-medium">
                  Draft
                </span>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm rounded-full">
                  by {post.authorName}
                </span>
              </div>
              <h1 className="text-4xl font-bold text-primary dark:text-tertiary mb-4">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-4 italic">
                  {post.excerpt}
                </p>
              )}
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span>Last updated: {formatDate(post.updatedAt)}</span>
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
            </div>

            {post.coverImage && (
              <img
                src={post.coverImage}
                alt="cover"
                className="w-full rounded-lg mb-8 shadow-lg"
              />
            )}

            <div className="prose prose-lg dark:prose-invert prose-gray max-w-none">
              <MarkdownRenderer content={post.content || "*No content yet*"} />
            </div>
          </article>
        </div>

        {/* Comments Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Comments & Feedback
            </h2>

            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Leave feedback or suggestions..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-tertiary focus:border-transparent resize-none"
              />
              <button
                type="submit"
                disabled={submittingComment || !newComment.trim()}
                className="w-full mt-2 px-4 py-2 bg-tertiary text-primary font-medium rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submittingComment ? "Adding..." : "Add Comment"}
              </button>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {loadingComments ? (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Loading comments...
                </p>
              ) : comments.length === 0 ? (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  No comments yet. Be the first to provide feedback!
                </p>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
                        {comment.userName}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

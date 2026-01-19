"use client";
import { useAuth } from "../../../../components/AuthProvider";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getPost,
  updatePost,
  deletePost,
} from "../../../../lib/firebase/posts";
import type { Post } from "../../../../lib/firebase/posts";
import { slugify } from "../../../../lib/utils";
import MarkdownRenderer from "../../../../components/MarkdownRenderer";

export default function EditPostPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loadingPost, setLoadingPost] = useState(true);
  const [post, setPost] = useState<Post | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    tags: "",
    status: "draft" as "draft" | "published" | "archived",
  });

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

        // Check permissions - only author or owner can edit
        if (postData.authorId !== user?.uid && profile?.role !== "owner") {
          alert("You don't have permission to edit this post");
          router.push("/dashboard");
          return;
        }

        setPost(postData);
        setFormData({
          title: postData.title,
          content: postData.content,
          excerpt: postData.excerpt || "",
          tags: postData.tags?.join(", ") || "",
          status: postData.status,
        });
      } catch (error) {
        console.error("Error loading post:", error);
        alert("Failed to load post");
        router.push("/dashboard");
      } finally {
        setLoadingPost(false);
      }
    }

    if (!loading && user && postId) {
      loadPost();
    }
  }, [user, profile, loading, postId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.title || !formData.content) return;

    setSaving(true);
    try {
      await updatePost(postId, {
        title: formData.title,
        slug: slugify(formData.title),
        content: formData.content,
        excerpt: formData.excerpt || formData.content.substring(0, 160) + "...",
        status: formData.status,
        tags: formData.tags
          ? formData.tags.split(",").map((t) => t.trim())
          : [],
      });

      alert("Post updated successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this post? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeleting(true);
    try {
      await deletePost(postId);
      alert("Post deleted successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. Please try again.");
      setDeleting(false);
    }
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
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-primary dark:text-tertiary">
            Edit Post
          </h1>
          <button
            type="button"
            onClick={() => setIsPreview(!isPreview)}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-secondary transition-colors"
          >
            {isPreview ? "Edit" : "Preview"}
          </button>
        </div>

        {isPreview ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {formData.title || "Untitled Post"}
              </h2>
              {formData.excerpt && (
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-6 italic">
                  {formData.excerpt}
                </p>
              )}
              {formData.tags && (
                <div className="flex gap-2 mb-6">
                  {formData.tags.split(",").map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-tertiary/20 text-tertiary rounded-full text-sm"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="prose dark:prose-invert max-w-none">
              <MarkdownRenderer
                content={formData.content || "*No content yet*"}
              />
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-tertiary focus:border-transparent"
                placeholder="Enter post title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                Excerpt
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData({ ...formData, excerpt: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-tertiary focus:border-transparent"
                rows={2}
                placeholder="Brief description (optional, will auto-generate from content)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                Content * (Markdown supported)
              </label>
              <textarea
                required
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-tertiary focus:border-transparent font-mono text-sm"
                rows={16}
                placeholder="Write your content here... You can use Markdown formatting"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-tertiary focus:border-transparent"
                placeholder="basketball, nba, sports"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="draft"
                    checked={formData.status === "draft"}
                    onChange={(e) =>
                      setFormData({ ...formData, status: "draft" })
                    }
                    className="text-tertiary focus:ring-tertiary"
                  />
                  <span className="text-sm text-gray-900 dark:text-gray-100">
                    Save as Draft
                  </span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="published"
                    checked={formData.status === "published"}
                    onChange={(e) =>
                      setFormData({ ...formData, status: "published" })
                    }
                    className="text-tertiary focus:ring-tertiary"
                  />
                  <span className="text-sm text-gray-900 dark:text-gray-100">
                    Publish
                  </span>
                </label>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="ml-4 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Delete Post"}
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => router.push("/dashboard")}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-tertiary text-primary font-medium rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

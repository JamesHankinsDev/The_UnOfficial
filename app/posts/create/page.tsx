"use client";
import { useAuth } from "../../../components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { createPost } from "../../../lib/firebase/posts";
import { slugify } from "../../../lib/utils";

export default function CreatePostPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    tags: "",
    status: "draft" as "draft" | "published",
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
    }
    if (
      !loading &&
      user &&
      profile &&
      !["owner", "writer"].includes(profile.role || "")
    ) {
      router.push("/dashboard");
    }
  }, [user, profile, loading, router]);
  const handleGenerateExcerpt = async () => {
    if (!formData.title || !formData.content) {
      toast.error("Please enter a title and content first");
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch("/api/generate-excerpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate excerpt");
      }

      setFormData({ ...formData, excerpt: data.excerpt });
    } catch (error: any) {
      console.error("Error generating excerpt:", error);
      toast.error(`Failed to generate excerpt: ${error.message}`);
    } finally {
      setGenerating(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.title || !formData.content) return;

    setSaving(true);
    try {
      const slug = slugify(formData.title);
      const postId = await createPost({
        title: formData.title,
        slug,
        content: formData.content,
        excerpt: formData.excerpt || formData.content.substring(0, 160) + "...",
        authorId: user.uid,
        authorName: user.displayName || "Anonymous",
        authorEmail: user.email || "",
        status: formData.status,
        tags: formData.tags
          ? formData.tags.split(",").map((t) => t.trim())
          : [],
      });

      // If publishing (not draft), send notifications to subscribers
      if (formData.status === "published") {
        try {
          await fetch("/api/notify-subscribers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              postTitle: formData.title,
              postSlug: slug,
              authorName: user.displayName || "Anonymous",
            }),
          });
        } catch (notifyError) {
          console.error("Error sending notifications:", notifyError);
          // Don't block post creation if notifications fail
        }
      }

      toast.success("Post created successfully!");
      router.push(`/posts/${slug}`);
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!user || !profile || !["owner", "writer"].includes(profile.role || "")) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-primary dark:text-tertiary mb-8">
          Create New Post
        </h1>

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
            <div className="space-y-2">
              <div className="flex gap-2">
                <textarea
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-tertiary focus:border-transparent"
                  rows={3}
                  placeholder="Brief description (optional)"
                />
              </div>
              <button
                type="button"
                onClick={handleGenerateExcerpt}
                disabled={generating || !formData.title || !formData.content}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg
                  className={`w-4 h-4 ${generating ? "animate-spin" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {generating ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  )}
                </svg>
                {generating ? "Generating..." : "✨ AI Generate Excerpt"}
              </button>
            </div>
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
              placeholder="Write your content here... You can use Markdown formatting or paste from Google Docs"
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
                {saving
                  ? "Saving..."
                  : formData.status === "published"
                    ? "Publish Post"
                    : "Save Draft"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

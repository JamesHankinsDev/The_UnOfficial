"use client";
import { useAuth } from "../../../components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import MarkdownRenderer from "../../../components/MarkdownRenderer";
import { useSnackbar } from "../../../components/MuiSnackbar";
import { createPost } from "../../../lib/firebase/posts";
import { uploadPostAudio } from "../../../lib/firebase/storage";
import { slugify } from "../../../lib/utils";

export default function CreatePostPage() {
  const { user, profile, loading } = useAuth();
  const { showMessage } = useSnackbar();
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

  // Preview mode for reading while recording
  const [isPreview, setIsPreview] = useState(false);

  // Audio recording state
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const handleStartRecording = async () => {
    setIsPreview(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new window.MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunks.current = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.current.push(e.data);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioURL(URL.createObjectURL(blob));
      };
      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      showMessage("Microphone access denied or unavailable.", "error");
    }
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
    setIsPreview(false);
  };

  const handleDeleteAudio = () => {
    setAudioBlob(null);
    setAudioURL(null);
    audioChunks.current = [];
  };

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
      showMessage("Please enter a title and content first", "error");
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
      showMessage(`Failed to generate excerpt: ${error.message}`, "error");
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
      // Create the post first to get the postId
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
        audioUrl: null,
      });

      // If there is an audio recording, upload it and update the post
      if (audioBlob) {
        try {
          const audioUrl = await uploadPostAudio(postId, audioBlob);
          await fetch("/api/posts/update-audio", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ postId, audioUrl }),
          });
        } catch (err) {
          showMessage("Audio upload failed, but post was created.", "warning");
        }
      }

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

      showMessage("Post created successfully!", "success");
      router.push(`/posts/${slug}`);
    } catch (error) {
      console.error("Error creating post:", error);
      showMessage("Failed to create post. Please try again.", "error");
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

        {/* Audio Recording Section - always visible */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            Optional: Record Audio for this Article
          </label>
          <div className="flex flex-col gap-2">
            {audioURL ? (
              <div className="flex flex-col gap-2">
                <audio controls src={audioURL} className="w-full" />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleDeleteAudio}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete Audio
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={recording ? handleStopRecording : handleStartRecording}
                className={`px-4 py-2 rounded text-white font-medium transition-all ${recording ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-600 hover:bg-blue-700"}`}
              >
                {recording ? "Stop Recording" : "Start Recording"}
              </button>
            )}
            {recording && (
              <span className="text-xs text-yellow-600 font-semibold animate-pulse">
                ● Recording... Speak now!
              </span>
            )}
          </div>
        </div>

        {isPreview ? (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">
                Preview Mode (for Recording)
              </h2>
              <button
                type="button"
                onClick={() => {
                  setIsPreview(false);
                  if (recording) handleStopRecording();
                }}
                className="text-blue-600 underline"
              >
                Back to Edit
              </button>
            </div>
            <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
              <MarkdownRenderer
                content={formData.content || "Nothing to preview yet."}
              />
            </div>
          </div>
        ) : null}
        <form
          onSubmit={handleSubmit}
          className={`space-y-6${isPreview ? " hidden" : ""}`}
        >
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

"use client";
import { useAuth } from "../../components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { firestore } from "../../lib/firebase/client";
import type { Post } from "../../lib/firebase/posts";
import { updatePost, getAllDrafts } from "../../lib/firebase/posts";
import {
  generateInviteCode,
  getInviteCodes,
  type InviteCode,
} from "../../lib/firebase/invites";

export default function DashboardPage() {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();
  const [drafts, setDrafts] = useState<Post[]>([]);
  const [loadingDrafts, setLoadingDrafts] = useState(true);
  const [allDrafts, setAllDrafts] = useState<Post[]>([]);
  const [loadingAllDrafts, setLoadingAllDrafts] = useState(true);
  const [publishedPosts, setPublishedPosts] = useState<Post[]>([]);
  const [loadingPublished, setLoadingPublished] = useState(true);
  const [unpublishing, setUnpublishing] = useState<string | null>(null);
  const [inviteCodes, setInviteCodes] = useState<InviteCode[]>([]);
  const [loadingInvites, setLoadingInvites] = useState(false);
  const [generatingCode, setGeneratingCode] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function loadDrafts() {
      if (!user || !firestore) {
        setLoadingDrafts(false);
        return;
      }

      if (profile?.role && ["owner", "writer"].includes(profile.role)) {
        try {
          const q = query(
            collection(firestore, "posts"),
            where("authorId", "==", user.uid),
            where("status", "==", "draft"),
            orderBy("updatedAt", "desc")
          );
          const snap = await getDocs(q);
          const draftPosts = snap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Post[];
          setDrafts(draftPosts);
        } catch (error) {
          console.error("Error loading drafts:", error);
        }
      }
      setLoadingDrafts(false);
    }

    if (!loading && user) {
      loadDrafts();
    }
  }, [user, profile, loading]);

  useEffect(() => {
    async function loadAllDrafts() {
      if (!user || !firestore) {
        setLoadingAllDrafts(false);
        return;
      }

      if (profile?.role && ["owner", "writer"].includes(profile.role)) {
        try {
          const allDraftPosts = await getAllDrafts();
          // Filter out user's own drafts
          const othersDrafts = allDraftPosts.filter(
            (draft) => draft.authorId !== user.uid
          );
          setAllDrafts(othersDrafts);
        } catch (error) {
          console.error("Error loading all drafts:", error);
        }
      }
      setLoadingAllDrafts(false);
    }

    if (!loading && user) {
      loadAllDrafts();
    }
  }, [user, profile, loading]);

  useEffect(() => {
    async function loadPublished() {
      if (!user || !firestore) {
        setLoadingPublished(false);
        return;
      }

      if (profile?.role && ["owner", "writer"].includes(profile.role)) {
        try {
          const q = query(
            collection(firestore, "posts"),
            where("authorId", "==", user.uid),
            where("status", "==", "published"),
            orderBy("publishedAt", "desc")
          );
          const snap = await getDocs(q);
          const pubPosts = snap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Post[];
          setPublishedPosts(pubPosts);
        } catch (error) {
          console.error("Error loading published posts:", error);
        }
      }
      setLoadingPublished(false);
    }

    if (!loading && user) {
      loadPublished();
    }
  }, [user, profile, loading]);

  useEffect(() => {
    async function loadInvites() {
      if (!user || !firestore || profile?.role !== "owner") {
        return;
      }

      setLoadingInvites(true);
      try {
        const codes = await getInviteCodes(user.uid);
        setInviteCodes(codes);
      } catch (error) {
        console.error("Error loading invite codes:", error);
      } finally {
        setLoadingInvites(false);
      }
    }

    if (!loading && user && profile?.role === "owner") {
      loadInvites();
    }
  }, [user, profile, loading]);

  const handleGenerateCode = async () => {
    if (!user) return;

    setGeneratingCode(true);
    try {
      const code = await generateInviteCode(
        user.uid,
        user.displayName || user.email || "Unknown"
      );

      // Reload invite codes
      const codes = await getInviteCodes(user.uid);
      setInviteCodes(codes);

      // Show success message
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 3000);
    } catch (error) {
      console.error("Error generating invite code:", error);
      alert("Failed to generate invite code");
    } finally {
      setGeneratingCode(false);
    }
  };

  const copyInviteLink = (code: string) => {
    const link = `${window.location.origin}/signup/writer?code=${code}`;
    navigator.clipboard.writeText(link);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleUnpublish = async (postId: string) => {
    if (
      !confirm(
        "Unpublish this post? It will move back to drafts and be hidden from readers."
      )
    ) {
      return;
    }

    setUnpublishing(postId);
    try {
      await updatePost(postId, { status: "draft" });

      // Move post from published to drafts in state
      const post = publishedPosts.find((p) => p.id === postId);
      if (post) {
        setPublishedPosts(publishedPosts.filter((p) => p.id !== postId));
        setDrafts([{ ...post, status: "draft" }, ...drafts]);
      }
    } catch (error) {
      console.error("Error unpublishing post:", error);
      alert("Failed to unpublish post. Please try again.");
    } finally {
      setUnpublishing(null);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary dark:text-tertiary">
            Dashboard
          </h1>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm whitespace-nowrap"
          >
            Sign Out
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          {user.photoURL && (
            <img
              src={user.photoURL}
              alt="Profile"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-tertiary"
            />
          )}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 truncate">
              {user.displayName || "User"}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{user.email}</p>
            {profile?.role && (
              <span
                className={`inline-block mt-2 px-3 py-1 text-sm font-medium rounded-full ${
                  profile.role === "owner"
                    ? "bg-orange-500 text-white"
                    : "bg-tertiary text-primary"
                }`}
              >
                {profile.role}
              </span>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Quick Actions
          </h3>
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
            <a
              href="/posts"
              className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-tertiary dark:hover:border-tertiary transition-colors"
            >
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                View Posts
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Browse all published posts
              </p>
            </a>
            <a
              href="/settings"
              className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-tertiary dark:hover:border-tertiary transition-colors"
            >
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Settings
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage your account settings
              </p>
            </a>
            {profile?.role && ["owner", "writer"].includes(profile.role) ? (
              <a
                href="/posts/create"
                className="p-4 border-2 border-tertiary bg-tertiary/10 rounded-lg hover:bg-tertiary/20 transition-colors"
              >
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Create Post
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Write a new blog post
                </p>
              </a>
            ) : (
              <div className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg opacity-50">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Create Post
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Writer permission required
                </p>
              </div>
            )}
          </div>
        </div>

        {/* My Drafts Section */}
        {profile?.role && ["owner", "writer"].includes(profile.role) && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              My Drafts
            </h3>
            {loadingDrafts ? (
              <p className="text-gray-600 dark:text-gray-400">
                Loading drafts...
              </p>
            ) : drafts.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">
                {publishedPosts.length > 0
                  ? "No drafts currently. "
                  : "No drafts yet. "}
                <a
                  href="/posts/create"
                  className="text-tertiary hover:underline"
                >
                  {publishedPosts.length > 0
                    ? "Create a new post"
                    : "Create your first post"}
                </a>
              </p>
            ) : (
              <div className="space-y-3">
                {drafts.map((draft) => (
                  <div
                    key={draft.id}
                    className="p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-tertiary transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 break-words">
                          {draft.title}
                        </h4>
                        {draft.excerpt && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {draft.excerpt}
                          </p>
                        )}
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
                          {draft.tags && draft.tags.length > 0 && (
                            <span>Tags: {draft.tags.join(", ")}</span>
                          )}
                          <span>
                            Updated:{" "}
                            {new Date(
                              draft.updatedAt?.seconds * 1000 || Date.now()
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <a
                        href={`/posts/edit/${draft.id}`}
                        className="ml-4 px-3 py-1 text-sm bg-tertiary text-primary rounded hover:bg-accent transition-colors"
                      >
                        Edit
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Team Drafts Review Section */}
        {profile?.role && ["owner", "writer"].includes(profile.role) && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Team Drafts - Review & Collaborate
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                View, comment on, and edit drafts from other writers
              </p>
            </div>
            {loadingAllDrafts ? (
              <p className="text-gray-600 dark:text-gray-400">
                Loading team drafts...
              </p>
            ) : allDrafts.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">
                No drafts from other team members.
              </p>
            ) : (
              <div className="space-y-3">
                {allDrafts.map((draft) => (
                  <div
                    key={draft.id}
                    className="p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-tertiary transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                            {draft.title}
                          </h4>
                          <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-full">
                            by {draft.authorName}
                          </span>
                        </div>
                        {draft.excerpt && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {draft.excerpt}
                          </p>
                        )}
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
                          {draft.tags && draft.tags.length > 0 && (
                            <span>Tags: {draft.tags.join(", ")}</span>
                          )}
                          <span>
                            Updated:{" "}
                            {new Date(
                              draft.updatedAt?.seconds * 1000 || Date.now()
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 flex gap-2">
                        <a
                          href={`/posts/review/${draft.id}`}
                          className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                        >
                          Review
                        </a>
                        {profile?.role === "owner" && (
                          <a
                            href={`/posts/edit/${draft.id}`}
                            className="px-3 py-1 text-sm bg-tertiary text-primary rounded hover:bg-accent transition-colors"
                          >
                            Edit
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* My Published Posts Section */}
        {profile?.role && ["owner", "writer"].includes(profile.role) && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              My Published Posts
            </h3>
            {loadingPublished ? (
              <p className="text-gray-600 dark:text-gray-400">
                Loading published posts...
              </p>
            ) : publishedPosts.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">
                No published posts yet.
              </p>
            ) : (
              <div className="space-y-3">
                {publishedPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-tertiary transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 break-words">
                            {post.title}
                          </h4>
                          <span className="px-2 py-0.5 bg-tertiary/20 text-tertiary text-xs rounded-full whitespace-nowrap">
                            Published
                          </span>
                        </div>
                        {post.excerpt && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {post.excerpt}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
                          {post.tags && post.tags.length > 0 && (
                            <span>Tags: {post.tags.join(", ")}</span>
                          )}
                          <span>
                            Published:{" "}
                            {new Date(
                              post.publishedAt?.seconds * 1000 || Date.now()
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                        <a
                          href={`/posts/${post.slug}`}
                          className="flex-1 sm:flex-none px-3 py-1 text-sm text-center bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors whitespace-nowrap"
                        >
                          View
                        </a>
                        <a
                          href={`/posts/edit/${post.id}`}
                          className="flex-1 sm:flex-none px-3 py-1 text-sm text-center bg-tertiary text-primary rounded hover:bg-accent transition-colors whitespace-nowrap"
                        >
                          Edit
                        </a>
                        <button
                          onClick={() => handleUnpublish(post.id!)}
                          disabled={unpublishing === post.id}
                          className="flex-1 sm:flex-none px-3 py-1 text-sm bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                          {unpublishing === post.id ? "..." : "Unpublish"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Writer Invite Codes (Owner Only) */}
        {profile?.role === "owner" && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Writer Invitations
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Generate invite links to add new writers to your blog
                </p>
              </div>
              <button
                onClick={handleGenerateCode}
                disabled={generatingCode}
                className="w-full sm:w-auto px-4 py-2 bg-tertiary text-primary font-medium rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
              >
                {generatingCode ? "Generating..." : "Generate Code"}
              </button>
            </div>

            {copiedCode && (
              <div className="mb-4 p-3 bg-tertiary/20 border border-tertiary rounded-lg">
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  ✓ Invite link copied to clipboard!
                </p>
              </div>
            )}

            {loadingInvites ? (
              <p className="text-gray-600 dark:text-gray-400">
                Loading invite codes...
              </p>
            ) : inviteCodes.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">
                No invite codes yet. Generate one to invite writers.
              </p>
            ) : (
              <div className="space-y-3">
                {inviteCodes.map((invite) => (
                  <div
                    key={invite.id}
                    className={`p-4 border rounded-lg ${
                      invite.usedBy
                        ? "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50"
                        : "border-tertiary bg-tertiary/5"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <code className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded font-mono text-sm">
                            {invite.code}
                          </code>
                          {invite.usedBy ? (
                            <span className="px-2 py-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded text-xs">
                              Used
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-tertiary text-primary rounded text-xs font-medium">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {invite.usedBy ? (
                            <p>
                              Used by{" "}
                              <span className="font-medium">
                                {invite.usedByName}
                              </span>{" "}
                              on{" "}
                              {invite.usedAt &&
                                new Date(
                                  invite.usedAt.seconds * 1000
                                ).toLocaleDateString()}
                            </p>
                          ) : (
                            <p>
                              Created{" "}
                              {invite.createdAt &&
                                new Date(
                                  invite.createdAt.seconds * 1000
                                ).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      {!invite.usedBy && (
                        <button
                          onClick={() => copyInviteLink(invite.code)}
                          className="ml-4 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          {copiedCode === invite.code
                            ? "✓ Copied!"
                            : "Copy Link"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

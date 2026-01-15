"use client";
import { useAuth } from "../../components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { firestore } from "../../lib/firebase/client";
import type { Post } from "../../lib/firebase/posts";
import { generateInviteCode, getInviteCodes, type InviteCode } from "../../lib/firebase/invites";

export default function DashboardPage() {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();
  const [drafts, setDrafts] = useState<Post[]>([]);
  const [loadingDrafts, setLoadingDrafts] = useState(true);
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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-primary dark:text-tertiary">
            Dashboard
          </h1>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Sign Out
          </button>
        </div>

        <div className="flex items-center gap-4 mb-8">
          {user.photoURL && (
            <img
              src={user.photoURL}
              alt="Profile"
              className="w-20 h-20 rounded-full border-4 border-tertiary"
            />
          )}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {user.displayName || "User"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
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
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Quick Actions
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
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
                No drafts yet.{" "}
                <a
                  href="/posts/create"
                  className="text-tertiary hover:underline"
                >
                  Create your first post
                </a>
              </p>
            ) : (
              <div className="space-y-3">
                {drafts.map((draft) => (
                  <div
                    key={draft.id}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-tertiary transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
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

        {/* Writer Invite Codes (Owner Only) */}
        {profile?.role === "owner" && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Writer Invitations
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Generate invite links to add new writers to your blog
                </p>
              </div>
              <button
                onClick={handleGenerateCode}
                disabled={generatingCode}
                className="px-4 py-2 bg-tertiary text-primary font-medium rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              <p className="text-gray-600 dark:text-gray-400">Loading invite codes...</p>
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
                              Used by <span className="font-medium">{invite.usedByName}</span> on{" "}
                              {invite.usedAt && new Date(invite.usedAt.seconds * 1000).toLocaleDateString()}
                            </p>
                          ) : (
                            <p>
                              Created {invite.createdAt && new Date(invite.createdAt.seconds * 1000).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      {!invite.usedBy && (
                        <button
                          onClick={() => copyInviteLink(invite.code)}
                          className="ml-4 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          {copiedCode === invite.code ? "✓ Copied!" : "Copy Link"}
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

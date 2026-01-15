"use client";
import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";
import Logo from "./Logo";

export default function NavBar() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <nav className="bg-primary dark:bg-gray-800 border-b border-secondary dark:border-accent">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/" className="flex items-center">
            <Logo className="h-12 w-auto" />
          </a>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="/posts"
            className="text-sm text-gray-200 hover:text-tertiary transition-colors"
          >
            Posts
          </a>
          <a
            href="/about"
            className="text-sm text-gray-200 hover:text-tertiary transition-colors"
          >
            About
          </a>
          {!loading && (
            <>
              {user ? (
                <a
                  href="/dashboard"
                  className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-600 hover:opacity-80 transition-opacity cursor-pointer"
                >
                  {user.photoURL && (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="w-8 h-8 rounded-full border-2 border-tertiary"
                    />
                  )}
                  <span className="text-sm text-white hidden sm:inline">
                    {user.displayName?.split(" ")[0] || "User"}
                  </span>
                </a>
              ) : (
                <a
                  href="/signin"
                  className="px-3 py-1 bg-tertiary text-primary font-medium rounded hover:bg-accent transition-colors"
                >
                  Sign in
                </a>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

"use client";
import { useAuth } from "../../../components/AuthProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import {
  validateInviteCode,
  useInviteCode,
} from "../../../lib/firebase/invites";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "../../../lib/firebase/client";
import { signInWithGoogle } from "../../../lib/firebase/auth";

function WriterSignupContent() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const [validating, setValidating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!code) {
      setError("No invite code provided");
      return;
    }

    if (loading) return;

    if (user && profile) {
      // User is already signed in, validate and apply code
      applyInviteCode();
    }
  }, [user, profile, loading, code]);

  const applyInviteCode = async () => {
    if (!code || !user || !firestore) return;

    setValidating(true);
    setError("");

    try {
      const invite = await validateInviteCode(code);

      if (!invite) {
        setError("Invalid or expired invite code");
        setValidating(false);
        return;
      }

      // Update user role
      const userRef = doc(firestore, "users", user.uid);
      await updateDoc(userRef, {
        role: invite.role,
      });

      // Mark invite as used
      await useInviteCode(
        invite.id!,
        user.uid,
        user.displayName || user.email || "Unknown"
      );

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err) {
      console.error("Error applying invite code:", err);
      setError("Failed to apply invite code. Please try again.");
      setValidating(false);
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      // After sign in, useEffect will trigger and apply the code
    } catch (err) {
      console.error("Error signing in:", err);
      setError("Failed to sign in. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!code) {
    return (
      <div className="max-w-md mx-auto mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
          Invalid Link
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          No invite code was provided. Please use the complete invite link you
          received.
        </p>
        <button
          onClick={() => router.push("/")}
          className="w-full px-6 py-3 bg-tertiary text-primary font-medium rounded-lg hover:bg-accent transition-colors"
        >
          Go to Home
        </button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-tertiary rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-primary dark:text-tertiary mb-4">
            Welcome, Writer!
          </h1>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Your account has been upgraded. Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-primary dark:text-tertiary mb-4">
          Writer Invitation
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          You've been invited to join as a writer! Sign in with Google to accept
          your invitation and start creating content.
        </p>
        <button
          onClick={handleSignIn}
          className="w-full px-6 py-3 bg-tertiary text-primary font-medium rounded-lg hover:bg-accent transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign in with Google
        </button>
      </div>
    );
  }

  if (validating) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600 dark:text-gray-400">
          Validating invite code...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
          Error
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6">{error}</p>
        <button
          onClick={() => router.push("/")}
          className="w-full px-6 py-3 bg-tertiary text-primary font-medium rounded-lg hover:bg-accent transition-colors"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return null;
}

export default function WriterSignupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      }
    >
      <WriterSignupContent />
    </Suspense>
  );
}

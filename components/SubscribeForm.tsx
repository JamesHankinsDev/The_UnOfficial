"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { getNextScheduledPost } from "../lib/firebase/nextPost";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [nextPost, setNextPost] = useState<any | null>(null);

  useEffect(() => {
    async function fetchNext() {
      try {
        // Use now as the reference for the next post
        const next = await getNextScheduledPost(new Date());
        setNextPost(next);
      } catch {
        setNextPost(null);
      }
    }
    fetchNext();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("You're subscribed! Check your inbox.");
        setEmail("");
      } else {
        toast.error(data.error || "Subscription failed. Try again.");
      }
      setStatus("idle");
    } catch {
      toast.error("Network error. Please try again.");
      setStatus("idle");
    }
  };

  const daysToNextRelease =
    nextPost == null
      ? null
      : Math.ceil(
          (new Date(
            nextPost.releaseDate?.toDate
              ? nextPost.releaseDate.toDate()
              : nextPost.releaseDate,
          ).getTime() -
            Date.now()) /
            (1000 * 60 * 60 * 24),
        );

  return (
    <section
      className="mb-8 p-6 bg-tertiary/10 dark:bg-tertiary/20 rounded-lg shadow text-center max-w-xl mx-auto"
      aria-labelledby="subscribe-heading"
    >
      <h2
        id="subscribe-heading"
        className="text-xl font-semibold mb-2 text-primary dark:text-tertiary"
      >
        Ready for more?
      </h2>
      {nextPost && (
        <p className="mb-2 text-center text-base text-gray-700 dark:text-gray-300">
          The next article,{" "}
          <strong className="font-bold">{nextPost.title}</strong>, drops in{" "}
          {daysToNextRelease === 1 ? "a day" : `${daysToNextRelease} days`}.
          Subscribe to updates to make sure you don't miss it!
        </p>
      )}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row items-center gap-2 justify-center mt-4"
        aria-label="Subscribe to updates"
      >
        <label htmlFor="subscribe-email" className="sr-only">
          Email address
        </label>
        <input
          id="subscribe-email"
          type="email"
          className="flex-1 px-4 py-2 rounded border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter your email for updates"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={status === "loading"}
          aria-label="Email address"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-primary text-white rounded font-semibold disabled:opacity-60"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Subscribing..." : "Subscribe"}
        </button>
      </form>
    </section>
  );
}

import { useState } from "react";
import toast from "react-hot-toast";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading">("idle");

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

  return (
    <>
      <p>
        Interested in staying in the loop when new articles release? Subscribe
        for updates to be the first to know!
      </p>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row items-center gap-2 bg-white/80 dark:bg-gray-900/80 p-4 text-primary bold rounded-lg shadow max-w-xl mx-auto mt-4"
      >
        <input
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
    </>
  );
}

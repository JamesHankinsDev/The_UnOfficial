"use client";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", pitch: "" });
  const [status, setStatus] = useState<null | "success" | "error" | "loading">(
    null,
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    // no inline message
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        toast.success("Thank you! We'll be in touch soon.");
        setForm({ name: "", email: "", pitch: "" });
      } else {
        const data = await res.json();
        setStatus("error");
        toast.error(data.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setStatus("error");
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-4 text-tertiary">
        Interested in joining us and sharing your thoughts as a writer on The
        UnOfficial?
      </h1>
      <p className="mb-6">
        Get in touch and see if we're the right fit for you!
      </p>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="block font-medium mb-1">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full rounded border border-gray-300 p-2 text-secondary font-bold"
            value={form.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="email" className="block font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded border border-gray-300 p-2 text-secondary font-bold"
            value={form.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="pitch" className="block font-medium mb-1">
            What would you like to write?
          </label>
          <textarea
            id="pitch"
            name="pitch"
            required
            rows={4}
            className="w-full rounded border border-gray-300 p-2 text-secondary font-bold"
            value={form.pitch}
            onChange={handleChange}
          />
        </div>
        <button
          type="submit"
          className="bg-tertiary text-primary px-4 py-2 rounded hover:bg-tertiary/80"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Sending..." : "Get in touch"}
        </button>
        {/* Toast notifications will show feedback */}
      </form>
    </>
  );
}

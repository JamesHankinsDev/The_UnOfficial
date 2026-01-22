"use client";
import { useState } from "react";

export default function MobileAccordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border rounded-lg mb-4 bg-slate-200 dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
      <button
        className="w-full flex justify-between items-center px-4 py-3 text-lg font-semibold text-tertiary dark:text-tertiary focus:outline-none active:bg-gray-100 dark:active:bg-gray-800 transition-colors"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="text-2xl text-tertiary dark:text-tertiary">
          {title}
        </span>
        <span className="ml-2 text-gray-500 dark:text-gray-400">
          {open ? "▲" : "▼"}
        </span>
      </button>
      {open && (
        <div className="px-4 pb-4 text-gray-800 dark:text-gray-100">
          {children}
        </div>
      )}
    </div>
  );
}

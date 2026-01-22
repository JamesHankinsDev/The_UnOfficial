"use client";
import { useState, useEffect } from "react";
import Logo from "./Logo";

export default function IntroAnimation() {
  const [show, setShow] = useState(false);
  const [stage, setStage] = useState<
    "fade-in" | "text-visible" | "fade-out" | "complete"
  >("fade-in");

  useEffect(() => {
    // Check if intro has been shown before
    const hasSeenIntro = localStorage.getItem("hasSeenIntro");

    if (!hasSeenIntro) {
      setShow(true);

      // Animation timeline
      setTimeout(() => setStage("text-visible"), 800); // Logo + text visible
      setTimeout(() => setStage("fade-out"), 4000); // Start fading everything out
      setTimeout(() => {
        setStage("complete");
        localStorage.setItem("hasSeenIntro", "true");
      }, 5000); // Complete and hide
    }
  }, []);

  if (!show || stage === "complete") {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-primary flex items-center justify-center transition-opacity duration-700 ${
        stage === "fade-out" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="relative">
        {/* Logo with animation */}
        <div
          className={`transition-all duration-1000 ${
            stage === "fade-in" ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
        >
          <Logo className="w-48 h-48 md:w-64 md:h-64" />
        </div>
      </div>
    </div>
  );
}

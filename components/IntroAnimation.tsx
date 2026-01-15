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

        {/* Text overlay */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${
            stage === "fade-in" ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
              The UnOfficial
            </h1>
            <div className="flex items-center justify-center gap-2">
              <div className="w-12 h-0.5 bg-white/50"></div>
              <p className="text-xl md:text-2xl text-white/90 font-light">
                Serious Fans, Unserious Takes
              </p>
              <div className="w-12 h-0.5 bg-white/50"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

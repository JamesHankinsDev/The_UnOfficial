"use client";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { lightTheme, darkTheme } from "../lib/muiThemes";
import { useEffect, useState } from "react";

export default function MuiAppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    setIsDark(stored === "dark" || (!stored && prefersDark));
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", handler);
    return () =>
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", handler);
  }, []);

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

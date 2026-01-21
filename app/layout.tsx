import "../styles/globals.css";
import NavBar from "../components/NavBar";
import ThemeToggle from "../components/ThemeToggle";
import Footer from "../components/Footer";
import AuthProvider from "../components/AuthProvider";

import IntroAnimation from "../components/IntroAnimation";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "The UnOfficial",
  description:
    "A minimal blog built with Next.js, Tailwind, MagicUI and Firebase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (theme === 'dark' || (!theme && prefersDark)) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
        <AuthProvider>
          <IntroAnimation />
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
          <div className="min-h-screen flex flex-col">
            <NavBar />
            <main className="flex-1 container mx-auto px-4 py-8">
              {children}
            </main>
            <Footer />
            <ThemeToggle />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

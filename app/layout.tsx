import "../styles/globals.css";
import NavBar from "../components/NavBar";
import ThemeToggle from "../components/ThemeToggle";
import Footer from "../components/Footer";
import AuthProvider from "../components/AuthProvider";
import IntroAnimation from "../components/IntroAnimation";
import MuiSnackbarProvider from "../components/MuiSnackbar";
import MuiAppProvider from "../components/MuiAppProvider.client";
import ToastProvider from "../components/ToastProvider";

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
        <link rel="icon" href="/favicon.png" type="image/png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const shouldBeDark = theme === 'dark' || (!theme && prefersDark);
                document.documentElement.classList.toggle('dark', shouldBeDark);
              })();
            `,
          }}
        />
        {/* Plausible Analytics */}
        <script
          async
          src="https://plausible.io/js/pa--jHguBzxvrmKAgSeGgtcb.js"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};
              plausible.init();
            `,
          }}
        />
      </head>
      <body className="bg-slate-400 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
        <MuiAppProvider>
          <MuiSnackbarProvider>
            <AuthProvider>
              <IntroAnimation />
              <ToastProvider />
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:font-medium"
              >
                Skip to main content
              </a>
              <div className="min-h-screen flex flex-col">
                <NavBar />
                <main id="main-content" className="flex-1 container mx-auto px-4 py-8">
                  {children}
                </main>
                <Footer />
                <ThemeToggle />
              </div>
            </AuthProvider>
          </MuiSnackbarProvider>
        </MuiAppProvider>
      </body>
    </html>
  );
}

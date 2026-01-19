export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-lg font-bold text-primary dark:text-tertiary mb-3">
              The UnOfficial
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Where Stories Come Alive. Smart, fun, optimistic NBA writing that sounds like your group chat.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-tertiary dark:hover:text-tertiary transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/posts"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-tertiary dark:hover:text-tertiary transition-colors"
                >
                  Articles
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-tertiary dark:hover:text-tertiary transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/dashboard"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-tertiary dark:hover:text-tertiary transition-colors"
                >
                  Dashboard
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wider">
              Connect
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Real fans, real talk. Join the conversation about the game we love.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {currentYear} The UnOfficial. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a
                href="/posts"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-tertiary dark:hover:text-tertiary transition-colors"
              >
                Latest Posts
              </a>
              <a
                href="/about"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-tertiary dark:hover:text-tertiary transition-colors"
              >
                About Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

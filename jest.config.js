module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/$1',
  },
  transform: {
    // TypeScript/TSX files via ts-jest
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: { jsx: 'react-jsx' } }],
    // Plain JS files from ESM-only node_modules need transformation too.
    '^.+\\.js$': ['ts-jest', { tsconfig: { jsx: 'react-jsx', allowJs: true } }],
  },
  // Many packages in the remark/rehype/swiper ecosystem ship as ESM-only.
  // Jest uses CommonJS by default, so we must allow ts-jest to transform them.
  transformIgnorePatterns: [
    '/node_modules/(?!(swiper|ssr-window|dom7|rehype-sanitize|remark-gfm|react-markdown|unified|bail|is-plain-obj|trough|vfile|vfile-message|unist-util-stringify-position|unist-util-visit|unist-util-visit-parents|unist-util-is|unist-util-position|micromark|mdast-util-from-markdown|mdast-util-to-string|mdast-util-gfm|remark-parse|remark-rehype|hast-util-to-html|hast-util-raw|hast-util-sanitize|hast-util-from-parse5|hast-util-to-parse5|hastscript|property-information|html-void-elements|zwitch|web-namespaces|space-separated-tokens|comma-separated-tokens|decode-named-character-reference|character-entities|devlop|trim-lines|extend)/)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
};

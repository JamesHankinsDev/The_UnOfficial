/**
 * MarkdownRenderer unit tests.
 *
 * react-markdown and its unified/micromark/remark/rehype dependency chain are
 * ESM-only and incompatible with Jest's CommonJS runtime. Rather than
 * chase every transitive dependency into the transformIgnorePatterns list,
 * we mock the library here and test what MarkdownRenderer itself is responsible
 * for: the section wrapper, aria semantics, className, and correct plugin
 * configuration passed to ReactMarkdown.
 *
 * Integration-level rendering (headings, links, XSS sanitization) is validated
 * in the running app and is covered by the react-markdown / rehype-sanitize
 * libraries' own test suites.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';

// Capture props passed to ReactMarkdown so we can assert on plugin config.
let capturedProps: Record<string, unknown> = {};

jest.mock('react-markdown', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    capturedProps = props;
    // Render children as plain text so we can still assert on content passthrough.
    return <div data-testid="markdown-output">{props.children as React.ReactNode}</div>;
  },
}));

// These are imported by MarkdownRenderer — mock them to avoid ESM parse errors.
jest.mock('rehype-sanitize', () => 'mock-rehype-sanitize');
jest.mock('remark-gfm', () => 'mock-remark-gfm');

import MarkdownRenderer from '@/components/MarkdownRenderer';

describe('MarkdownRenderer', () => {
  beforeEach(() => {
    capturedProps = {};
  });

  it('wraps output in a <section> element', () => {
    const { container } = render(<MarkdownRenderer content="hello" />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('applies the correct aria-label to the section', () => {
    const { container } = render(<MarkdownRenderer content="hello" />);
    const section = container.querySelector('section');
    expect(section).toHaveAttribute('aria-label', 'Article content');
  });

  it('applies prose Tailwind classes to the section', () => {
    const { container } = render(<MarkdownRenderer content="hello" />);
    const section = container.querySelector('section');
    expect(section?.className).toMatch(/prose/);
  });

  it('passes the content string as children to ReactMarkdown', () => {
    render(<MarkdownRenderer content="My article text" />);
    expect(capturedProps.children).toBe('My article text');
  });

  it('configures ReactMarkdown with remark-gfm plugin', () => {
    render(<MarkdownRenderer content="content" />);
    const plugins = capturedProps.remarkPlugins as unknown[];
    expect(plugins).toContain('mock-remark-gfm');
  });

  it('configures ReactMarkdown with rehype-sanitize plugin', () => {
    render(<MarkdownRenderer content="content" />);
    const plugins = capturedProps.rehypePlugins as unknown[];
    expect(plugins).toContain('mock-rehype-sanitize');
  });

  it('renders the mocked markdown output element', () => {
    render(<MarkdownRenderer content="test content" />);
    expect(screen.getByTestId('markdown-output')).toBeInTheDocument();
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock usePosts before importing the component
jest.mock('../lib/usePosts', () => ({
  usePosts: jest.fn(),
}));

// Swiper ships as ESM-only. Mock to avoid transform errors.
jest.mock('swiper/react', () => ({
  Swiper: ({ children }: { children: React.ReactNode }) => <div data-testid="swiper">{children}</div>,
  SwiperSlide: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
jest.mock('swiper', () => ({ default: { use: jest.fn() }, use: jest.fn() }));
jest.mock('swiper/css', () => ({}));
jest.mock('swiper/css/autoplay', () => ({}));
jest.mock('swiper/modules', () => ({ Autoplay: {} }));

// Mock next/head
jest.mock('next/head', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock next/link (used by PostCard inside the home page)
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock fetch for SubscribeForm's API call
global.fetch = jest.fn(() =>
  Promise.resolve({ ok: true, json: () => Promise.resolve({ message: 'ok' }) })
) as jest.Mock;

import { usePosts } from '../lib/usePosts';
import Home from '../app/page';

const mockUsePosts = usePosts as jest.MockedFunction<typeof usePosts>;

const mockPosts = [
  {
    id: '1',
    title: 'Test Article 1',
    excerpt: 'Excerpt 1',
    slug: 'test-article-1',
    authorName: 'Author 1',
    content: 'some content',
    publishedAt: { seconds: 1700000000 },
    releaseDate: { seconds: 1700000000 }, // past date
  },
  {
    id: '2',
    title: 'Test Article 2',
    excerpt: 'Excerpt 2',
    slug: 'test-article-2',
    authorName: 'Author 2',
    content: 'some content',
    publishedAt: { seconds: 1700000001 },
    releaseDate: { seconds: 1700000001 },
  },
];

describe('Home Page', () => {
  beforeEach(() => {
    mockUsePosts.mockReturnValue({ posts: mockPosts, loading: false, error: null });
    // jsdom defaults window.innerWidth to 0, triggering the mobile accordion layout.
    // Set to desktop width so the Swiper carousel path is rendered.
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the subscribe form with an email input', () => {
    render(<Home />);
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
  });

  it('renders the subscribe button', () => {
    render(<Home />);
    expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument();
  });

  it('renders the site welcome heading', () => {
    render(<Home />);
    // The welcome section is always rendered regardless of post date filtering.
    expect(screen.getByText(/welcome to the unofficial/i)).toBeInTheDocument();
  });
});

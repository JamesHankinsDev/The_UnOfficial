import React from 'react';
import { render, screen } from '@testing-library/react';
import PostCard from '@/components/PostCard';

jest.mock('next/link', () => {
  return ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  );
});

const basePost = {
  id: '1',
  title: 'Test Post Title',
  excerpt: 'This is a test excerpt.',
  slug: 'test-post-title',
  authorName: 'Jane Doe',
  content: 'word '.repeat(400).trim(), // 400 words = 2 min read
  publishedAt: { seconds: 1705276800 }, // 2024-01-15
  tags: ['NBA', 'Lakers', 'Analysis'],
};

describe('PostCard', () => {
  it('renders the post title as a link to the post', () => {
    render(<PostCard post={basePost} />);
    const link = screen.getByRole('link', { name: /Test Post Title/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/posts/test-post-title');
  });

  it('renders the author name', () => {
    render(<PostCard post={basePost} />);
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  });

  it('renders the excerpt', () => {
    render(<PostCard post={basePost} />);
    expect(screen.getByText('This is a test excerpt.')).toBeInTheDocument();
  });

  it('renders the estimated read time', () => {
    render(<PostCard post={basePost} />);
    expect(screen.getByText(/2 min read/i)).toBeInTheDocument();
  });

  it('renders up to 3 tags', () => {
    render(<PostCard post={basePost} />);
    expect(screen.getByText('NBA')).toBeInTheDocument();
    expect(screen.getByText('Lakers')).toBeInTheDocument();
    expect(screen.getByText('Analysis')).toBeInTheDocument();
  });

  it('does not render a 4th tag', () => {
    const post = { ...basePost, tags: ['A', 'B', 'C', 'D'] };
    render(<PostCard post={post} />);
    expect(screen.queryByText('D')).not.toBeInTheDocument();
  });

  it('does not render the tags list when tags is empty', () => {
    render(<PostCard post={{ ...basePost, tags: [] }} />);
    expect(screen.queryByRole('list', { name: /post tags/i })).not.toBeInTheDocument();
  });

  it('does not render a listen time badge without audioDuration', () => {
    render(<PostCard post={basePost} />);
    expect(screen.queryByText(/min listen/i)).not.toBeInTheDocument();
  });

  it('renders a listen time badge when audioDuration is provided', () => {
    render(<PostCard post={{ ...basePost, audioDuration: 300 }} />);
    expect(screen.getByText(/5 min listen/i)).toBeInTheDocument();
  });

  it('does not render a time element when publishedAt is null', () => {
    render(<PostCard post={{ ...basePost, publishedAt: null }} />);
    expect(screen.queryByRole('time')).not.toBeInTheDocument();
  });

  it('renders the published date when publishedAt is present', () => {
    render(<PostCard post={basePost} />);
    expect(screen.getByRole('time')).toBeInTheDocument();
  });
});

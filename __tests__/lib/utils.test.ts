import { slugify, estimateReadingTime } from '@/lib/utils';

describe('slugify', () => {
  it('converts title to lowercase with hyphens', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('removes special characters', () => {
    expect(slugify('NBA Finals: The 2024 Recap!')).toBe('nba-finals-the-2024-recap');
  });

  it('collapses multiple spaces into a single hyphen', () => {
    expect(slugify('too   many   spaces')).toBe('too-many-spaces');
  });

  it('collapses multiple hyphens into a single hyphen', () => {
    expect(slugify('already--hyphenated')).toBe('already-hyphenated');
  });

  it('trims leading and trailing whitespace', () => {
    expect(slugify('  trimmed  ')).toBe('trimmed');
  });

  it('handles empty string', () => {
    expect(slugify('')).toBe('');
  });

  it('preserves numbers', () => {
    expect(slugify('Top 10 Players')).toBe('top-10-players');
  });
});

describe('estimateReadingTime', () => {
  it('returns 1 for very short text', () => {
    expect(estimateReadingTime('hello world')).toBe(1);
  });

  it('returns 1 for exactly 200 words', () => {
    const text = Array(200).fill('word').join(' ');
    expect(estimateReadingTime(text)).toBe(1);
  });

  it('returns 2 for exactly 400 words', () => {
    const text = Array(400).fill('word').join(' ');
    expect(estimateReadingTime(text)).toBe(2);
  });

  it('rounds up with Math.ceil — 201 words = 2 min', () => {
    const text = Array(201).fill('word').join(' ');
    expect(estimateReadingTime(text)).toBe(2);
  });

  it('returns at least 1 minute for empty-like input', () => {
    // ''.trim().split(/\s+/) returns [''], length 1
    // Math.max(1, Math.ceil(1/200)) = 1
    expect(estimateReadingTime('')).toBe(1);
  });
});

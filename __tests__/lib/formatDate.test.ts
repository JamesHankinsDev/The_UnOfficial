import { formatDate } from '@/lib/formatDate';

describe('formatDate', () => {
  it('returns empty string for null', () => {
    expect(formatDate(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(formatDate(undefined)).toBe('');
  });

  it('returns empty string for empty string (falsy)', () => {
    expect(formatDate('')).toBe('');
  });

  it('formats a Firestore Timestamp with toDate() method', () => {
    const timestamp = {
      toDate: () => new Date('2024-06-15T12:00:00.000Z'),
    };
    const result = formatDate(timestamp);
    expect(result).toContain('2024');
  });

  it('formats a Firestore Timestamp-like object with seconds field', () => {
    // 1718445600 = 2024-06-15 12:00:00 UTC — noon avoids midnight timezone boundary issues
    const timestamp = { seconds: 1718445600 };
    const result = formatDate(timestamp);
    expect(result).toContain('2024');
  });

  it('formats a plain Date object', () => {
    const date = new Date('2024-03-20T12:00:00.000Z');
    const result = formatDate(date);
    expect(result).toContain('2024');
  });

  it('formats a date string', () => {
    const result = formatDate('2025-08-10');
    expect(result).toContain('2025');
  });

  it('formats a numeric timestamp (ms since epoch)', () => {
    // Use noon UTC to avoid midnight boundary crossing timezones (e.g. UTC-8 renders
    // 2023-01-01T00:00:00Z as "December 31, 2022").
    const ms = new Date('2023-06-15T12:00:00.000Z').getTime();
    const result = formatDate(ms);
    expect(result).toContain('2023');
  });

  it('uses long month format by default', () => {
    const date = new Date('2024-01-15T12:00:00.000Z');
    const result = formatDate(date);
    // Default options include month: 'long', so result should contain full month name
    expect(result).toMatch(/January|February|March|April|May|June|July|August|September|October|November|December/);
  });

  it('respects short month format option', () => {
    const date = new Date('2024-01-15T12:00:00.000Z');
    const result = formatDate(date, { month: 'short', day: 'numeric', year: 'numeric' });
    expect(result).toMatch(/Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/);
    // Should NOT contain a full month name
    expect(result).not.toMatch(/January|February/);
  });

  it('prefers toDate() over seconds when both are present', () => {
    const timestamp = {
      toDate: () => new Date('2024-12-25T12:00:00.000Z'),
      seconds: 0, // epoch — would give 1970 if used
    };
    const result = formatDate(timestamp);
    expect(result).toContain('2024');
  });
});

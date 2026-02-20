/**
 * @jest-environment node
 *
 * NextRequest uses the Web API Request object, which requires the Node
 * environment (available natively in Node 18+) rather than jsdom.
 */
import { NextRequest } from 'next/server';

// All jest.mock() calls must be hoisted above imports.
// Mock Firebase client so the route doesn't short-circuit with "Database not configured."
jest.mock('@/lib/firebase/client', () => ({
  firestore: {}, // truthy object — satisfies the `if (!firestore)` guard
}));

// Mock individual Firestore functions used by the subscribe route
const mockGetDocs = jest.fn();
const mockSetDoc = jest.fn();
const mockDoc = jest.fn(() => ({ id: 'mock-doc-id' }));
const mockCollection = jest.fn(() => 'mock-collection-ref');
const mockQuery = jest.fn(() => 'mock-query');
const mockWhere = jest.fn(() => 'mock-where');

jest.mock('firebase/firestore', () => ({
  collection: (...args: any[]) => mockCollection.apply(null, args),
  query: (...args: any[]) => mockQuery.apply(null, args),
  where: (...args: any[]) => mockWhere.apply(null, args),
  getDocs: (...args: any[]) => mockGetDocs.apply(null, args),
  setDoc: (...args: any[]) => mockSetDoc.apply(null, args),
  doc: (...args: any[]) => mockDoc.apply(null, args),
}));

// Import AFTER mocks are registered
import { POST } from '@/app/api/subscribe/route';

function makeRequest(body: object): NextRequest {
  return new NextRequest('http://localhost/api/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/subscribe', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 400 for a missing email field', async () => {
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/invalid email/i);
  });

  it('returns 400 for a malformed email address', async () => {
    const res = await POST(makeRequest({ email: 'not-an-email' }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/invalid email/i);
  });

  it('returns 400 with "already subscribed" message when email exists', async () => {
    mockGetDocs.mockResolvedValueOnce({
      empty: false,
      docs: [{ id: 'existing-doc', data: () => ({}) }],
    });
    mockSetDoc.mockResolvedValueOnce(undefined);

    const res = await POST(makeRequest({ email: 'user@example.com' }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/already subscribed/i);
  });

  it('returns 200 and a success message for a new subscriber', async () => {
    mockGetDocs.mockResolvedValueOnce({ empty: true, docs: [] });
    mockSetDoc.mockResolvedValueOnce(undefined);

    const res = await POST(makeRequest({ email: 'new@example.com' }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.message).toMatch(/subscribed successfully/i);
  });

  it('normalizes email to lowercase before querying', async () => {
    mockGetDocs.mockResolvedValueOnce({ empty: true, docs: [] });
    mockSetDoc.mockResolvedValueOnce(undefined);

    await POST(makeRequest({ email: 'User@Example.COM' }));

    expect(mockWhere).toHaveBeenCalledWith(
      'normalizedEmail',
      '==',
      'user@example.com',
    );
  });

  it('returns 500 when Firebase throws an error', async () => {
    mockGetDocs.mockRejectedValueOnce(new Error('Firestore connection failed'));

    const res = await POST(makeRequest({ email: 'test@example.com' }));
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toMatch(/subscription failed/i);
  });
});

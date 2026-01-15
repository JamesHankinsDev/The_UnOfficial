# The UnOfficial — Next.js + Firebase

This repository is a starter for a blog built with Next.js (App Router), TypeScript, Tailwind CSS, MagicUI components, and Firebase (Auth, Firestore, Storage).

Quick setup

1. Install dependencies:

```bash
npm install
```

2. Create a Firebase project, enable Firestore and Storage, and enable Google Sign-In in Authentication.

3. Add environment variables (example `.env.local`) if you plan to enable Firebase features:

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

4. Update Firebase rules: see `firebase/firestore.rules` and `firebase/storage.rules` and paste into the Firebase Console > Rules.

5. Run locally:

```bash
npm run dev
```

Notes

- To make a user an `admin` for the initial bootstrap (once auth is enabled), sign-in with that Google account, then edit the new `users/{uid}` document in Firestore and set `role` to `admin`.
- The app uses client-side Firebase SDK. Server-side Firestore usage (for SSR) can be added later.

What's included

- Minimal App Router layout and home page
- `lib/firebase/*` client init + auth helpers
- `components/AuthProvider` React context tracking user + profile
- Basic UI components: `NavBar`, `PostCard`
- Firestore & Storage security rule files

Next steps

- Implement dashboard pages under `app/dashboard` (protected client components)
- Add post create/edit forms with cover image upload
- Add admin user management page

Auth notes

- Auth is currently disabled in the UI to simplify local development. To re-enable it:
  1.  Restore `Providers` in `app/layout.tsx` (wrap the layout children).
  2.  Re-enable `NavBar`'s auth UI or wire an auth route.
  3.  Ensure the Firebase env vars are set and Google Sign-In is enabled in the Firebase console.

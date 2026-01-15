# The UnOfficial

A modern blog platform built with Next.js, TypeScript, Tailwind CSS, and Firebase. Features role-based access control, markdown support, and a beautiful dark mode.

## Features

- 🎨 **Brand Colors** - Custom color palette with primary, secondary, tertiary, and accent colors
- 🌓 **Dark Mode** - Seamless light/dark theme switching with no flash
- 🔐 **Authentication** - Google sign-in with Firebase Auth
- 📝 **Content Management** - Create, edit, preview, and publish markdown posts
- 👥 **Role-Based Access** - Owner, Writer, and Reader roles with different permissions
- 🎫 **Invite System** - Owners can generate invite codes to add writers
- 📊 **Dashboard** - Manage drafts, published posts, and invite codes
- 🏀 **Custom Logo** - SVG basketball logo with brand styling

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with @tailwindcss/typography
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Markdown**: react-markdown with remark-gfm and rehype-sanitize

## Quick Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Firestore Database** in production mode
3. Enable **Google Sign-In** in Authentication > Sign-in methods
4. Enable **Storage** for future file uploads

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Get these values from Firebase Console > Project Settings > General > Your apps > Web app.

### 4. Deploy Firestore Rules

Copy the contents of `firebase/firestore.rules` and paste into:
Firebase Console > Firestore Database > Rules

Then click **Publish**.

### 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the site.

### 6. Set Up First Owner

1. Sign in with Google (you'll start as a "reader")
2. Go to Firebase Console > Firestore Database > `users` collection
3. Find your user document (by your UID)
4. Edit the document and change `role` from `"reader"` to `"owner"`
5. Refresh the app - you'll now have full admin access!

## Deploying to Vercel

### Manual Deploy

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure project settings

3. **Add Environment Variables**
   
   In Vercel Dashboard > Your Project > Settings > Environment Variables, add all your Firebase config:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`

4. **Update Firebase Settings**
   
   In Firebase Console:
   - Go to Authentication > Settings > Authorized domains
   - Add your Vercel domain (e.g., `your-app.vercel.app`)

5. **Deploy**
   
   Vercel will automatically deploy when you push to main branch.

## User Roles

### Owner
- Full access to everything
- Can create, edit, and delete any post
- Can generate writer invite codes
- Can manage all users
- Orange badge on profile

### Writer
- Can create, edit, and delete their own posts
- Can manage their own drafts and published posts
- Green badge on profile

### Reader
- Can view published posts
- Cannot create or edit content
- Default role for new sign-ups

## Key Features Explained

### Dark Mode
- Uses Tailwind's `dark:` class strategy
- Persists preference in localStorage
- Blocking script prevents flash on page load
- Toggle button in bottom-left corner

### Post Creation
- Markdown editor with preview
- Draft/Published status toggle
- Auto-generated excerpts from content
- URL-friendly slug generation
- Tag support

### Writer Invites
- Owner generates 8-character codes
- Codes are one-time use
- Full invite link auto-generated
- Tracks who created and used each code

### Security
- Firestore rules enforce role-based access
- Published posts are public
- Drafts only visible to authors
- Environment variables kept secure with .gitignore

## Development Notes

- All Firebase credentials are in `.env.local` (not committed to git)
- Firestore security rules must be deployed separately
- First user must be manually promoted to "owner" in Firestore
- Console logs removed for production

## Troubleshooting

### "Missing or insufficient permissions"
- Make sure Firestore rules are deployed
- Check that your user has the correct role in Firestore

### "Firebase not initialized"
- Verify all environment variables are set correctly
- Check Firebase Console that services are enabled

### Posts stuck on "Loading..."
- Ensure Firestore database is created (not just initialized)
- Check browser console for specific errors
- Verify security rules allow listing posts

## License

MIT

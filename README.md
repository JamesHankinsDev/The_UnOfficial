# The UnOfficial

A modern, full-featured blog platform built with Next.js, TypeScript, Tailwind CSS, and Firebase. Features role-based access control, markdown support, beautiful dark mode, and a complete content management system.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## ✨ Features

### Content Management

- 📝 **Markdown Editor** - Write posts with full markdown support and live preview
- 📊 **Draft System** - Save drafts and publish when ready
- 🔄 **Unpublish** - Move published posts back to drafts for editing
- 🏷️ **Tags & Categories** - Organize content with tags
- 🔍 **Search & Filter** - Find posts by title, content, or tags

### User System

- 🔐 **Google Authentication** - Secure sign-in with Firebase Auth
- 👥 **Role-Based Access** - Three role levels (Owner, Writer, Reader)
- 🎫 **Invite System** - Generate one-time codes to invite writers
- 📈 **User Dashboard** - Manage your drafts and published posts

### Design & UX

- 🎨 **Custom Brand Colors** - Primary: #172A3A, Secondary: #004346, Tertiary: #09BC8A
- 🌓 **Dark Mode** - Seamless theme switching with no flash
- 🏀 **Custom Logo** - SVG basketball design
- 📱 **Responsive** - Works beautifully on all devices
- ⚡ **Fast** - Optimized Next.js with static generation

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Firebase account
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd 06_The_Unofficial
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up Firebase**

   - Create a project at [Firebase Console](https://console.firebase.google.com)
   - Enable **Firestore Database** (production mode)
   - Enable **Google Sign-In** in Authentication
   - Enable **Storage**

4. **Configure environment variables**

   Create `.env.local` in the root:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

   Get these from Firebase Console → Project Settings → Web App

5. **Deploy Firestore Rules**

   Copy contents of `firebase/firestore.rules` to:
   Firebase Console → Firestore Database → Rules → Publish

6. **Run development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

7. **Create your first owner account**
   - Sign in with Google on your local site
   - Go to Firebase Console → Firestore → `users` collection
   - Find your user document and edit `role` to `"owner"`
   - Refresh the site - you now have full access!

## 👥 User Roles

### 🟠 Owner

- Full administrative access
- Create, edit, delete any post
- Generate writer invite codes
- Manage all users
- View all drafts and published posts

### 🟢 Writer

- Create and publish posts
- Edit and delete own posts
- Manage own drafts
- Cannot access other users' content

### 🔵 Reader (Default)

- View published posts
- Cannot create or edit content
- Default role for new sign-ups

## 📖 Usage Guide

### Creating a Post

1. Sign in and go to Dashboard
2. Click "Create Post"
3. Write your title, content (markdown supported), and excerpt
4. Add tags (comma-separated)
5. Choose "Draft" or "Published"
6. Click "Save Post"

### Inviting Writers

1. Sign in as Owner
2. Go to Dashboard
3. Scroll to "Writer Invitations"
4. Click "Generate Code"
5. Copy the invite link and share it
6. When someone signs in with that link, they become a Writer

### Managing Posts

- **Drafts**: Edit, preview, or publish from Dashboard
- **Published**: View, edit, or unpublish from Dashboard
- **Preview**: Click "Preview" button in editor to see formatted post

## 🏗️ Project Structure

```
06_The_Unofficial/
├── app/                        # Next.js App Router
│   ├── layout.tsx             # Root layout with theme
│   ├── page.tsx               # Home page
│   ├── posts/
│   │   ├── page.tsx           # Posts listing
│   │   ├── create/            # Create post
│   │   ├── edit/[id]/         # Edit post
│   │   └── [slug]/            # View post
│   ├── dashboard/             # User dashboard
│   ├── settings/              # User settings
│   └── signup/writer/         # Writer invite page
├── components/
│   ├── AuthProvider.tsx       # Auth context
│   ├── Logo.tsx               # Basketball logo
│   ├── MarkdownRenderer.tsx   # Markdown display
│   ├── NavBar.tsx             # Navigation
│   ├── PostCard.tsx           # Post preview
│   └── ThemeToggle.tsx        # Dark mode toggle
├── lib/
│   ├── firebase/
│   │   ├── client.ts          # Firebase init
│   │   ├── auth.ts            # Auth functions
│   │   ├── posts.ts           # Post CRUD
│   │   └── invites.ts         # Invite system
│   └── utils.ts               # Utilities
├── firebase/
│   ├── firestore.rules        # Security rules
│   └── storage.rules          # Storage rules
└── styles/
    └── globals.css            # Global styles
```

## 🚢 Deployment

### Deploy to Vercel

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**

   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Add environment variables (same as `.env.local`)
   - Deploy!

3. **Update Firebase**
   - Add your Vercel domain to Firebase authorized domains
   - Authentication → Settings → Authorized domains

📋 See [VERCEL_CHECKLIST.md](./VERCEL_CHECKLIST.md) for detailed deployment steps.

## 🎨 Customization

### Colors

Edit `tailwind.config.js`:

```js
colors: {
  primary: '#172A3A',    // Dark blue
  secondary: '#004346',  // Teal
  tertiary: '#09BC8A',   // Green
  accent: '#508991',     // Blue-grey
}
```

### Logo

Edit `components/Logo.tsx` to customize the basketball design.

### Theme

Dark mode toggle is in bottom-left. Preferences saved to localStorage.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Typography plugin
- **Authentication**: [Firebase Auth](https://firebase.google.com/docs/auth)
- **Database**: [Cloud Firestore](https://firebase.google.com/docs/firestore)
- **Storage**: [Firebase Storage](https://firebase.google.com/docs/storage)
- **Markdown**: [react-markdown](https://github.com/remarkjs/react-markdown)
- **Deployment**: [Vercel](https://vercel.com)

## 🔒 Security

- Environment variables never committed (`.gitignore`)
- Firestore rules enforce role-based access
- Published posts are public, drafts are private
- Authentication required for content creation
- Invite codes are one-time use

## 📚 Documentation

- [DEPLOY.md](./DEPLOY.md) - Full deployment guide
- [VERCEL_CHECKLIST.md](./VERCEL_CHECKLIST.md) - Step-by-step Vercel setup
- `.env.example` - Environment variables template

## 🐛 Troubleshooting

### Build Errors

```bash
npm run build
```

Check for TypeScript errors and fix them.

### Firebase Permissions

Ensure Firestore rules are deployed and match `firebase/firestore.rules`.

### Auth Not Working

- Check Firebase authorized domains include your domain
- Verify environment variables in Vercel
- Check browser console for errors

### Posts Not Loading

- Verify Firestore database exists (not just initialized)
- Check security rules allow public read for published posts
- Look for errors in browser console

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- Built with ❤️ using Next.js and Firebase
- Inspired by modern blog platforms
- Basketball logo design represents "The UnOfficial"

---

**Ready to deploy?** Check out [VERCEL_CHECKLIST.md](./VERCEL_CHECKLIST.md) for your deployment guide!

**Questions?** Open an issue on GitHub.

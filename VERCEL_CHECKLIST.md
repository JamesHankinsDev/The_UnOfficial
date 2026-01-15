# Vercel Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Code Ready
- [x] No build errors
- [x] All TypeScript errors resolved
- [x] Console logs removed
- [x] .gitignore configured properly
- [x] Environment variables template created (.env.example)

### 2. Firebase Configuration
- [ ] Firestore database created
- [ ] Google Sign-In enabled in Authentication
- [ ] Firestore rules deployed (copy from firebase/firestore.rules)
- [ ] Storage rules deployed (copy from firebase/storage.rules)
- [ ] All Firebase services enabled

### 3. Git Repository
- [ ] Code committed to main branch
- [ ] Pushed to GitHub
- [ ] .env.local NOT committed (check .gitignore)

## 🚀 Deployment Steps

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### Step 2: Import to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." > "Project"
3. Import your GitHub repository
4. Select the repository: `06_The_Unofficial`

### Step 3: Configure Project Settings
- **Framework Preset**: Next.js (should auto-detect)
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)

### Step 4: Add Environment Variables
In Vercel project settings, add these variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Copy these values from your local `.env.local` file or Firebase Console.

### Step 5: Deploy
Click "Deploy" button in Vercel dashboard

### Step 6: Update Firebase Authorized Domains
1. Go to Firebase Console
2. Authentication > Settings > Authorized domains
3. Add your Vercel domain (e.g., `your-app.vercel.app`)
4. Add your custom domain if you have one

### Step 7: Verify Deployment
- [ ] Visit your Vercel URL
- [ ] Test Google Sign-In
- [ ] Verify you can view posts
- [ ] Check dark mode toggle works
- [ ] Test creating a post (if you're an owner)

## 🔧 Post-Deployment Setup

### Make Your First Owner Account
1. Sign in to your deployed site with Google
2. Go to Firebase Console > Firestore Database
3. Find `users` collection > your user document
4. Edit the document and change `role` from `"reader"` to `"owner"`
5. Refresh the site - you now have full access!

### Generate Writer Invite Codes
1. Go to Dashboard (now that you're an owner)
2. Scroll to "Writer Invitations" section
3. Click "Generate Code"
4. Copy the invite link and share with writers

## 🎯 Custom Domain (Optional)

### Step 1: Add Domain in Vercel
1. Go to Project > Settings > Domains
2. Add your custom domain
3. Follow Vercel's DNS instructions

### Step 2: Update Firebase
Add your custom domain to Firebase authorized domains

## 📊 Monitoring

### Check Deployment Logs
- Vercel Dashboard > Deployments > [Your Deployment] > Build Logs

### Check Runtime Logs
- Vercel Dashboard > Deployments > [Your Deployment] > Runtime Logs

### Firebase Usage
- Firebase Console > Usage and billing
- Monitor Firestore reads/writes
- Monitor Authentication sign-ins

## 🐛 Troubleshooting

### Build Fails
- Check Vercel build logs
- Ensure all dependencies are in package.json
- Verify TypeScript has no errors locally

### Sign-In Fails
- Check Firebase authorized domains includes Vercel URL
- Verify environment variables are set correctly in Vercel
- Check browser console for Firebase errors

### Posts Not Loading
- Verify Firestore rules are deployed
- Check that posts exist and are published
- Look at browser Network tab for API errors

### Dark Mode Not Working
- Clear browser cache
- Check if localStorage is accessible
- Verify globals.css is loaded

## 🔄 Future Deployments

Vercel automatically deploys when you push to main branch:

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

Monitor deployment status in Vercel dashboard.

## 📝 Notes

- Vercel provides free SSL certificates automatically
- Analytics available in Vercel dashboard
- You can set up preview deployments for branches
- Environment variables can be different per environment (Production/Preview/Development)

## ✨ Success!

Your blog is now live! Share your URL and start creating content.

Questions? Check [DEPLOY.md](./DEPLOY.md) for full documentation.

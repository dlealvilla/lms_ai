# Deployment Guide: GitHub to Vercel

This guide walks you through deploying the LMS Writing Prototype to Vercel via GitHub.

## Prerequisites

1. A GitHub account
2. A Vercel account (sign up at [vercel.com](https://vercel.com))
3. Your project code ready to push

## Step 1: Push to GitHub

### If you don't have a GitHub repository yet:

1. **Create a new repository on GitHub:**
   - Go to [github.com/new](https://github.com/new)
   - Name it (e.g., `lms-ai` or `lms-writing-prototype`)
   - Choose Public or Private
   - **Don't** initialize with README, .gitignore, or license (we already have these)
   - Click "Create repository"

2. **Initialize git and push your code:**
   ```bash
   cd /Users/usyd/Desktop/LMS_AI
   git init
   git add .
   git commit -m "Initial commit: LMS Writing Prototype"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

   Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name.

### If you already have a GitHub repository:

```bash
cd /Users/usyd/Desktop/LMS_AI
git add .
git commit -m "Ready for deployment"
git push
```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard:**
   - Visit [vercel.com](https://vercel.com)
   - Sign in (or create an account if needed)

2. **Import your GitHub repository:**
   - Click "Add New..." → "Project"
   - Click "Import Git Repository"
   - Authorize Vercel to access your GitHub account if prompted
   - Select your repository (`LMS_AI` or whatever you named it)
   - Click "Import"

3. **Configure the project:**
   - **Framework Preset:** Vite (should auto-detect)
   - **Root Directory:** `./` (leave as default)
   - **Build Command:** `npm run build` (should auto-fill)
   - **Output Directory:** `dist` (should auto-fill)
   - **Install Command:** `npm install` (should auto-fill)

4. **Set Environment Variables:**
   - Click "Environment Variables"
   - Add: `VITE_GEMINI_API_KEY` = `your_actual_api_key_here`
   - Click "Save"
   - **Note:** If you don't add this, the app will run in mock mode (which is fine for testing)

5. **Deploy:**
   - Click "Deploy"
   - Wait for the build to complete (usually 1-3 minutes)
   - Your app will be live at a URL like `https://your-project-name.vercel.app`

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   cd /Users/usyd/Desktop/LMS_AI
   vercel
   ```
   - Follow the prompts
   - When asked about environment variables, add `VITE_GEMINI_API_KEY`

4. **For production deployment:**
   ```bash
   vercel --prod
   ```

## Step 3: Configure Environment Variables (Important!)

After your first deployment:

1. Go to your project in Vercel Dashboard
2. Click "Settings" → "Environment Variables"
3. Add:
   - **Name:** `VITE_GEMINI_API_KEY`
   - **Value:** Your actual Gemini API key
   - **Environment:** Production, Preview, Development (select all)
4. Click "Save"
5. **Redeploy** your project for the changes to take effect:
   - Go to "Deployments" tab
   - Click the three dots (⋯) on the latest deployment
   - Click "Redeploy"

## Step 4: Automatic Deployments

Vercel automatically deploys:
- **Production:** Every push to `main` branch
- **Preview:** Every push to other branches or pull requests

You can configure this in:
- **Settings** → **Git** → **Production Branch** (set to `main`)

## Troubleshooting

### Build Fails

1. **Check build logs** in Vercel Dashboard → Deployments → Click on failed deployment
2. **Common issues:**
   - Missing environment variables (check Step 3)
   - TypeScript errors (run `npm run build` locally first)
   - Missing dependencies (ensure `package.json` is correct)

### Environment Variables Not Working

- Make sure the variable name is exactly `VITE_GEMINI_API_KEY`
- Vite requires the `VITE_` prefix for client-side variables
- Redeploy after adding/changing environment variables

### App Shows "Mock AI mode"

- This means `VITE_GEMINI_API_KEY` is not set or empty
- Add the environment variable in Vercel Dashboard
- Redeploy the project

## Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow Vercel's DNS configuration instructions

## Updating Your Deployment

After making changes:

```bash
git add .
git commit -m "Your commit message"
git push
```

Vercel will automatically detect the push and redeploy!

## Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#vercel)
- [Vercel Dashboard](https://vercel.com/dashboard)


# Deploying from Cloned Repository (lms_ai_vercel)

## Step 1: Navigate to Your Cloned Repository

```bash
cd /path/to/lms_ai_vercel
```

## Step 2: Verify the Remote Repository

Check if the remote is already set up:

```bash
git remote -v
```

If you see the `lms_ai_vercel` repository URL, you're good. If not, or if you need to update it:

```bash
# Remove old remote (if exists)
git remote remove origin

# Add your new repository
git remote add origin https://github.com/YOUR_USERNAME/lms_ai_vercel.git
```

## Step 3: Push to GitHub

```bash
# Make sure you're on the main branch
git checkout main
# or
git branch -M main

# Push all code
git push -u origin main
```

## Step 4: Deploy to Vercel

### Via Vercel Dashboard:

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Find and select **`lms_ai_vercel`** repository
5. Click **"Import"**

6. **Configure Project:**
   - Framework Preset: **Vite** (should auto-detect)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (should auto-fill)
   - Output Directory: `dist` (should auto-fill)
   - Install Command: `npm install` (should auto-fill)

7. **Add Environment Variable:**
   - Click **"Environment Variables"**
   - Add: 
     - Name: `VITE_GEMINI_API_KEY`
     - Value: Your Gemini API key (or leave empty for mock mode)
   - Click **"Save"**

8. **Deploy:**
   - Click **"Deploy"**
   - Wait for build to complete (~1-3 minutes)
   - Your app will be live!

### Via Vercel CLI:

```bash
# Install Vercel CLI (if not already installed)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
cd /path/to/lms_ai_vercel
vercel

# For production
vercel --prod
```

## Step 5: Set Environment Variables (After First Deploy)

1. Go to Vercel Dashboard → Your Project
2. Click **"Settings"** → **"Environment Variables"**
3. Add `VITE_GEMINI_API_KEY` with your API key
4. Select all environments (Production, Preview, Development)
5. Click **"Save"**
6. **Redeploy** for changes to take effect:
   - Go to **"Deployments"** tab
   - Click the three dots (⋯) on latest deployment
   - Click **"Redeploy"**

## Troubleshooting

### If you get "Repository not found":
- Make sure the repository exists on GitHub
- Check that you have push access
- Verify the remote URL is correct: `git remote -v`

### If build fails:
- Check build logs in Vercel Dashboard
- Make sure `package.json` has all dependencies
- Run `npm install` locally to verify dependencies

### If environment variables don't work:
- Make sure variable name is exactly `VITE_GEMINI_API_KEY`
- Redeploy after adding/changing variables
- Check that you selected all environments


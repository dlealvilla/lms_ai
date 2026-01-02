# Troubleshooting: Still Getting Mock Responses

## Step 1: Check Browser Console

1. Open your deployed app in browser
2. Open Developer Tools (F12 or Cmd+Option+I)
3. Go to **Console** tab
4. Send a message in the chat
5. Look for:
   - Any error messages (red text)
   - Network requests to `/api/chat`
   - Check if the request is successful (200) or failing (404, 500, etc.)

## Step 2: Check Network Tab

1. In Developer Tools, go to **Network** tab
2. Send a message in chat
3. Look for a request to `/api/chat`
4. Click on it to see:
   - **Status**: Should be 200 (success) or 500 (error)
   - **Response**: What the API returned
   - **Headers**: Check the request URL

## Step 3: Check Vercel Logs (Different Location)

Vercel logs are in a different place:

1. Go to **Vercel Dashboard** → Your Project
2. Click on **Deployments** tab
3. Click on the **latest deployment** (the top one)
4. You'll see:
   - Build logs
   - Function logs (if you scroll down)
5. Or go to: **Settings** → **Logs** (if available in your plan)

## Step 4: Test API Directly

Test if the API route is working at all:

1. Open your deployed app URL (e.g., `https://your-app.vercel.app`)
2. Try accessing: `https://your-app.vercel.app/api/chat`
   - Should return: `{"error":"Method not allowed"}` (because it needs POST)
   - If you get 404, the API route isn't deployed

## Step 5: Verify Environment Variable

1. Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Check:
   - ✅ `VITE_GEMINI_API_KEY` exists
   - ✅ Value is set (not empty)
   - ✅ **Production** is checked (and Preview/Development if needed)
3. If you just added it, **you must redeploy**:
   - Go to **Deployments** tab
   - Click **⋯** (three dots) on latest deployment
   - Click **Redeploy**

## Step 6: Check API Route File Location

The API route must be at: `/api/chat.ts` (in the root, not in `/src/api/chat.ts`)

Verify in your GitHub repo that the file exists at the root level.

## Common Issues

### Issue 1: API Route Returns 404
**Problem**: The `/api/chat` route doesn't exist
**Fix**: 
- Make sure `api/chat.ts` is in the root of your project
- Push to GitHub and redeploy

### Issue 2: API Returns Mock Response
**Problem**: Environment variable not set or not readable
**Fix**:
- Set `VITE_GEMINI_API_KEY` in Vercel
- Make sure it's enabled for Production
- Redeploy after setting

### Issue 3: CORS Error
**Problem**: Browser blocking the request
**Fix**: Shouldn't happen with serverless functions, but check browser console

### Issue 4: "Failed to fetch"
**Problem**: Network error or API route not accessible
**Fix**: Check if the API route is deployed correctly

## Quick Test

Open browser console and run:
```javascript
fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt: 'test', chatHistory: [] })
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

This will show you exactly what the API is returning.


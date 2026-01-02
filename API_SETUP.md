# AI API Setup for Vercel

## What Changed

The AI generation now uses a **Vercel serverless function** (API route) instead of calling Gemini directly from the browser. This fixes:

1. ✅ **Security**: API key stays on server (not exposed to browser)
2. ✅ **CORS**: No CORS issues
3. ✅ **Reliability**: Better error handling

## File Structure

```
/api
  └── chat.ts          # Serverless function for AI chat
```

## Environment Variables in Vercel

Make sure you have set in Vercel Dashboard:

**Settings → Environment Variables:**
- Name: `VITE_GEMINI_API_KEY`
- Value: Your Gemini API key
- Environments: Production, Preview, Development (select all)

**OR** you can also use:
- Name: `GEMINI_API_KEY` 
- Value: Your Gemini API key

The API route will check both.

## Local Development

### Option 1: Use Vercel CLI (Recommended)

```bash
npm install -g vercel
vercel dev
```

This will:
- Start Vite dev server
- Handle API routes automatically
- Use your Vercel environment variables

### Option 2: Use Vite Dev Server

```bash
npm run dev
```

**Note**: API routes won't work with plain `vite dev`. You need to either:
- Use `vercel dev` (Option 1), OR
- Set up a local API server

## Testing

1. **Check if API key is set:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Make sure `VITE_GEMINI_API_KEY` is set

2. **Test the API:**
   - Open browser console
   - Try sending a message in the chat
   - Check console for any errors

3. **If it's in mock mode:**
   - You'll see "Mock AI mode" banner
   - API will return mock responses
   - Set the environment variable to enable real AI

## Troubleshooting

### "Failed to generate AI response"

1. Check Vercel function logs:
   - Vercel Dashboard → Your Project → Functions → `/api/chat`
   - Look for error messages

2. Verify environment variable:
   - Make sure `VITE_GEMINI_API_KEY` is set in Vercel
   - Redeploy after adding/changing env vars

3. Check API key validity:
   - Make sure your Gemini API key is valid
   - Get a new key from: https://makersuite.google.com/app/apikey

### API route returns 404

- Make sure the file is at `/api/chat.ts` (not `/src/api/chat.ts`)
- Vercel automatically detects API routes in `/api` folder
- Redeploy after adding the API route

### Works locally but not on Vercel

- Check Vercel build logs for errors
- Make sure `@vercel/node` is in dependencies (it is)
- Verify environment variables are set in Vercel


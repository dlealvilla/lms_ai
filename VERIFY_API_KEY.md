# How to Verify Your API Key is Working

## Check 1: Environment Variable is Set

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify `VITE_GEMINI_API_KEY` exists
3. Make sure it's enabled for **Production** environment (and Preview/Development if needed)

## Check 2: Check Vercel Function Logs

1. Go to Vercel Dashboard → Your Project → **Functions** tab
2. Click on `/api/chat`
3. Go to **Logs** tab
4. Try sending a message in your app
5. Check the logs for:
   - ✅ Success: You'll see the API call succeed
   - ❌ Error: You'll see error messages

## Check 3: Common Errors

### "Gemini API key not configured"
- The environment variable isn't set or isn't being read
- **Fix**: Make sure `VITE_GEMINI_API_KEY` is set in Vercel and redeploy

### "API_KEY_INVALID" or "PERMISSION_DENIED"
- Your API key is invalid or doesn't have permissions
- **Fix**: Get a new key from https://makersuite.google.com/app/apikey

### "QUOTA_EXCEEDED"
- You've exceeded your API quota
- **Fix**: Check your Google Cloud billing/quota settings

### Function returns 500 error
- Check the function logs in Vercel Dashboard
- Look for the specific error message
- Common: Missing `@vercel/node` package (but we already added it)

## Check 4: Test the API Directly

You can test the API route directly:

```bash
curl -X POST https://your-app.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello", "chatHistory": []}'
```

Replace `your-app.vercel.app` with your actual Vercel URL.

If it returns a mock response, the API key isn't set.
If it returns a real response, it's working!

## Important Notes

- **Environment variables require a redeploy** to take effect
- Make sure you selected the correct environment (Production/Preview/Development)
- The API key should NOT have quotes around it in Vercel
- Vercel caches environment variables, so changes might take a minute to propagate


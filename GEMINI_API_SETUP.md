# Gemini API Setup - Troubleshooting 404 Errors

If you're getting 404 errors for all Gemini models, it usually means:

## Issue: Generative Language API Not Enabled

Your API key exists, but the **Generative Language API** might not be enabled for your Google Cloud project.

## How to Fix:

### Step 1: Enable the API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create one if you don't have one)
3. Go to **APIs & Services** → **Library**
4. Search for **"Generative Language API"**
5. Click on it and click **"Enable"**

### Step 2: Verify API Key Permissions

1. Go to **APIs & Services** → **Credentials**
2. Find your API key
3. Click on it to edit
4. Under **"API restrictions"**, make sure:
   - Either "Don't restrict key" is selected, OR
   - "Restrict key" is selected AND "Generative Language API" is in the allowed APIs list

### Step 3: Check API Key Type

Make sure you're using the correct type of API key:
- **Server key** (for server-side use) - This is what you need
- **Browser key** (for client-side) - Won't work for serverless functions

### Step 4: Get a New API Key (if needed)

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. If you see your existing key, make sure the API is enabled
3. Or create a new API key
4. Make sure to enable the Generative Language API for that key

### Step 5: Update Vercel Environment Variable

1. Copy your API key
2. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
3. Update `VITE_GEMINI_API_KEY` with the new key
4. **Redeploy** your project

## Alternative: Check Available Models

The error message says "Call ListModels to see the list of available models". 

You can test your API key directly:

```bash
curl "https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_API_KEY"
```

Replace `YOUR_API_KEY` with your actual key. This will show you what models are available.

## Common Issues:

1. **API not enabled** - Most common cause of 404 errors
2. **Wrong API key type** - Need server key, not browser key
3. **API restrictions** - Key is restricted to wrong APIs
4. **Billing not enabled** - Some APIs require billing to be enabled (though Gemini has a free tier)

## After Enabling:

1. Wait a few minutes for the API to propagate
2. Update the API key in Vercel if you created a new one
3. Redeploy your Vercel project
4. Test again


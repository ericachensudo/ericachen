# API Setup Guide

Copy `.env.local.example` to `.env.local` and fill in the values below.
For Vercel, add the same keys under Project → Settings → Environment Variables.

---

## Instagram

Instagram requires a **Professional account** (Business or Creator) connected to a Facebook Page.

### Step 1 — Create a Meta app
1. Go to [developers.facebook.com](https://developers.facebook.com) and click **My Apps → Create App**
2. Choose **Other** → **Consumer** → give it a name (e.g. "Erica Site")
3. In the app dashboard, click **Add Product** → find **Instagram Graph API** → click Set Up

### Step 2 — Get a short-lived token
1. Go to [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. In the top-right dropdown, select your new app
3. Click **Generate Access Token** and authorize
4. Add these permissions: `instagram_basic`, `instagram_content_publish`, `pages_show_list`
5. Copy the token shown

### Step 3 — Exchange for a long-lived token (valid 60 days)
Run this in your terminal (replace `<APP_ID>`, `<APP_SECRET>`, `<SHORT_TOKEN>`):

```bash
curl "https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_id=<APP_ID>&client_secret=<APP_SECRET>&access_token=<SHORT_TOKEN>"
```

Copy the `access_token` from the response into `.env.local` as `INSTAGRAM_ACCESS_TOKEN`.

### Refreshing (every ~50 days)
The app refreshes the token automatically on each request and logs the new token.
Watch your Vercel logs and update `INSTAGRAM_ACCESS_TOKEN` when you see a refresh message.

---

## TikTok

### Step 1 — Create a TikTok developer app
1. Go to [developers.tiktok.com](https://developers.tiktok.com) and sign in with your TikTok account
2. Click **Manage Apps → Create App**
3. Fill in the name and description, choose **Web** as the platform
4. Under **Products**, add **Display API**
5. Under **Login Kit → Redirect domain**, add your domain (e.g. `your-site.vercel.app`)
   - For local dev, also add `localhost`

### Step 2 — Copy your credentials
From the app dashboard, copy:
- **Client Key** → `TIKTOK_CLIENT_KEY`
- **Client Secret** → `TIKTOK_CLIENT_SECRET`

### Step 3 — Set redirect URI
Add yourself as a tester under **App Settings → Manage app → Sandbox → Add testers**.
Set `TIKTOK_REDIRECT_URI` to `http://localhost:3000/api/tiktok/callback` for local dev,
or `https://your-site.vercel.app/api/tiktok/callback` for production.

### Step 4 — Authorize (one time)
With the dev server running (`npm run dev`), open:

```
http://localhost:3000/api/tiktok/connect
```

TikTok will ask you to log in and authorize. You'll be redirected back and see a JSON
response with your `TIKTOK_ACCESS_TOKEN` and `TIKTOK_REFRESH_TOKEN`. Paste both into `.env.local`.

### Refreshing
- Access tokens expire every **24 hours** — the app auto-refreshes them using the refresh token.
- When a refresh happens, the new tokens are logged to your server console / Vercel logs.
- Update `TIKTOK_REFRESH_TOKEN` in Vercel env vars whenever you see a refresh log.
- Refresh tokens expire after **365 days** — repeat Step 4 once a year.

---

## Local development

```bash
cp .env.local.example .env.local
# fill in your tokens
npm install
npm run dev
```

## Deploying to Vercel

```bash
git add .
git commit -m "add social feeds"
git push
```

Then in Vercel dashboard → your project → Settings → Environment Variables,
add each key from `.env.local` (never commit `.env.local` to git — it's in `.gitignore`).

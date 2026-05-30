# API Setup Guide

Copy `.env.local.example` to `.env.local` and fill in the values below.
For Vercel, add the same keys under Project → Settings → Environment Variables.

---

## Google My Maps (live places feed)

The interactive city map pulls your pins directly from a public Google My Maps —
no code edits needed when you add or update spots.

### Step 1 — Create your My Maps
1. Go to [mymaps.google.com](https://mymaps.google.com) and sign in with your Google account
2. Click **Create a new map**
3. Give it a name (e.g. "Erica's Places")

### Step 2 — Add a layer per city
Each city on your site = one layer in My Maps.

1. In the left panel, click the pencil icon next to "Untitled layer" and rename it to your city (e.g. `San Francisco`)
2. Click **Add layer** to add more cities (New York, Seattle, etc.)
3. Make sure you're on the right layer before dropping pins

### Step 3 — Add pins
1. Search for a place in the search bar → click **Add to map**
   *or* click the marker tool (below the search bar) and click anywhere on the map
2. Name the pin (this appears on your site)
3. In the description field, optionally add a category tag + your personal note:
   ```
   [food] best morning bun in the city
   [coffee] my WFH spot
   [outdoors] views of the whole bay
   [culture] incredible rotating exhibits
   ```
   If you skip the tag, the pin shows up as a general marker. Tags must be one of:
   `food`, `coffee`, `outdoors`, `culture`, `other`

### Step 4 — Make it public
1. Click **Share** (top of the left panel)
2. Under "Who has access", click **Change**
3. Set to **Anyone with the link** → Save

### Step 5 — Copy the Map ID
Look at the URL — it contains `?mid=` followed by a long string. Copy everything after `mid=` up to the next `&` (or the end of the URL).

For example, in:
```
https://www.google.com/maps/d/edit?mid=1aBcDeFgHiJkLmNoPqRsTuVwXyZ&usp=sharing
```
The Map ID is `1aBcDeFgHiJkLmNoPqRsTuVwXyZ`.

Paste it into `.env.local`:
```
GOOGLE_MYMAPS_ID=1aBcDeFgHiJkLmNoPqRsTuVwXyZ
```

And add it to Vercel → Project Settings → Environment Variables.

### Updating your places
- **Add a pin** → shows on site within ~1 hour (API cache refreshes automatically)
- **Add a new city** → add a new layer with that city's name, drop some pins, done
- **Edit a note** → update the pin description in My Maps, site refreshes within an hour

---

## Google Maps

The interactive city map in First Space uses the Google Maps JavaScript API.

### Step 1 — Create a Google Cloud project
1. Go to [console.cloud.google.com](https://console.cloud.google.com) and sign in
2. Click the project dropdown at the top → **New Project**
3. Give it a name (e.g. "Erica Site") and click **Create**

### Step 2 — Enable the Maps JavaScript API
1. In the left sidebar, go to **APIs & Services → Library**
2. Search for **Maps JavaScript API** and click it
3. Click **Enable**

### Step 3 — Create an API key
1. Go to **APIs & Services → Credentials**
2. Click **Create Credentials → API key**
3. Copy the key shown — you'll restrict it next

### Step 4 — Restrict the key (important!)
Click **Edit API key** on the key you just created:

**Application restrictions → HTTP referrers (websites)**
Add these referrers:
```
http://localhost:3000/*
https://your-site.vercel.app/*
```
Replace `your-site.vercel.app` with your actual Vercel domain.

**API restrictions → Restrict key**
Select **Maps JavaScript API** from the list.

Click **Save**.

### Step 5 — Add the key to your project
Paste the key into `.env.local`:
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
```

### Step 6 — Deploy to Vercel
In your Vercel dashboard → Project → **Settings → Environment Variables**, add:
- Key: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- Value: your API key

> **Note:** Google Maps requires a billing account to be enabled, but usage within the free tier (up to ~$200/month of Maps loads, roughly 28,000 map loads) costs nothing. Just add a credit card to your Google Cloud account to activate the key.

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

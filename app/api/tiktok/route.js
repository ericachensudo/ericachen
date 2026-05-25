import { NextResponse } from 'next/server';

const FIELDS = 'id,cover_image_url,share_url,video_description,duration,title,embed_link';

// Refresh the access token using the stored refresh token.
// TikTok access tokens last 24h; refresh tokens last 365 days.
// Each refresh produces a NEW refresh token — update TIKTOK_REFRESH_TOKEN in your env vars.
async function refreshAccessToken() {
  const res = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_key: process.env.TIKTOK_CLIENT_KEY,
      client_secret: process.env.TIKTOK_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: process.env.TIKTOK_REFRESH_TOKEN,
    }),
  });

  const data = await res.json();
  if (data.error) throw new Error(data.error_description ?? data.error);

  // Log the new tokens — update your env vars with these values.
  console.log('[TikTok] Tokens refreshed. Update your env vars:');
  console.log('  TIKTOK_ACCESS_TOKEN =', data.access_token);
  console.log('  TIKTOK_REFRESH_TOKEN =', data.refresh_token);

  return data.access_token;
}

export async function GET() {
  const accessToken = process.env.TIKTOK_ACCESS_TOKEN;
  const refreshToken = process.env.TIKTOK_REFRESH_TOKEN;

  if (!accessToken && !refreshToken) {
    return NextResponse.json(
      { error: 'TikTok is not connected. Visit /api/tiktok/connect to authorize.' },
      { status: 503 }
    );
  }

  // Try with the stored access token first; if it fails, refresh and retry.
  async function fetchVideos(token) {
    const res = await fetch(
      `https://open.tiktokapis.com/v2/video/list/?fields=${FIELDS}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ max_count: 18 }),
        next: { revalidate: 1800 },
      }
    );
    const data = await res.json();
    if (data.error?.code === 'access_token_invalid') throw new Error('expired');
    return data;
  }

  try {
    let data;
    try {
      data = await fetchVideos(accessToken);
    } catch (err) {
      if (err.message === 'expired' && refreshToken) {
        const newToken = await refreshAccessToken();
        data = await fetchVideos(newToken);
      } else {
        throw err;
      }
    }

    const videos = data.data?.videos ?? [];
    return NextResponse.json({ videos });
  } catch (err) {
    console.error('[TikTok]', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';

const IG_BASE = 'https://graph.instagram.com';
const FIELDS = 'id,media_type,media_url,thumbnail_url,permalink,caption,timestamp';

// Refresh the long-lived token before it expires (valid 60 days, refresh after 50).
async function maybeRefreshToken(token) {
  try {
    const res = await fetch(
      `${IG_BASE}/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`
    );
    const data = await res.json();
    // Returns a new token — in production you'd write this back to your env/KV store.
    // For now we log it so you can update INSTAGRAM_ACCESS_TOKEN in Vercel dashboard.
    if (data.access_token && data.access_token !== token) {
      console.log('[Instagram] Token refreshed. Update INSTAGRAM_ACCESS_TOKEN to:', data.access_token);
    }
    return data.access_token ?? token;
  } catch {
    return token; // keep using existing token if refresh fails
  }
}

export async function GET() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: 'INSTAGRAM_ACCESS_TOKEN is not set. See SETUP.md for instructions.' },
      { status: 503 }
    );
  }

  try {
    // Refresh token opportunistically (Instagram recommends refreshing every 50 days)
    const freshToken = await maybeRefreshToken(token);

    const res = await fetch(
      `${IG_BASE}/me/media?fields=${FIELDS}&limit=18&access_token=${freshToken}`,
      { next: { revalidate: 1800 } } // re-fetch every 30 min
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message ?? 'Instagram API error');
    }

    const data = await res.json();

    // Filter to only images and videos (exclude CAROUSEL_ALBUM children)
    const media = (data.data ?? []).filter((m) =>
      m.media_type === 'IMAGE' || m.media_type === 'VIDEO'
    );

    return NextResponse.json({ media });
  } catch (err) {
    console.error('[Instagram]', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';

// Step 1 of TikTok OAuth — visit /api/tiktok/connect in your browser to start.
// TikTok will redirect you back to /api/tiktok/callback with a code.
export async function GET() {
  const clientKey = process.env.TIKTOK_CLIENT_KEY;

  if (!clientKey) {
    return NextResponse.json(
      { error: 'TIKTOK_CLIENT_KEY is not set. See SETUP.md.' },
      { status: 503 }
    );
  }

  const params = new URLSearchParams({
    client_key: clientKey,
    scope: 'user.info.basic,video.list',
    response_type: 'code',
    redirect_uri: process.env.TIKTOK_REDIRECT_URI,
    state: crypto.randomUUID(), // CSRF protection
  });

  return NextResponse.redirect(
    `https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`
  );
}

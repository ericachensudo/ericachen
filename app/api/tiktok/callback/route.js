import { NextResponse } from 'next/server';

// Step 2 of TikTok OAuth — TikTok redirects here after you authorize.
// This exchanges the code for an access token + refresh token.
// Copy the tokens it prints and paste them into your .env.local / Vercel env vars.
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.json({ error, description: searchParams.get('error_description') }, { status: 400 });
  }

  if (!code) {
    return NextResponse.json({ error: 'No code returned from TikTok.' }, { status: 400 });
  }

  try {
    const res = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_key: process.env.TIKTOK_CLIENT_KEY,
        client_secret: process.env.TIKTOK_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.TIKTOK_REDIRECT_URI,
      }),
    });

    const data = await res.json();

    if (data.error) throw new Error(data.error_description ?? data.error);

    // Show the tokens so you can copy them into your env vars.
    // In production you'd store these in a database or Vercel KV.
    return NextResponse.json({
      message: '✅ TikTok connected! Copy these values into your .env.local and Vercel environment variables.',
      TIKTOK_ACCESS_TOKEN: data.access_token,
      TIKTOK_REFRESH_TOKEN: data.refresh_token,
      access_token_expires_in_seconds: data.expires_in,
      refresh_token_expires_in_seconds: data.refresh_expires_in,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

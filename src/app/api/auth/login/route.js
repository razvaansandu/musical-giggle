import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
  console.log("SPOTIFY_CLIENT_ID:", redirectUri);
  const scopes = "user-read-private user-read-email user-top-read";

  const authUrl = new URL("https://accounts.spotify.com/authorize");
  authUrl.searchParams.append("client_id", clientId);
  authUrl.searchParams.append("response_type", "code");
  authUrl.searchParams.append("redirect_uri", redirectUri);
  authUrl.searchParams.append("scope", scopes);
  console.log("Redirecting to Spotify Auth URL:", authUrl.toString());

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });
  const data = await res.json();
  const cookieStore = await cookies();
  cookieStore.set('auth_code', data.access_token);
  return NextResponse.json({ message: "Token ottenuto e salvato nel cookie." });
}
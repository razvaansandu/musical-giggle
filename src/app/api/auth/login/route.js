import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const generateRandomString = (length) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}


const sha256 = async (plain) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return crypto.subtle.digest('SHA-256', data);
}

const base64encode = (input) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

export async function POST() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
  console.log("SPOTIFY_CLIENT_ID:", redirectUri);
  const scope = "user-read-private user-read-email user-top-read";
  const codeVerifier  = generateRandomString(64);
  const hashed = await sha256(codeVerifier)
  const codeChallenge = base64encode(hashed);


  const authUrl = new URL("https://accounts.spotify.com/authorize");
  const params = {
    response_type: 'code',
    client_id: clientId,
    scope,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    redirect_uri: redirectUri,
  };

  authUrl.search = new URLSearchParams(params).toString();

  return NextResponse.json({ url: authUrl.toString() });

  /*authUrl.searchParams.append("client_id", clientId);
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
  return NextResponse.json({ message: "Token ottenuto e salvato nel cookie." });*/

}
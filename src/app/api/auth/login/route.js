import { NextResponse } from "next/server";

export async function POST() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
  console.log("Redirect URI:",clientId, redirectUri);

  const scopes = [
  "user-read-private",
  "user-read-email",

  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",

  "user-read-recently-played",
  "user-library-read",
  "user-library-modify",
  "ugc-image-upload", 
  "playlist-read-private",
  "playlist-modify-public",
  "playlist-modify-private",

  "user-follow-read",
  "user-follow-modify", 
  "user-top-read"
  
].join(" ");

  const authUrl = `https://accounts.spotify.com/authorize?${new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    scope: scopes,
  }).toString()}`;
  return NextResponse.json({ url: authUrl.toString() });

}

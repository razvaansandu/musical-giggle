import { NextResponse } from "next/server";

export async function POST() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

  const scopes = [
    "user-read-private",
    "user-read-email",
    "user-read-playback-state",
    "user-modify-playback-state",
  ].join(" ");

  const authUrl = `https://accounts.spotify.com/authorize?${new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    scope: scopes,
  }).toString()}`;
  return NextResponse.json({ url: authUrl.toString() });

}

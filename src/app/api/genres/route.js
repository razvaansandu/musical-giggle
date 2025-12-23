import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: "Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET" },
      { status: 500 }
    );
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${auth}`,
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
    }),
  });

  const tokenData = await tokenRes.json();

  if (!tokenRes.ok || tokenData.error) {
    return NextResponse.json(
      { error: "Failed to get token", details: tokenData },
      { status: 500 }
    );
  }

  const genreRes = await fetch(
    "https://api.spotify.com/v1/recommendations/available-genre-seeds",
    {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    }
  );

  const data = await genreRes.json();
  return NextResponse.json(data, { status: genreRes.status });
}

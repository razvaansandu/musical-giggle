// app/api/spotify/genres/route.js
import { NextResponse } from "next/server";

async function getAccessToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("SPOTIFY_CLIENT_ID o SPOTIFY_CLIENT_SECRET mancanti");
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${auth}`,
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Errore token Spotify:", errorText);
    throw new Error("Errore ottenendo token Spotify");
  }

  const data = await res.json();
  return data.access_token;
}

export async function GET() {
  try {
    const token = await getAccessToken();

    const response = await fetch(
      "https://api.spotify.com/v1/recommendations/available-genre-seeds",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Errore chiamata Spotify API:", errText);
      return NextResponse.json(
        { error: "Errore nella chiamata Spotify API", details: errText },
        { status: 500 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Errore generale:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
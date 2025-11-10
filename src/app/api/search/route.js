import { NextResponse } from "next/server";

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

let accessToken = null;
let tokenExpiresAt = 0;

async function refreshAccessToken() {
  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!tokenRes.ok) {
    throw new Error("Impossibile ottenere access token da Spotify");
  }

  const data = await tokenRes.json();
  accessToken = data.access_token;
  tokenExpiresAt = Date.now() + data.expires_in * 1000;

  console.log("Spotify access token aggiornato.");
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Parametro 'q' mancante" }, { status: 400 });
  }

  try {
    if (!accessToken || Date.now() > tokenExpiresAt) {
      await refreshAccessToken();
    }

    const searchRes = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!searchRes.ok) {
      throw new Error("Errore durante la ricerca su Spotify");
    }

    const data = await searchRes.json();
    const items = data.tracks?.items || [];

    const tracks = items.map((track) => ({
      id: track.id,
      name: track.name,
      artists: track.artists.map((a) => a.name).join(", "),
      album: track.album.name,
      preview_url: track.preview_url,
      external_url: track.external_urls.spotify,
      image: track.album.images[0]?.url,
    }));

    return NextResponse.json({ results: tracks });
  } catch (err) {
    console.error("Errore ricerca Spotify:", err);
    return NextResponse.json(
      { error: "Errore nella ricerca Spotify" },
      { status: 500 }
    );
  }
}

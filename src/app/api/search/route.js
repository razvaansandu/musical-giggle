import { NextResponse } from "next/server";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

let accessToken = null;
let tokenExpiresAt = 0;

async function refreshAccessToken() {
  const data = await spotifyApi.clientCredentialsGrant();
  accessToken = data.body.access_token;
  tokenExpiresAt = Date.now() + data.body.expires_in * 1000;
  spotifyApi.setAccessToken(accessToken);
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

    const data = await spotifyApi.searchTracks(query, { limit: 10 });
    const tracks = data.body.tracks.items.map((track) => ({
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

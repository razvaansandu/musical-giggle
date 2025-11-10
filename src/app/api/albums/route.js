import SpotifyWebApi from "spotify-web-api-node";
import { cookies } from "next/headers";

let spotifyApi;

if (!global.spotifyApi) {
  global.spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  });
}

spotifyApi = global.spotifyApi;

// Refresh token Client Credentials
async function refreshAccessToken() {
  try {
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body.access_token);
    console.log("✅ Token Spotify aggiornato (albums)");
  } catch (err) {
    console.error("❌ Errore aggiornamento token Spotify (albums):", err);
  }
}

await refreshAccessToken();
setInterval(refreshAccessToken, 3600 * 1000);

export async function GET(request) {
  try {
    const cookieStore = cookies();

    // Token utente se disponibile
    const userToken = cookieStore.get("spotify_token")?.value;

    // Se esiste token utente, sovrascrive quello client credentials
    if (userToken) {
      spotifyApi.setAccessToken(userToken);
    }

    const url = new URL(request.url);
    const q = url.searchParams.get("q");
    const limit = Number(url.searchParams.get("limit")) || 20;

    // SEARCH ALBUMS
    if (q) {
      const data = await spotifyApi.searchAlbums(q, { limit });
      const albums = data.body.albums.items.map((a) => ({
        id: a.id,
        name: a.name,
        artists: a.artists.map((ar) => ar.name).join(", "),
        release_date: a.release_date,
        total_tracks: a.total_tracks,
        image: a.images[0]?.url,
        url: a.external_urls?.spotify,
      }));

      return Response.json({ query: q, limit, albums });
    }

    // NEW RELEASES
    const releases = await spotifyApi.getNewReleases({ limit });
    const albums = releases.body.albums.items.map((a) => ({
      id: a.id,
      name: a.name,
      artists: a.artists.map((ar) => ar.name).join(", "),
      release_date: a.release_date,
      total_tracks: a.total_tracks,
      image: a.images[0]?.url,
      url: a.external_urls?.spotify,
    }));

    return Response.json({ type: "new-releases", limit, albums });
  } catch (err) {
    console.error("Errore Spotify API (albums):", err);
    return Response.json(
      { error: "Errore nel server Spotify API" },
      { status: 500 }
    );
  }
}

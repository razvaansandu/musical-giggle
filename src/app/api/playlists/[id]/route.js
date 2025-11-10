import SpotifyWebApi from "spotify-web-api-node";

let spotifyApi;
if (!global.spotifyApi) {
  global.spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  });
}
spotifyApi = global.spotifyApi;

async function refreshAccessToken() {
  try {
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body.access_token);
    console.log("✅ Token Spotify aggiornato");
  } catch (err) {
    console.error("Errore aggiornamento token Spotify:", err);
  }
}

await refreshAccessToken();
setInterval(refreshAccessToken, 3600 * 1000);

export async function GET(_request, { params }) {
  const { id } = params;

  try {
    const data = await spotifyApi.getPlaylist(id);
    const playlist = {
      id: data.body.id,
      name: data.body.name,
      description: data.body.description,
      image: data.body.images[0]?.url,
      url: data.body.external_urls.spotify,
      tracks: data.body.tracks.items.map((t) => ({
        name: t.track.name,
        artist: t.track.artists.map((a) => a.name).join(", "),
      })),
    };

    return Response.json(playlist);
  } catch (err) {
    console.error("Errore Spotify API:", err);
    return Response.json(
      { error: "Errore nel server Spotify API" },
      { status: 500 }
    );
  }
}

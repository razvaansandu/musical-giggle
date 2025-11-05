// routes/search.js
import express from "express";
import SpotifyWebApi from "spotify-web-api-node";

const router = express.Router();

// Inizializza Spotify API
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

// Recupera e salva l'access token
async function refreshAccessToken() {
  const data = await spotifyApi.clientCredentialsGrant();
  spotifyApi.setAccessToken(data.body.access_token);
  console.log("Spotify access token aggiornato.");
}

// Aggiorna subito all'avvio
await refreshAccessToken();

// Route principale: ricerca canzoni
router.get("/", async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: "Parametro 'q' mancante" });
  }

  try {
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

    res.json({ results: tracks });
  } catch (err) {
    console.error("Errore ricerca Spotify:", err);
    res.status(500).json({ error: "Errore nella ricerca Spotify" });
  }
});

export default router;
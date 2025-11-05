import SpotifyWebApi from "spotify-web-api-node";

export async function GET() {
  // ✅ Crea istanza API Spotify con i dati dell'ambiente
  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
  });

  // ✅ Scope richiesti (puoi aggiungerne altri se vuoi)
  const scopes = [
    "user-read-private",
    "user-read-email",
    "playlist-read-private",
  ];

  try {
    // ✅ Genera URL di login corretto
    const authorizeURL = spotifyApi.createAuthorizeURL(scopes, "state123", true);

    console.log("🔗 Reindirizzamento a:", authorizeURL);

    // ✅ Reindirizza l’utente alla pagina di login Spotify
    return Response.redirect(authorizeURL);
  } catch (err) {
    console.error("❌ Errore durante la creazione dell'URL Spotify:", err);
    return new Response("Errore durante la generazione del link di login", {
      status: 500,
    });
  }
}

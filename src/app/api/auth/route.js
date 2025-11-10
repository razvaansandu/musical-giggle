import SpotifyWebApi from "spotify-web-api-node";

export async function GET() {
  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
  });

  const scopes = [
    "user-read-private",
    "user-read-email",
    "playlist-read-private",
  ];

  try {
    const authorizeURL = spotifyApi.createAuthorizeURL(scopes, "state123", true);

    console.log(" Reindirizzamento a:", authorizeURL);

    return Response.redirect(authorizeURL);
  } catch (err) {
    console.error("Errore durante la creazione dell'URL Spotify:", err);
    return new Response("Errore durante la generazione del link di login", {
      status: 500,
    });
  }
}
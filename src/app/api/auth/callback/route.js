import SpotifyWebApi from "spotify-web-api-node";
import { cookies } from "next/headers";

export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
  });

  try {
    // 🔁 Scambia il code per token
    const data = await spotifyApi.authorizationCodeGrant(code);
    const access_token = data.body.access_token;
    const refresh_token = data.body.refresh_token;

    console.log("✅ Access token ricevuto:", access_token.slice(0, 15) + "...");

    // ⚙️ cookies() ora è ASYNC → va fatto await
    const cookieStore = await cookies();

    // ✅ Imposta i cookie
    cookieStore.set("spotify_access_token", access_token, {
      httpOnly: false, // true in produzione
      secure: false,   // true in HTTPS
      path: "/",
      maxAge: 3600,    // 1 ora
    });

    cookieStore.set("spotify_refresh_token", refresh_token, {
      httpOnly: false,
      secure: false,
      path: "/",
      maxAge: 3600 * 24 * 30, // 30 giorni
    });

    // ✅ Risposta di conferma
    return new Response(
      `<h1>Login completato!</h1><p>Cookie salvati</p>`,
      { headers: { "Content-Type": "text/html" } }
    );

  } catch (err) {
    console.error("❌ Errore durante il login Spotify:", err);
    return new Response("Errore durante il login Spotify", { status: 500 });
  }
}

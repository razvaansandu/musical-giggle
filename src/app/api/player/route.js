const SPOTIFY_API = "https://api.spotify.com/v1/me/player";

export async function GET() {
  try {
    const res = await fetch(SPOTIFY_API, {
      headers: {
        Authorization: `Bearer ${process.env.SPOTIFY_ACCESS_TOKEN}`,
      },
    });

    if (res.status === 204) return Response.json({ playing: false });

    const data = await res.json();

    const track = {
      name: data.item.name,
      artists: data.item.artists.map(a => a.name).join(", "),
      album: data.item.album.name,
      image: data.item.album.images[0]?.url,
      progress_ms: data.progress_ms,
      duration_ms: data.item.duration_ms,
      is_playing: data.is_playing,
    };

    return Response.json(track);
  } catch (err) {
    console.error("Errore Spotify API:", err);
    return Response.json({ error: "Errore Spotify API" }, { status: 500 });
  }
}

//pulsanti play, pause, next, previous
export async function POST(request) {
  try {
    const { action } = await request.json();
    let endpoint = "";

    switch (action) {
      case "play":
        endpoint = `${SPOTIFY_API}/play`;
        break;
      case "pause":
        endpoint = `${SPOTIFY_API}/pause`;
        break;
      case "next":
        endpoint = `${SPOTIFY_API}/next`;
        break;
      case "previous":
        endpoint = `${SPOTIFY_API}/previous`;
        break;
      default:
        return Response.json({ error: "Azione non valida" }, { status: 400 });
    }

    await fetch(endpoint, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${process.env.SPOTIFY_ACCESS_TOKEN}`,
      },
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("Errore controlli player:", err);
    return Response.json({ error: "Errore controlli player" }, { status: 500 });
  }
}

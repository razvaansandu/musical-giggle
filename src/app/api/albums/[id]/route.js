export async function GET(_request, { params }) {
  const { id } = params;

  try {
    const res = await fetch(`${process.env.SPOTIFY_API_URL}/v1/albums/${id}`, {
      headers: {
        Authorization: `Bearer ${process.env.SPOTIFY_ACCESS_TOKEN}`,
      },
    });

    const data = await res.json();

    const album = { 
      id: data.id,
      name: data.name, 
      artist: data.artists.map((a) => a.name).join(", "),
      release_date: data.release_date,
      total_tracks: data.total_tracks,
      image: data.images[0]?.url,
      url: data.external_urls.spotify,
      tracks: data.tracks.items.map((t) => ({
        name: t.name,
        duration_ms: t.duration_ms,
      })), 
    };
  
    return Response.json(album);
  } catch (err) {
    console.error("Errore Spotify API (album):", err);
    return Response.json({ error: "Errore nel server Spotify API" }, { status: 500 });
  }
}
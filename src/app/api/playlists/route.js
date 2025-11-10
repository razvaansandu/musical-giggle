import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(_req, { params }) {
  const { id } = params;

  const token = cookies().get("spotify_token")?.value || process.env.SPOTIFY_TOKEN;

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 500 });
  }

  const r = await fetch(`${process.env.SPOTIFY_API_URL}/playlists/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!r.ok) {
    return NextResponse.json(
      { error: "Failed", status: r.status },
      { status: r.status }
    );
  }

  const data = await r.json();

  const playlist = {
    id: data.id,
    name: data.name,
    description: data.description,
    image: data.images[0]?.url,
    url: data.external_urls?.spotify,
    tracks: data.tracks.items.map((t) => ({
      name: t.track?.name,
      artist: t.track?.artists?.map((a) => a.name).join(", "),
    })),
  };

  return NextResponse.json(playlist);
}

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

function getToken() {
  const cookieToken = cookies().get("spotify_token")?.value;
  return cookieToken || process.env.SPOTIFY_TOKEN;
}

export async function GET(_request, { params }) {
  const { id } = params;

  try {
    const token = getToken();
    const baseUrl = process.env.SPOTIFY_API_URL;

    if (!token) {
      return NextResponse.json(
        { error: "Missing token" },
        { status: 500 }
      );
    }

    if (!baseUrl) {
      return NextResponse.json(
        { error: "Missing SPOTIFY_API_URL env variable" },
        { status: 500 }
      );
    }

    const res = await fetch(`${baseUrl}/albums/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch album", status: res.status },
        { status: res.status }
      );
    }

    const data = await res.json();

    const album = {
      id: data.id,
      name: data.name,
      artist: data.artists.map(a => a.name).join(", "),
      release_date: data.release_date,
      total_tracks: data.total_tracks,
      image: data.images[0]?.url,
      url: data.external_urls?.spotify,
      tracks: data.tracks?.items?.map(t => ({
        name: t.name,
        duration_ms: t.duration_ms,
      })) || [],
    };

    return NextResponse.json(album);
  } catch (err) {
    console.error("Errore Spotify API (album):", err);
    return NextResponse.json(
      { error: "Errore nel server Spotify API" },
      { status: 500 }
    );
  }
}

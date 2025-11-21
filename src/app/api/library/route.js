import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const token = cookies().get("auth_code")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const playlistsRes = await fetch(
    "https://api.spotify.com/v1/me/playlists?limit=20",
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const playlists = await playlistsRes.json();

  const albumsRes = await fetch(
    "https://api.spotify.com/v1/me/albums?limit=20",
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const albums = await albumsRes.json();

  return NextResponse.json({
    playlists: playlists.items || [],
    albums: albums.items || []
  });
}

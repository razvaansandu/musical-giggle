import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req) {
  const token = cookies().get("spotify_token")?.value || process.env.SPOTIFY_TOKEN;

  const { playlist_id, uris } = await req.json();

  const r = await fetch(`${process.env.SPOTIFY_API_URL}/playlists/${playlist_id}/tracks`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ uris }),
  });

  return NextResponse.json(await r.json(), { status: r.status });
}

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(_req) {
  const token = cookies().get("spotify_token")?.value || process.env.SPOTIFY_TOKEN;

  const r = await fetch(`${process.env.SPOTIFY_API_URL}/me/playlists`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  return NextResponse.json(await r.json(), { status: r.status });
}

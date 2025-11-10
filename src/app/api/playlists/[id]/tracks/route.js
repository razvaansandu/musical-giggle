import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req, { params }) {
  const url = new URL(req.url);
  const limit = url.searchParams.get("limit") || 20;
  const offset = url.searchParams.get("offset") || 0;

  const token = cookies().get("spotify_token")?.value || process.env.SPOTIFY_TOKEN;

  const r = await fetch(
    `${process.env.SPOTIFY_API_URL}/playlists/${params.id}/tracks?limit=${limit}&offset=${offset}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  );

  return NextResponse.json(await r.json(), { status: r.status });
}

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req, { params }) {
  const url = new URL(req.url);
  const market = url.searchParams.get("market") || "US";

  const token = cookies().get("spotify_token")?.value || process.env.SPOTIFY_TOKEN;

  const r = await fetch(
    `${process.env.SPOTIFY_API_URL}/artists/${params.id}/top-tracks?market=${market}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  );

  return NextResponse.json(await r.json(), { status: r.status });
}

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req) {
  const url = new URL(req.url);
  const ids = url.searchParams.get("ids");

  const token = cookies().get("spotify_token")?.value || process.env.SPOTIFY_TOKEN;

  const r = await fetch(
    `${process.env.SPOTIFY_API_URL}/artists?ids=${ids}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  );

  return NextResponse.json(await r.json(), { status: r.status });
}

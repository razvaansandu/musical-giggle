import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get("ids");

  const cookieStore = cookies();
  const cookieToken = cookieStore.get("spotify_token")?.value;
  const envToken = process.env.SPOTIFY_TOKEN;

  const token = cookieToken || envToken;

  if (!token) {
    return NextResponse.json(
      { error: "Missing token" },
      { status: 500 }
    );
  }

  const r = await fetch(
    `https://api.spotify.com/v1/me/albums/contains?ids=${ids}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  );

  const data = await r.json();

  return NextResponse.json(data, { status: r.status });
}

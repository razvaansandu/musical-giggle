import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request, { params }) {
  const { id } = params;
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit") || 20;
  const offset = searchParams.get("offset") || 0;

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
    `https://api.spotify.com/v1/albums/${id}/tracks?limit=${limit}&offset=${offset}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  );

  if (!r.ok) {
    return NextResponse.json(
      { error: "Failed", status: r.status },
      { status: r.status }
    );
  }

  const data = await r.json();
  return NextResponse.json(data);
}

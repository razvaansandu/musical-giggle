import { NextResponse } from "next/server";
import { cookies } from "next/headers";

function getToken() {
  const cookieToken = cookies().get("spotify_token")?.value;
  return cookieToken || process.env.SPOTIFY_TOKEN;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const limit = searchParams.get("limit") || 20;

  if (!q) {
    return NextResponse.json(
      { error: "Missing q" },
      { status: 400 }
    );
  }

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

  const r = await fetch(
    `${baseUrl}/search?type=artist&q=${encodeURIComponent(q)}&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  );

  const data = await r.json();
  return NextResponse.json(data, { status: r.status });
}

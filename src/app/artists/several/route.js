import { NextResponse } from "next/server";
import { cookies } from "next/headers";

function getToken() {
  const cookieToken = cookies().get("spotify_token")?.value;
  return cookieToken || process.env.SPOTIFY_TOKEN;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get("ids");

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
    `${baseUrl}/artists?ids=${ids}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  );

  const data = await r.json();
  return NextResponse.json(data, { status: r.status });
}

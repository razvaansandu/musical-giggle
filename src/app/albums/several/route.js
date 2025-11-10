import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get("ids");

  const cookieStore = cookies();
  const cookieToken = cookieStore.get("spotify_token")?.value;
  const envToken = process.env.SPOTIFY_TOKEN;
  const baseUrl = process.env.SPOTIFY_API_URL;

  const token = cookieToken || envToken;

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
    `${baseUrl}/albums?ids=${ids}`,
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

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request, { params }) {
  const { id } = params;

  try {
    const cookieStore = cookies();
    const cookieToken = cookieStore.get("spotify_token")?.value;
    const envToken = process.env.SPOTIFY_TOKEN;
    const baseUrl = process.env.SPOTIFY_API_URL;

    const token = cookieToken || envToken;

    if (!token) {
      return NextResponse.json(
        { error: "Missing Spotify token" },
        { status: 500 }
      );
    }

    if (!baseUrl) {
      return NextResponse.json(
        { error: "Missing SPOTIFY_API_URL env variable" },
        { status: 500 }
      );
    }

    const res = await fetch(`${baseUrl}/albums/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch album", status: res.status },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

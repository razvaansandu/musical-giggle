import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const base = "https://api.spotify.com/v1/me/albums";

function getToken() {
  const cookieStore = cookies();
  const cookieToken = cookieStore.get("spotify_token")?.value;
  const envToken = process.env.SPOTIFY_TOKEN;
  return cookieToken || envToken;
}

export async function GET() {
  const token = getToken();

  if (!token) {
    return NextResponse.json(
      { error: "Missing token" },
      { status: 500 }
    );
  }

  const r = await fetch(base, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const data = await r.json();
  return NextResponse.json(data, { status: r.status });
}

export async function PUT(request) {
  const { ids } = await request.json();
  const token = getToken();

  if (!token) {
    return NextResponse.json(
      { error: "Missing token" },
      { status: 500 }
    );
  }

  const r = await fetch(`${base}?ids=${ids}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });

  return NextResponse.json({}, { status: r.status });
}

export async function DELETE(request) {
  const { ids } = await request.json();
  const token = getToken();

  if (!token) {
    return NextResponse.json(
      { error: "Missing token" },
      { status: 500 }
    );
  }

  const r = await fetch(`${base}?ids=${ids}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  return NextResponse.json({}, { status: r.status });
}

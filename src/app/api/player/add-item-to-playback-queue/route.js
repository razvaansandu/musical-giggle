import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_code")?.value;

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 });
  }

  const { uri } = await request.json();

  const res = await fetch(
    `${process.env.SPOTIFY_API_URL}/me/player/queue?uri=${encodeURIComponent(uri)}`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return NextResponse.json({ status: res.status });
}
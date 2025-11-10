import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_code")?.value;

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 });
  }

  const res = await fetch(`${process.env.SPOTIFY_API_URL}/v1/me/player/next`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  return NextResponse.json({ status: res.status });
}
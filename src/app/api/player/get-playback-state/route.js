import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_code")?.value;

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 });
  }

  const res = await fetch("https://api.spotify.com/v1/me/player", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return NextResponse.json(await res.json());
}
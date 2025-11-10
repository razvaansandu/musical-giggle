import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function PUT(request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("auth_code")?.value;
  const { type, ids } = await request.json(); // type: "artist" | "user"

  if (!accessToken || !type || !ids)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const res = await fetch(`https://api.spotify.com/v1/me/following?type=${type}&ids=${ids}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok)
    return NextResponse.json({ error: "Failed to follow" }, { status: res.status });

  return NextResponse.json({ message: "Follow successful" });
}

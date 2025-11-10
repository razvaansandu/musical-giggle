import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("auth_code")?.value;
  const { searchParams } = new URL(request.url);

  const type = searchParams.get("type");
  const ids = searchParams.get("ids");

  if (!accessToken || !type || !ids)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const res = await fetch(`https://api.spotify.com/v1/me/following/contains?type=${type}&ids=${ids}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok)
    return NextResponse.json({ error: "Failed to check follows" }, { status: res.status });

  const data = await res.json();
  return NextResponse.json(data);
}

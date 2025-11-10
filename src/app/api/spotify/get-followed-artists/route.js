import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("auth_code")?.value;

  if (!accessToken) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit") || "20";
  const after = searchParams.get("after");

  const url = new URL("https://api.spotify.com/v1/me/following");
  url.searchParams.set("type", "artist");
  url.searchParams.set("limit", limit);
  if (after) url.searchParams.set("after", after);

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok)
    return NextResponse.json({ error: "Failed to fetch followed artists" }, { status: res.status });

  const data = await res.json();
  return NextResponse.json(data);
}

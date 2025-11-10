import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("auth_code")?.value;

  if (!accessToken) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("id"); 

  const url = userId
    ? `https://api.spotify.com/v1/users/${userId}`
    : `https://api.spotify.com/v1/me`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok)
    return NextResponse.json({ error: "Failed to fetch user profile" }, { status: res.status });

  const data = await res.json();
  return NextResponse.json(data);
}

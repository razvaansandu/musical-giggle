import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BASE_URL = process.env.SPOTIFY_API_URL || "https://api.spotify.com/v1";

export async function getUserAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get("auth_code")?.value || null;
}

export async function requireUserAccessToken() {
  const token = await getUserAccessToken();

  if (!token) {
    return {
      token: null,
      response: NextResponse.json({ error: "Not authenticated" }, { status: 401 }),
    };
  }

  return { token, response: null };
}

export async function spotifyFetch(path, options = {}) {
  const { token, response } = await requireUserAccessToken();
  if (!token) return response;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
    },
    cache: "no-store",
  });

  if (res.status === 204) {
    return new Response(null, { status: 204 });
  } 
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  return NextResponse.json(data ?? {}, { status: res.status });
} 
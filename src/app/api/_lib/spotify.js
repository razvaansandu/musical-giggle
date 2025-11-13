import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BASE_URL = process.env.SPOTIFY_API_URL || "https://api.spotify.com/v1";

// Legge il token utente dal cookie "auth_code"
export async function getUserAccessToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_code")?.value || null;
  return token;
}

// Se non c'è token, ritorna già una risposta 401
export async function requireUserAccessToken() {
  const token = await getUserAccessToken();
  if (!token) {
    return {
      token: null,
      response: NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      ),
    };
  }
  return { token, response: null };
}

// Wrapper generico per chiamare Spotify con token utente
export async function spotifyFetch(path, options = {}) {
  const { token, response } = await requireUserAccessToken();
  if (!token) return response; // 401

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
    },
    cache: "no-store",
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  return NextResponse.json(data ?? {}, { status: res.status });
}

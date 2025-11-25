import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_code")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const recentlyPlayed = await fetch(
      "https://api.spotify.com/v1/me/player/recently-played?limit=6",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ).then((r) => r.json());

    const topArtists = await fetch(
      "https://api.spotify.com/v1/me/top/artists?limit=2",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    ).then((r) => r.json());

    return NextResponse.json({
      recentlyPlayed: recentlyPlayed.items || [],
      dailyMix: topArtists.items || [],
    });
  } catch (err) {
    console.error("Errore API Home:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

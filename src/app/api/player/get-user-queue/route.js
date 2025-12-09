import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_code")?.value;

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const res = await fetch("https://api.spotify.com/v1/me/player/queue", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    console.log("Spotify queue response status:", res.status);

    if (res.status === 204) {
      return NextResponse.json({ queue: [], currently_playing: null });
    }

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Spotify queue error:", errorText);
      return NextResponse.json({ error: errorText }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Queue fetch error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

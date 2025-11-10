import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req) {
  const token = cookies().get("spotify_token")?.value || process.env.SPOTIFY_TOKEN;

  const { user_id, name, description, public: isPublic } = await req.json();

  const r = await fetch(`${process.env.SPOTIFY_API_URL}/users/${user_id}/playlists`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      description,
      public: isPublic,
    }),
  });

  return NextResponse.json(await r.json(), { status: r.status });
}

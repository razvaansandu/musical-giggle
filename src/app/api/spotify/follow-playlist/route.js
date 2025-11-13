import { spotifyFetch } from "../../_lib/spotify";
import { NextResponse } from "next/server";

export async function PUT(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const playlist_id = body?.playlist_id;

  if (!playlist_id) {
    return NextResponse.json(
      { error: "Missing playlist_id" },
      { status: 400 }
    );
  }

  return spotifyFetch(`/playlists/${playlist_id}/followers`, {
    method: "PUT",
    body: JSON.stringify({ public: true }),
  });
}

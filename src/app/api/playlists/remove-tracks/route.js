import { spotifyFetch, requireUserAccessToken } from "../../_lib/spotify";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { token, response } = await requireUserAccessToken();
  if (!token) return response;

  let body;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const { playlist_id, uris } = body || {};

  if (!playlist_id || !uris?.length) {
    return NextResponse.json(
      { error: "Missing playlist_id or uris" },
      { status: 400 }
    );
  }

  return spotifyFetch(`/playlists/${playlist_id}/tracks`, {
    method: "DELETE",
    body: JSON.stringify({ tracks: uris.map((u) => ({ uri: u })) }),
  });
}

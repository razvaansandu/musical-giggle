import { spotifyFetch } from "../../_lib/spotify";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const playlist_id = searchParams.get("playlist_id");
  const ids = searchParams.get("ids"); 

  if (!playlist_id || !ids) {
    return NextResponse.json(
      { error: "Missing playlist_id or ids" },
      { status: 400 }
    );
  }

  return spotifyFetch(
    `/playlists/${playlist_id}/followers/contains?ids=${encodeURIComponent(ids)}`
  );
}

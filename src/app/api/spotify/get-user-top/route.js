import { spotifyFetch } from "../../_lib/spotify";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "tracks"; 
  const timeRange = searchParams.get("time_range") || "medium_term";
  const limit = searchParams.get("limit") || "20";
  const offset = searchParams.get("offset") || "0";

  if (type !== "tracks" && type !== "artists") {
    return NextResponse.json(
      { error: 'Invalid type, expected "tracks" or "artists"' },
      { status: 400 }
    );
  }

  const query = new URLSearchParams({
    time_range: timeRange,
    limit,
    offset,
  }).toString();

  return spotifyFetch(`/me/top/${type}?${query}`);
}

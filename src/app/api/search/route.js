import { spotifyFetch } from "../_lib/spotify";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const type = searchParams.get("type") || "track,artist,album,playlist";
  const limit = searchParams.get("limit") || "20";

  if (!q) {
    return NextResponse.json(
      { error: "Missing q parameter" },
      { status: 400 }
    );
  }

  const query = new URLSearchParams({ q, type, limit }).toString();
  return spotifyFetch(`/search?${query}`);
}

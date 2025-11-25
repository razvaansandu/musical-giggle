import { spotifyFetch } from "../../_lib/spotify";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type"); // "artist" o "user"
  const ids = searchParams.get("ids");

  if (!type || !ids) {
    return NextResponse.json(
      { error: "Missing type or ids parameter" },
      { status: 400 }
    );
  }

  return spotifyFetch(`/me/following/contains?type=${type}&ids=${encodeURIComponent(ids)}`);
}

import { spotifyFetch } from "../../_lib/spotify";
import { NextResponse } from "next/server";

export async function PUT(request) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get("state"); // 'true' or 'false'

  if (!state) {
    return NextResponse.json({ error: "Missing state parameter" }, { status: 400 });
  }

  return spotifyFetch(`/me/player/shuffle?state=${state}`, {
    method: "PUT",
  });
}

import { spotifyFetch } from "../../_lib/spotify";
import { NextResponse } from "next/server";

export async function PUT(request) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get("state"); 
  const device_id = searchParams.get("device_id");

  if (!state) {
    return NextResponse.json(
      { error: "Missing state parameter" },
      { status: 400 }
    );
  }

  const qs = new URLSearchParams({ state });
  if (device_id) qs.set("device_id", device_id);

  return spotifyFetch(`/me/player/repeat?${qs.toString()}`, {
    method: "PUT",
  });
}

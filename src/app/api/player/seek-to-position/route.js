import { spotifyFetch } from "../../_lib/spotify";
import { NextResponse } from "next/server";

export async function PUT(request) {
  const { searchParams } = new URL(request.url);
  const position_ms = searchParams.get("position_ms");
  const device_id = searchParams.get("device_id");

  if (!position_ms) {
    return NextResponse.json(
      { error: "Missing position_ms parameter" },
      { status: 400 }
    );
  }

  const qs = new URLSearchParams({ position_ms });
  if (device_id) qs.set("device_id", device_id);

  return spotifyFetch(`/me/player/seek?${qs.toString()}`, {
    method: "PUT",
  });
}

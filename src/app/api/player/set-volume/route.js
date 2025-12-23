import { spotifyFetch } from "../../_lib/spotify";
import { NextResponse } from "next/server";

export async function PUT(request) {
  const { searchParams } = new URL(request.url);
  const volume_percent = searchParams.get("volume_percent");
  const device_id = searchParams.get("device_id");

  if (volume_percent === null) {
    return NextResponse.json(
      { error: "Missing volume_percent parameter" },
      { status: 400 }
    );
  }

  const qs = new URLSearchParams({ volume_percent });
  if (device_id) qs.set("device_id", device_id);

  return spotifyFetch(`/me/player/volume?${qs.toString()}`, {
    method: "PUT",
  });
}

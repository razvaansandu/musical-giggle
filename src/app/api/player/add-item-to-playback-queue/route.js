import { spotifyFetch } from "../../_lib/spotify";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const uri = searchParams.get("uri");
  const device_id = searchParams.get("device_id");

  if (!uri) {
    return NextResponse.json(
      { error: "Missing uri parameter" },
      { status: 400 }
    );
  }

  const qs = new URLSearchParams({ uri });
  if (device_id) qs.set("device_id", device_id);

  return spotifyFetch(`/me/player/queue?${qs.toString()}`, {
    method: "POST",
  });
}

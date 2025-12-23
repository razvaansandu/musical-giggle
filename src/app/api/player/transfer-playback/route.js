import { spotifyFetch } from "../../_lib/spotify";
import { NextResponse } from "next/server";

export async function PUT(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const { device_ids, play } = body || {};

  if (!device_ids || !device_ids.length) {
    return NextResponse.json(
      { error: "Missing device_ids in body" },
      { status: 400 }
    );
  }

  return spotifyFetch("/me/player", {
    method: "PUT",
    body: JSON.stringify({
      device_ids,
      play: play ?? true,
    }),
  });
}

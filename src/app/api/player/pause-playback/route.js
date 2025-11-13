import { spotifyFetch } from "../../_lib/spotify";

export async function PUT(request) {
  const { searchParams } = new URL(request.url);
  const device_id = searchParams.get("device_id");

  const qs = new URLSearchParams();
  if (device_id) qs.set("device_id", device_id);

  const path = qs.toString()
    ? `/me/player/pause?${qs.toString()}`
    : "/me/player/pause";

  return spotifyFetch(path, { method: "PUT" });
}

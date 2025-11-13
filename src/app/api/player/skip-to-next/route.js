import { spotifyFetch } from "../../_lib/spotify";

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const device_id = searchParams.get("device_id");

  const qs = new URLSearchParams();
  if (device_id) qs.set("device_id", device_id);

  const path = qs.toString()
    ? `/me/player/next?${qs.toString()}`
    : "/me/player/next";

  return spotifyFetch(path, { method: "POST" });
}

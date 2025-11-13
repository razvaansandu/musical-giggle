import { spotifyFetch } from "../../_lib/spotify";

export async function PUT(request) {
  let body = null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const { searchParams } = new URL(request.url);
  const device_id = searchParams.get("device_id");

  const qs = new URLSearchParams();
  if (device_id) qs.set("device_id", device_id);

  const path = qs.toString()
    ? `/me/player/play?${qs.toString()}`
    : "/me/player/play";

  return spotifyFetch(path, {
    method: "PUT",
    body: body ? JSON.stringify(body) : undefined,
  });
}

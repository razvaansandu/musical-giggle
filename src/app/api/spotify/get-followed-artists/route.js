import { spotifyFetch } from "../../_lib/spotify";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit") || "20";
  return spotifyFetch(`/me/following?type=artist&limit=${limit}`);
}

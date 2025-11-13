import { spotifyFetch } from "../../_lib/spotify";

export async function GET(_req, { params }) {
  const { id } = await params;
  return spotifyFetch(`/tracks/${id}`);
}

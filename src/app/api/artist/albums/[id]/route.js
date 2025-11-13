import { spotifyFetch } from "../../../_lib/spotify";

export async function GET(request, { params }) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit") || "20";
  const offset = searchParams.get("offset") || "0";

  const query = new URLSearchParams({ limit, offset }).toString();
  return spotifyFetch(`/artists/${id}/albums?${query}`);
}

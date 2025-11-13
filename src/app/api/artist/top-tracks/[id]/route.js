import { spotifyFetch } from "../../../_lib/spotify";

export async function GET(request, { params }) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const market = searchParams.get("market") || "IT";

  return spotifyFetch(`/artists/${id}/top-tracks?market=${market}`);
}

import { spotifyFetch } from "../../_lib/spotify";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("id");

  if (userId) {
    return spotifyFetch(`/users/${userId}`);
  }

  return spotifyFetch("/me");
}
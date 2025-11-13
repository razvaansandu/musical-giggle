import { spotifyFetch } from "../../_lib/spotify";

export async function GET() {
  return spotifyFetch("/me/player/currently-playing");
}

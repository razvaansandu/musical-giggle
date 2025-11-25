import { spotifyFetch, requireUserAccessToken } from "../../_lib/spotify";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { token, response } = await requireUserAccessToken();
  if (!token) return response;

  const { searchParams } = new URL(request.url);
  const ids = searchParams.get("ids");

  if (!ids) {
    return NextResponse.json(
      { error: "Missing ids parameter" },
      { status: 400 }
    );
  }

  return spotifyFetch(`/me/albums/contains?ids=${encodeURIComponent(ids)}`);
}

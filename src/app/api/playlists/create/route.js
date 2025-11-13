import { spotifyFetch, requireUserAccessToken } from "../../_lib/spotify";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { token, response } = await requireUserAccessToken();
  if (!token) return response;

  let body;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const { user_id, name, description, public: isPublic } = body || {};

  if (!user_id || !name) {
    return NextResponse.json(
      { error: "Missing user_id or name" },
      { status: 400 }
    );
  }

  return spotifyFetch(`/users/${user_id}/playlists`, {
    method: "POST",
    body: JSON.stringify({
      name,
      description: description || "",
      public: isPublic ?? true,
    }),
  });
}

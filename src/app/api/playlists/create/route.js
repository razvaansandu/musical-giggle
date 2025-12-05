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

  const { user_id: bodyUserId, name, description, public: isPublic } = body || {};

  if (!name) {
    return NextResponse.json(
      { error: "Missing name" },
      { status: 400 }
    );
  }

  let user_id = bodyUserId;

  // Se manca user_id, lo recuperiamo da /me
  if (!user_id) {
    try {
      const meRes = await fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (meRes.ok) {
        const meData = await meRes.json();
        user_id = meData.id;
      }
    } catch (e) {
      console.error("Error fetching user me:", e);
    }
  }

  if (!user_id) {
    return NextResponse.json(
      { error: "Missing user_id" },
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

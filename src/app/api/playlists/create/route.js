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

  const { user_id: bodyUserId, name, description, public: isPublic, image } = body || {};

  if (!name) {
    return NextResponse.json(
      { error: "Missing name" },
      { status: 400 }
    );
  }

  let user_id = bodyUserId;

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

  const createRes = await fetch(`https://api.spotify.com/v1/users/${user_id}/playlists`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      description: description || "",
      public: isPublic ?? true,
    }),
  });

  const playlistData = await createRes.json();

  if (!createRes.ok) {
    return NextResponse.json(playlistData, { status: createRes.status });
  }

  if (image && playlistData.id) {
    try {
      const base64Image = image.replace(/^data:image\/\w+;base64,/, "");
      
      const imageRes = await fetch(`https://api.spotify.com/v1/playlists/${playlistData.id}/images`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "image/jpeg"
        },
        body: base64Image
      });

      if (!imageRes.ok) {
        console.error("Failed to upload playlist image", await imageRes.text());
      }
    } catch (e) {
      console.error("Error uploading playlist image:", e);
    }
  }

  return NextResponse.json(playlistData);
}

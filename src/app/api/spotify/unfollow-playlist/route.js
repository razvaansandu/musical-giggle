import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE(request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("auth_code")?.value;
  const { playlistId } = await request.json();

  if (!accessToken || !playlistId) {
    return NextResponse.json({ error: "Missing token or playlistId" }, { status: 400 });
  }

  const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/followers`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok)
    return NextResponse.json({ error: "Failed to unfollow playlist" }, { status: res.status });

  return NextResponse.json({ message: "Playlist unfollowed successfully" });
}

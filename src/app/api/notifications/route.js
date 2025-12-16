import { spotifyFetch } from "../_lib/spotify";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. New Releases (Albums)
    const newReleasesRes = await spotifyFetch("/browse/new-releases?limit=3");
    const newReleases = await newReleasesRes.json();
    const albums = newReleases.albums?.items || []; 

    // 2. Featured Playlists
    const featurdPlaylistsRes = await spotifyFetch("/browse/featured-playlists?limit=3");
    const featuredPlaylists = await featuredPlaylistsRes.json();
    const playlists = featuredPlaylists.playlists?.items || [];

    // 3. New Songs (Tracks from the first new album)
    let tracks = [];
    if (albums.length > 0) {
      const albumId = albums[0].id;
      const tracksRes = await spotifyFetch(`/albums/${albumId}/tracks?limit=3`);
      const tracksData = await tracksRes.json(); 
      tracks = tracksData.items || [];
      
      // Add album info to tracks since the track object from album endpoint doesn't have it
      tracks = tracks.map(t => ({ ...t, album: albums[0] }));
    }

    return NextResponse.json({
      albums,
      playlists,
      tracks
    });
  } catch (error) {
    console.error("Notifications API Error:", error);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}

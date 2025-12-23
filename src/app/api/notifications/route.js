import { spotifyFetch } from "../_lib/spotify";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const newReleasesRes = await spotifyFetch("/browse/new-releases?limit=3");
    const newReleases = await newReleasesRes.json();
    const albums = newReleases.albums?.items || []; 

    const featurdPlaylistsRes = await spotifyFetch("/browse/featured-playlists?limit=3");
    const featuredPlaylists = await featuredPlaylistsRes.json();
    const playlists = featuredPlaylists.playlists?.items || [];

    let tracks = [];
    if (albums.length > 0) {
      const albumId = albums[0].id;
      const tracksRes = await spotifyFetch(`/albums/${albumId}/tracks?limit=3`);
      const tracksData = await tracksRes.json(); 
      tracks = tracksData.items || [];
      
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

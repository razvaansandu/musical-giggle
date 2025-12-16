import { NextResponse } from "next/server";

export async function GET(request) { 
  const { searchParams } = new URL(request.url);
  const artist = searchParams.get("artist"); 
  const track = searchParams.get("track");

  if (!artist || !track) {
    return NextResponse.json({ error: "Missing artist or track" }, { status: 400 });
  } 

  try {   
    const res = await fetch(`https://lrclib.net/api/get?artist_name=${encodeURIComponent(artist)}&track_name=${encodeURIComponent(track)}`);
    
    if (!res.ok) {
        const resBackup = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(track)}`);
        if (resBackup.ok) {
            const dataBackup = await resBackup.json();
            return NextResponse.json({ lyrics: dataBackup.lyrics, synced: false });
        }
        return NextResponse.json({ lyrics: "Testo non trovato.", synced: false }, { status: 404 });
    }

    const data = await res.json();
    if (data.syncedLyrics) {
        return NextResponse.json({ lyrics: data.syncedLyrics, synced: true });
    } else if (data.plainLyrics) {
        return NextResponse.json({ lyrics: data.plainLyrics, synced: false });
    } else {
        return NextResponse.json({ lyrics: "Testo non disponibile.", synced: false });
    }

  } catch (error) {
    console.error("Lyrics API Error:", error);
    return NextResponse.json({ error: "Failed to fetch lyrics" }, { status: 500 });
  } 
} 

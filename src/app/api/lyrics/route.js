import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const artist = searchParams.get("artist");
  const track = searchParams.get("track");

  if (!artist || !track) {
    return NextResponse.json({ error: "Missing artist or track" }, { status: 400 });
  }

  try {   
    const res = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(track)}`);
    
    if (!res.ok) {
      return NextResponse.json({ lyrics: "Testo non trovato." }, { status: 404 });
    }

    const data = await res.json();
    return NextResponse.json({ lyrics: data.lyrics || "Testo non disponibile." });
  } catch (error) {
    console.error("Lyrics API Error:", error);
    return NextResponse.json({ error: "Failed to fetch lyrics" }, { status: 500 });
  } 
} 

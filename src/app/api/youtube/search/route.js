import { NextResponse } from "next/server";

const INVIDIOUS_INSTANCES = [
  "https://yewtu.be",
  "https://vid.puffyan.us",
  "https://invidious.flokinet.to",
  "https://invidious.projectsegfau.lt",
  "https://invidious.protokolla.fi",
  "https://invidious.io.lol",
  "https://invidious.fdn.fr",
  "https://inv.tux.pizza",
  "https://invidious.perennialte.ch",
  "https://invidious.jing.rocks"
];

const PIPED_INSTANCES = [
  "https://pipedapi.kavin.rocks",
  "https://api.piped.ot.ax",
  "https://pipedapi.smnz.de",
  "https://api.piped.privacy.com.de"
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }
  for (const instance of INVIDIOUS_INSTANCES) {
    try {
      const res = await fetch(`${instance}/api/v1/search?q=${encodeURIComponent(query)}&type=video&sort_by=relevance`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        signal: AbortSignal.timeout(3500) 
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          return NextResponse.json({ videoId: data[0].videoId });
        }
      }
    } catch (err) {
      continue;
    }
  }
  for (const instance of PIPED_INSTANCES) {
    try {
      const res = await fetch(`${instance}/search?q=${encodeURIComponent(query)}&filter=music_videos`, {
         signal: AbortSignal.timeout(4000)
      });

      if (res.ok) {
        const data = await res.json();
        if (data.items && data.items.length > 0) {
            const videoUrl = data.items[0].url;
            const videoId = videoUrl.split("v=")[1];
            if (videoId) {
                return NextResponse.json({ videoId });
            }
        }
      }
    } catch (err) {
      continue;
    }
  }
  try {
    const res = await fetch(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      signal: AbortSignal.timeout(5000)
    });
    
    if (res.ok) {
      const html = await res.text();
      // Regex to find the first videoId in the initial data
      const match = html.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
      if (match && match[1]) {
        return NextResponse.json({ videoId: match[1] });
      }
    }
  } catch (e) { 
    console.warn("Direct scrape failed:", e.message);
  } 
  return NextResponse.json({ error: "Video not found", fallback: true }, { status: 404 });
}

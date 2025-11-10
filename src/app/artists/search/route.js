import { NextResponse } from "next/server";
import { cookies } from "next/headers";


function getToken() {
const cookieToken = cookies().get("spotify_token")?.value;
return cookieToken || process.env.SPOTIFY_TOKEN;
}


export async function GET(request) {
const { searchParams } = new URL(request.url);
const q = searchParams.get("q");
const limit = searchParams.get("limit") || 20;


if (!q) return NextResponse.json({ error: "Missing q" }, { status: 400 });


const token = getToken();
if (!token) return NextResponse.json({ error: "Missing token" }, { status: 500 });


const r = await fetch(`https://api.spotify.com/v1/search?type=artist&q=${encodeURIComponent(q)}&limit=${limit}`, {
headers: { Authorization: `Bearer ${token}` },
cache: "no-store",
});


return NextResponse.json(await r.json(), { status: r.status });
}
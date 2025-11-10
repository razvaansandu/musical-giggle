import { NextResponse } from "next/server";
import { cookies } from "next/headers";


function getToken() {
const cookieToken = cookies().get("spotify_token")?.value;
return cookieToken || process.env.SPOTIFY_TOKEN;
}


export async function GET(request) {
const { searchParams } = new URL(request.url);
const ids = searchParams.get("ids");


const token = getToken();
if (!token) return NextResponse.json({ error: "Missing token" }, { status: 500 });


const r = await fetch(`https://api.spotify.com/v1/artists?ids=${ids}`, {
headers: { Authorization: `Bearer ${token}` },
cache: "no-store",
});


return NextResponse.json(await r.json(), { status: r.status });
}
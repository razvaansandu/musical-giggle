import { NextResponse } from "next/server";
import { cookies } from "next/headers";


function getToken() {
const cookieToken = cookies().get("spotify_token")?.value;
return cookieToken || process.env.SPOTIFY_TOKEN;
}


export async function GET(request, { params }) {
const { searchParams } = new URL(request.url);
const include = searchParams.get("include_groups") || "album,single";
const limit = searchParams.get("limit") || 20;
const offset = searchParams.get("offset") || 0;


const token = getToken();
if (!token) return NextResponse.json({ error: "Missing token" }, { status: 500 });


const r = await fetch(
`https://api.spotify.com/v1/artists/${params.id}/albums?include_groups=${include}&limit=${limit}&offset=${offset}`,
{
headers: { Authorization: `Bearer ${token}` },
cache: "no-store",
}
);


return NextResponse.json(await r.json(), { status: r.status });
}
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('spotify_access_token')?.value;
  
  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  
  const { searchParams } = new URL(request.url);
  const timeRange = searchParams.get('time_range') || 'medium_term';
  const limit = searchParams.get('limit') || '20';
  
  const res = await fetch(
    `https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}&limit=${limit}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  );
  
  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch top artists' }, { status: res.status });
  }
  
  const data = await res.json();
  return NextResponse.json(data);
}
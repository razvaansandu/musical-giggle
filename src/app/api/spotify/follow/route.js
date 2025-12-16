import { spotifyFetch } from "../../_lib/spotify";
import { NextResponse } from "next/server";

export async function PUT(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const type = body?.type; 
  const ids = body?.ids;

  if (!type || !ids?.length) {
    return NextResponse.json(
      { error: "Missing type or ids" },
      { status: 400 }
    );
  }

  const idsParam = Array.isArray(ids) ? ids.join(",") : ids;

  return spotifyFetch(`/me/following?type=${type}&ids=${encodeURIComponent(idsParam)}`, {
    method: "PUT",
  });
}

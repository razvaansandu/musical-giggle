import { spotifyFetch, requireUserAccessToken } from "../../_lib/spotify";
import { NextResponse } from "next/server";

const BASE = "/me/albums";

export async function GET(request) {
  const { token, response } = await requireUserAccessToken();
  if (!token) return response;

  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit") || "20";
  const offset = searchParams.get("offset") || "0";

  const query = new URLSearchParams({ limit, offset }).toString();
  return spotifyFetch(`${BASE}?${query}`);
}

export async function PUT(request) {
  const { token, response } = await requireUserAccessToken();
  if (!token) return response;

  let body;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const ids = body?.ids;
  if (!ids || !ids.length) {
    return NextResponse.json(
      { error: "Missing ids in body" },
      { status: 400 }
    );
  }

  const idsParam = Array.isArray(ids) ? ids.join(",") : ids;

  return spotifyFetch(`${BASE}?ids=${encodeURIComponent(idsParam)}`, {
    method: "PUT",
  });
}

export async function DELETE(request) {
  const { token, response } = await requireUserAccessToken();
  if (!token) return response;

  let body;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const ids = body?.ids;
  if (!ids || !ids.length) {
    return NextResponse.json(
      { error: "Missing ids in body" },
      { status: 400 }
    );
  }

  const idsParam = Array.isArray(ids) ? ids.join(",") : ids;

  return spotifyFetch(`${BASE}?ids=${encodeURIComponent(idsParam)}`, {
    method: "DELETE",
  });
}

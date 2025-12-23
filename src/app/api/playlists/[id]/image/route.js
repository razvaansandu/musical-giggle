import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_code")?.value;

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Missing playlist id" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { image } = body;

    if (!image) {
      return NextResponse.json({ error: "Missing image (base64)" }, { status: 400 });
    }

    let base64Image = image;
    if (image.includes(",")) {
      base64Image = image.split(",")[1];
    }

    const res = await fetch(`https://api.spotify.com/v1/playlists/${id}/images`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "image/jpeg",
      },
      body: base64Image,
    });

    if (res.status === 202 || res.status === 200) {
      return NextResponse.json({ success: true });
    }

    const errorText = await res.text();
    console.error("Spotify image upload error:", errorText);
    return NextResponse.json({ error: errorText }, { status: res.status });
  } catch (err) {
    console.error("Image upload error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

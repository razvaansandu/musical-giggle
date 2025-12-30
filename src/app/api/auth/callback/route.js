import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code) return NextResponse.redirect("/?error=no_code");

  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

  const authOptions = {
    form: {
      code: code,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    },
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
  };

  const response = await fetch(`${process.env.SPOTIFY_ACCOUNTS_URL}/api/token`, {
    method: "POST",
    headers: authOptions.headers,
    body: new URLSearchParams(authOptions.form),
  });

  const data = await response.json();

  if (data.access_token) {
    return redirect(`/api/auth/init?code=${data.access_token}`);
  } else {
    return NextResponse.redirect("/login?error=invalid_token");
  }
}

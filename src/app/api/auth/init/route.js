import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const response = NextResponse.redirect('http://localhost:3000');
  response.cookies.set("auth_code", code);
  return response;
}
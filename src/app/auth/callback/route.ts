import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/home";

  if (code) {
    return NextResponse.redirect(`${origin}/auth?code=${code}`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}

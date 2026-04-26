import { NextResponse } from "next/server";

export const runtime = 'nodejs';

export async function POST() {
  const res = NextResponse.json({ success: true });
  // Clear the cookie
  res.cookies.set("admin-auth", "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}

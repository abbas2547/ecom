import { NextRequest, NextResponse } from "next/server";

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body || {};

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error("Admin credentials not configured");
      return NextResponse.json({ error: "Admin credentials not configured" }, { status: 500 });
    }

    if (email === adminEmail && password === adminPassword) {
      const res = NextResponse.json({ success: true });
      res.cookies.set("admin-auth", "true", {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        secure: process.env.NODE_ENV === "production",
      });
      return res;
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  } catch (err) {
    console.error("Login error", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

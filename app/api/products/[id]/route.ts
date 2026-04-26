import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const runtime = "nodejs";

function isAdminRequest(req: NextRequest) {
  const cookie = req.cookies.get("admin-auth");
  const cookieVal = cookie && (typeof cookie === "string" ? cookie : (cookie as any).value);
  return cookieVal === "true";
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
  try {
    if (!isAdminRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const pathname = req.nextUrl.pathname;
    const parts = pathname.split("/").filter(Boolean);
    const id = parts[parts.length - 1];
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const body = await req.json();
    const { name, description, price, category, image } = body || {};

    const update: any = { updatedAt: new Date() };
    if (name) update.name = String(name).trim();
    if (description) update.description = String(description).trim();
    if (price !== undefined) update.price = Number(price);
    if (category) update.category = String(category).trim();
    if (image) update.image = String(image);

    const client = await connectToDatabase();
    const db = client.db("zyrox");

    const result = await db.collection("products").updateOne({ _id: new ObjectId(id) }, { $set: update });

    if (result.matchedCount === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PUT /api/products/[id] error", err);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  try {
    if (!isAdminRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const pathname = req.nextUrl.pathname;
    const parts = pathname.split("/").filter(Boolean);
    const id = parts[parts.length - 1];
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const client = await connectToDatabase();
    const db = client.db("zyrox");

    const result = await db.collection("products").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/products/[id] error", err);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}

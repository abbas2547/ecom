import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export const runtime = "nodejs";

function isAdminRequest(req: NextRequest) {
  const cookie = req.cookies.get("admin-auth");
  const cookieVal = cookie && (typeof cookie === "string" ? cookie : (cookie as any).value);
  return cookieVal === "true";
}

export async function GET() {
  try {
    const client = await connectToDatabase();
    const db = client.db("zyrox");
    const products = await db
      .collection("products")
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    const sanitized = products.map((p: any) => ({
      ...p,
      _id: p._id.toString(),
      createdAt: p.createdAt ? p.createdAt.toISOString() : null,
      updatedAt: p.updatedAt ? p.updatedAt.toISOString() : null,
    }));

    return NextResponse.json({ products: sanitized });
  } catch (err) {
    console.error("GET /api/products error", err);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!isAdminRequest(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, price, category, image } = body || {};

    if (!name || !description || !price || !category || !image) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const client = await connectToDatabase();
    const db = client.db("zyrox");

    const product = {
      name: String(name).trim(),
      description: String(description).trim(),
      price: Number(price),
      category: String(category).trim(),
      image: String(image),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("products").insertOne(product);

    return NextResponse.json({ success: true, id: result.insertedId.toString() });
  } catch (err) {
    console.error("POST /api/products error", err);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

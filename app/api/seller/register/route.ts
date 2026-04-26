import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || !session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { storeName } = await request.json();

    if (!storeName || storeName.trim() === "") {
      return NextResponse.json({ error: "Store name is required" }, { status: 400 });
    }

    const client = await connectToDatabase();
    const db = client.db("zyrox");

    // Check if a pending request already exists for this user
    const existingRequest = await db.collection("sellerRequests").findOne({
      userEmail: session.user.email,
      status: "pending",
    });

    if (existingRequest) {
      return NextResponse.json({
        error: "A pending seller request already exists for this user.",
      }, { status: 409 });
    }

    // Create a new seller request
    const newRequest = {
      userId: session.user.id,
      userEmail: session.user.email,
      storeName: storeName.trim(),
      status: "pending",
      createdAt: new Date(),
    };

    const result = await db.collection("sellerRequests").insertOne(newRequest);

    return NextResponse.json({
      success: true,
      message: "Seller request submitted for approval. Please wait for an admin to approve your request.",
      requestId: result.insertedId,
    });
  } catch (error) {
    console.error("Error submitting seller request:", error);
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
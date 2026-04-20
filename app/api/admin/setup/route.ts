import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    console.log("Setup API called");

    const session = await getServerSession(authOptions);
    console.log("Session:", session ? "exists" : "null");

    if (!session?.user?.email) {
      console.log("No session or email");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    console.log("User email:", session.user.email);

    const client = await clientPromise;
    console.log("MongoDB client connected");

    const db = client.db("zyrox");
    console.log("Got database");

    // Update the current user to be an admin
    const result = await db.collection("users").updateOne(
      { email: session.user.email },
      {
        $set: {
          role: "admin",
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    console.log("Update result:", result);

    return NextResponse.json({
      success: true,
      message: "You are now an admin!",
      user: session.user.email
    });
  } catch (error) {
    console.error("Error setting up admin:", error);
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

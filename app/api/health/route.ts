import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export const runtime = 'nodejs';

export async function GET() {
  try {
    // Test MongoDB connection
    const client = await connectToDatabase();
    const db = client.db("zyrox");

    // Simple ping to check if database is accessible
    await db.admin().ping();

    // Test write operation
    const testCollection = db.collection("test");
    await testCollection.insertOne({ test: true, timestamp: new Date() });
    await testCollection.deleteOne({ test: true });

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        database: "connected and writable"
      }
    });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      services: {
        database: "disconnected"
      },
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

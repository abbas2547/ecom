import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { AdminRequest } from "@/lib/types";
import { ObjectId } from "mongodb";

export const runtime = 'nodejs';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const client = await connectToDatabase();
    const db = client.db("zyrox");
    
    // Verify admin status
    const adminUser = await db.collection("users").findOne({ email: session.user.email });
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const pendingRequests = await db.collection("adminRequests")
      .find({ status: "pending" })
      .sort({ createdAt: -1 })
      .toArray();

    const formattedRequests: AdminRequest[] = pendingRequests.map(request => ({
      _id: request._id.toString(),
      userId: request.userId,
      userEmail: request.userEmail,
      status: request.status,
      createdAt: request.createdAt,
    }));

    return NextResponse.json(formattedRequests);
  } catch (error) {
    console.error("Error fetching admin requests:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const client = await connectToDatabase();
    const db = client.db("zyrox");
    
    // Verify admin status of the approver
    const adminUser = await db.collection("users").findOne({ email: session.user.email });
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { requestId, userId, userEmail, status } = await request.json();

    if (!requestId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!['approved', 'denied'].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    let objectId;
    try {
      objectId = new ObjectId(requestId);
    } catch {
      return NextResponse.json({ error: "Invalid request ID" }, { status: 400 });
    }

    // Update the admin request status
    const approvedById = (session.user as any)?.id || session.user?.email || null;
    const updateRequestResult = await db.collection("adminRequests").updateOne(
      { _id: objectId },
      { $set: { status, approvedBy: approvedById, approvedAt: new Date() } }
    );

    if (updateRequestResult.matchedCount === 0) {
      return NextResponse.json({ error: "Admin request not found" }, { status: 404 });
    }

    // If approved, update the user's role
    if (status === "approved" && userId && userEmail) {
      await db.collection("users").updateOne(
        { _id: new ObjectId(userId), email: userEmail },
        { $set: { role: "admin", updatedAt: new Date() } }
      );
    }

    return NextResponse.json({ success: true, message: `Admin request ${status} successfully` });
  } catch (error) {
    console.error("Error updating admin request:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
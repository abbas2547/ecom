import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { DashboardStats } from "@/lib/types";

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Verify admin status from database
    const client = await clientPromise;
    const db = client.db("zyrox");
    const user = await db.collection("users").findOne({ email: session.user.email });

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const totalUsers = await db.collection("users").countDocuments();
    const totalProducts = await db.collection("products").countDocuments();
    const totalOrders = await db.collection("orders").countDocuments();

    // Get total revenue
    const orders = await db.collection("orders").find({}).toArray();
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

    // Get recent users
    const recentUsers = await db.collection("users")
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    // Get recent orders
    const recentOrders = await db.collection("orders")
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    const stats: DashboardStats = {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      recentUsers: recentUsers.map(user => ({
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role || 'user',
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      })),
      recentOrders: recentOrders.map(order => ({
        _id: order._id.toString(),
        userId: order.userId,
        products: order.products,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      }))
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

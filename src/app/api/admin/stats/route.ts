import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET() {
  try {
    const [{ total }] = await db.select({ total: sql<number>`count(*)` }).from(users);
    const [{ pending }] = await db
      .select({ pending: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.status, "pending"));
    const [{ active }] = await db
      .select({ active: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.status, "active"));
    const [{ premium }] = await db
      .select({ premium: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.role, "premium"));

    return NextResponse.json({
      success: true,
      data: {
        totalProfiles: Number(total),
        pendingVerifications: Number(pending),
        activeProfiles: Number(active),
        premiumSubscriptions: Number(premium),
      },
    });
  } catch (error) {
    console.error("GET /api/admin/stats error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch stats" }, { status: 500 });
  }
}
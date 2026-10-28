// app/api/users/logout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { userSessions } from "@/db/schema";

export async function POST(req: NextRequest) {
  try {
    const sessionToken = req.cookies.get("session_id")?.value;

    if (sessionToken) {
      // ✅ DB se session delete karo (server-side invalidation)
      await db.delete(userSessions).where(eq(userSessions.session_token, sessionToken));
    }

    const res = NextResponse.json({ message: "Logged out successfully" });

    // ✅ Cookie clear karo
    res.cookies.set("session_id", "", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 0, // immediately expire
    });

    return res;
  } catch (err) {
    console.error("Logout error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
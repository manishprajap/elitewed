import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // ── Validation ────────────────────────────────────────
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // ── Query only existing columns ───────────────────────
    const rows = await db
      .select({
        id:       admins.id,
        name:     admins.name,
        email:    admins.email,
        password: admins.password,
        role:     admins.role,
      })
      .from(admins)
      .where(eq(admins.email, email))
      .limit(1);

    const admin = rows[0];

    if (!admin) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // ── Verify password ───────────────────────────────────
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // ── Build secure cookie ───────────────────────────────
    const sessionPayload = JSON.stringify({
      id:   admin.id,
      role: admin.role ?? "admin",
    });
    const encoded = Buffer.from(sessionPayload).toString("base64");

    const response = NextResponse.json({
      success: true,
      admin: {
        id:    admin.id,
        name:  admin.name,
        email: admin.email,
        role:  admin.role,
      },
    });

    response.cookies.set("admin_token", encoded, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge:   60 * 60 * 24, // 1 day
      path:     "/",
    });

    return response;

  } catch (error) {
    console.error("[Admin Login Error]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
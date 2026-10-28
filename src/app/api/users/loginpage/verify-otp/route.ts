import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const { identifier, otp, purpose } = await request.json();

    if (!identifier || !otp || !purpose) {
      return NextResponse.json(
        { message: "Identifier, OTP and purpose are required" },
        { status: 400 }
      );
    }

    const column = purpose === "mobile" ? users.mobile : users.email;

    const rows = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        mobile: users.mobile,
        role: users.role,
        otp: users.otp,
        otpExpiresAt: users.otpExpiresAt,
      })
      .from(users)
      .where(eq(column, identifier))
      .limit(1);

    const user = rows[0];

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    if (!user.otp || user.otp !== otp) {
      return NextResponse.json(
        { message: "Invalid OTP" },
        { status: 401 }
      );
    }

    if (!user.otpExpiresAt || new Date(user.otpExpiresAt) < new Date()) {
      return NextResponse.json(
        { message: "OTP has expired" },
        { status: 401 }
      );
    }

    await db
      .update(users)
      .set({ otp: null, otpExpiresAt: null })
      .where(eq(users.id, user.id));

    const sessionPayload = JSON.stringify({
      id: user.id,
      role: user.role ?? "user",
    });
    const encoded = Buffer.from(sessionPayload).toString("base64");

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
    });

    response.cookies.set("user_token", encoded, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[Verify OTP Error]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
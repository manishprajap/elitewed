import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { corsHeaders } from "@/lib/cors";

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin") ?? "";

  try {
    const { identifier, purpose } = await request.json();

    if (!identifier || !purpose) {
      return NextResponse.json(
        { message: "Identifier and purpose are required" },
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    if (purpose === "mobile" && !/^[6-9]\d{9}$/.test(identifier)) {
      return NextResponse.json(
        { message: "Please enter a valid 10-digit mobile number" },
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    if (purpose === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)) {
      return NextResponse.json(
        { message: "Please enter a valid email address" },
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    const column = purpose === "mobile" ? users.mobile : users.email;

    const rows = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(column, identifier))
      .limit(1);

    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min validity

    if (rows[0]) {
      await db
        .update(users)
        .set({ otp, otpExpiresAt })
        .where(eq(users.id, rows[0].id));
    } else {
      await db.insert(users).values({
        [purpose === "mobile" ? "mobile" : "email"]: identifier,
        otp,
        otpExpiresAt,
        role: "user",
      } as any);
    }
    console.log(`[OTP for ${identifier}]: ${otp}`); 
    return NextResponse.json(
      { success: true, message: "OTP sent successfully" },
      { headers: corsHeaders(origin) }
    );
  } catch (error) {
    console.error("[Send OTP Error]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}
// ---------- Preflight ----------
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin") ?? "";
  return NextResponse.json({}, { headers: corsHeaders(origin) });
}
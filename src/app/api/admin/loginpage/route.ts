import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { corsHeaders } from "@/lib/cors";

const JWT_SECRET: string = process.env.JWT_SECRET ?? (() => {
  throw new Error("JWT_SECRET environment variable is not set");
})();

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin") || "";
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(origin),
  });
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin") || "";

  try {
    const body = await request.json();
    const identifier = body.identifier?.toString().trim();
    const password = body.password?.toString();

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, message: "Email/Mobile and password are required" },
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    // Find admin by email or mobile
    const admin = await db.query.users.findFirst({
      where: (users, { or, eq }) =>
        or(eq(users.email, identifier), eq(users.mobile, identifier)),
    });

    // Generic message/status for "not found" and "wrong password"
    // so the endpoint can't be used to enumerate valid accounts.
    const invalidCredentials = () =>
      NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401, headers: corsHeaders(origin) }
      );

    if (!admin || !admin.password) {
      return invalidCredentials();
    }

    const passwordMatched = await bcrypt.compare(password, admin.password);
    if (!passwordMatched) {
      return invalidCredentials();
    }

    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        mobile: admin.mobile,
        role: admin.role,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        token,
        user: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          mobile: admin.mobile,
          role: admin.role,
        },
      },
      { headers: corsHeaders(origin) }
    );

    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (err) {
    console.error("Login Error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}
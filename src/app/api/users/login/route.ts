// app/api/users/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createUserSession, setSessionCookie } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { login_id, password } = body;

    if (!login_id || !password) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }

    const cleanLoginId = String(login_id).trim().toLowerCase();

    const userData = await db
      .select()
      .from(users)
      .where(or(eq(users.email, cleanLoginId), eq(users.mobile, String(login_id).trim())))
      .limit(1);

    const user = userData[0];

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const sessionToken = await createUserSession(user.id);

    const res = NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      },
    });

    return setSessionCookie(res, sessionToken);
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
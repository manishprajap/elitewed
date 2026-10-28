// lib/session.ts
import crypto from "crypto";
import { db } from "@/db";
import { userSessions } from "@/db/schema";
import { NextResponse } from "next/server";

export async function createUserSession(userId: number) {
  const sessionToken = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min

  await db.insert(userSessions).values({
    user_id: userId,
    session_token: sessionToken,
    expires_at: expiresAt,
  });

  return sessionToken;
}

export function setSessionCookie(res: NextResponse, sessionToken: string) {
  res.cookies.set("session_id", sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60,
  });
  return res;
}
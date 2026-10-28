// app/api/users/me/route.ts
import { getSessionUser } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// ✅ FIX: forces Next.js to treat this route as fully dynamic —
// prevents it from being cached/statically served at build time.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  // ✅ FIX: await cookies() directly — no Promise.resolve wrapper needed
  // (Next.js 15's cookies() is already async).
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;

  if (!sessionId) {
    return NextResponse.json(
      { user: null },
      { status: 200, headers: { "Cache-Control": "no-store" } } // ✅ extra safety
    );
  }

  const user = await getSessionUser(sessionId);

  if (!user) {
    return NextResponse.json(
      { user: null },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  }

  return NextResponse.json(
    {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        profile_photo: user.profile_photo ?? null,
      },
    },
    { headers: { "Cache-Control": "no-store" } } // ✅ extra safety
  );
}
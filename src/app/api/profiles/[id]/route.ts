// src/app/api/profiles/[id]/route.ts
import { db } from "@/db";
import { users, categories } from "@/db/schema";
import { NextResponse, NextRequest } from "next/server";
import { eq, inArray } from "drizzle-orm";
import { calculateAge } from "@/lib/profile-matching";
import { corsHeaders } from "@/lib/cors";

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin") || "";
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(origin),
  });
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // Next.js 15 makes params a Promise
) {
  const origin = req.headers.get("origin") ?? "";

  try {
    const { id: idParam } = await params; // must await before reading .id
    const id = Number(idParam);

    if (!idParam || Number.isNaN(id)) {
      return NextResponse.json(
        { success: false, message: "Valid id required" },
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    const rows = await db.select().from(users).where(eq(users.id, id)).limit(1);

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Profile not found" },
        { status: 404, headers: corsHeaders(origin) }
      );
    }

    const user = rows[0];

    const categoryIds = [user.religion_id, user.profession_id].filter(
      (v): v is number => v !== null && v !== undefined
    );

    const categoryRows = categoryIds.length
      ? await db
          .select({ id: categories.id, name: categories.name })
          .from(categories)
          .where(inArray(categories.id, categoryIds))
      : [];

    const categoryNameById = new Map(categoryRows.map((c) => [c.id, c.name]));

    const data = {
      id: String(user.id),
      fullName: user.name,
      age: calculateAge(user.date_of_birth) ?? 0,
      gender: user.gender,
      religion: user.religion_id
        ? categoryNameById.get(user.religion_id) ?? ""
        : "",
      profession: user.profession_id
        ? categoryNameById.get(user.profession_id)
        : undefined,
      location: user.address ?? "",
      photoUrl: user.profile_photo ?? undefined,
      motherTongue: user.mother_tongue ?? undefined,
      height: user.height ?? undefined,
      weight: user.weight ?? undefined,
      annualIncome: user.annual_income ?? undefined,
      bio: user.bio ?? undefined,
      maritalStatus: user.marital_status ?? undefined,
    };

    console.log("[profile] returning data:", data);

    // FIX: success response was missing CORS headers — this is what caused
    // the browser to block the response even though the server returned 200.
    return NextResponse.json(
      { success: true, data },
      { headers: corsHeaders(origin) }
    );
  } catch (err: any) {
    console.error("GET /api/profiles/[id] Error:", err);
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Server error",
        cause: err.cause?.message ?? err.cause ?? null,
      },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}
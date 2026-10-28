import { db } from "@/db";
import { users, categories } from "@/db/schema";
import { NextResponse, NextRequest } from "next/server";
import { and, eq, gte, lte, like, ne, inArray, sql, SQL } from "drizzle-orm";
import { corsHeaders } from "@/lib/cors";

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin") || "";
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(origin),
  });
}

async function safeLookup(
  table: typeof categories,
  name: string | undefined | null
): Promise<number | null> {
  const trimmed = name?.trim();
  if (!trimmed) return null;

  const rows = await db
    .select({ id: table.id })
    .from(table)
    .where(sql`lower(trim(${table.name})) = lower(trim(${trimmed}))`)
    .limit(1);

  return rows.length > 0 ? rows[0].id : null;
}

function parseAgeRange(range: string): { minAge: number; maxAge: number } | null {
  const trimmed = range.trim();

  const plusMatch = trimmed.match(/^(\d+)\s*\+$/);
  if (plusMatch) {
    return { minAge: Number(plusMatch[1]), maxAge: 120 };
  }

  const rangeMatch = trimmed.match(/^(\d+)\s*-\s*(\d+)$/);
  if (rangeMatch) {
    const minAge = Number(rangeMatch[1]);
    const maxAge = Number(rangeMatch[2]);
    if (Number.isFinite(minAge) && Number.isFinite(maxAge)) {
      return minAge <= maxAge ? { minAge, maxAge } : { minAge: maxAge, maxAge: minAge };
    }
    return null;
  }

  const single = Number(trimmed);
  if (Number.isFinite(single)) {
    return { minAge: single, maxAge: single };
  }

  return null;
}

export async function GET(req: Request) {
  const origin = req.headers.get("origin") ?? "";

  try {
    const { searchParams } = new URL(req.url);

    const partnerAgeRange = searchParams.get("partnerAgeRange");
    const partnerReligion = searchParams.get("partnerReligion");
    const partnerReligionId = searchParams.get("partnerReligionId");
    const preferredLocation = searchParams.get("preferredLocation");

    const excludeUserId = searchParams.get("excludeUserId");
    const ageExpr = sql<number>`TIMESTAMPDIFF(YEAR, ${users.date_of_birth}, CURDATE())`;

    const conditions: SQL[] = [eq(users.status, "active")];

    if (partnerReligionId) {
      const idNum = Number(partnerReligionId);
      if (Number.isFinite(idNum)) {
        conditions.push(eq(users.religion_id, idNum));
      } else {
        const religionId = await safeLookup(categories, partnerReligionId);
        if (religionId !== null) {
          conditions.push(eq(users.religion_id, religionId));
        } else {
          return NextResponse.json(
            { success: true, data: [] },
            { headers: corsHeaders(origin) }
          );
        }
      }
    } else if (partnerReligion) {
      const religionId = await safeLookup(categories, partnerReligion);

      if (religionId !== null) {
        conditions.push(eq(users.religion_id, religionId));
      } else {
        return NextResponse.json(
          { success: true, data: [] },
          { headers: corsHeaders(origin) }
        );
      }
    }

    if (preferredLocation) {
      conditions.push(like(users.address, `%${preferredLocation}%`));
    }

    if (excludeUserId) {
      const idNum = Number(excludeUserId);
      if (Number.isFinite(idNum)) conditions.push(ne(users.id, idNum));
    }

    if (partnerAgeRange) {
      const ageBounds = parseAgeRange(partnerAgeRange);
      console.log("[match] partnerAgeRange:", partnerAgeRange, "-> ageBounds:", ageBounds);
      if (ageBounds) {
        // Filter directly on the computed age, in SQL, rather than
        // converting age -> DOB bounds in JS (which is fragile around
        // timezones/leap years). BETWEEN is inclusive on both ends.
        conditions.push(
          sql`${ageExpr} BETWEEN ${ageBounds.minAge} AND ${ageBounds.maxAge}`
        );
      } else {
        console.warn(
          `[match] parseAgeRange("${partnerAgeRange}") could not be parsed — age filter skipped`
        );
      }
    }

    // ── DEBUG: show exactly which active users exist and why each one
    // does/doesn't survive the individual filters, so it's obvious which
    // condition is responsible for an empty result. Safe to remove once
    // this is confirmed working.
    const activeUsersDebug = await db
      .select({
        id: users.id,
        name: users.name,
        address: users.address,
        religion_id: users.religion_id,
        date_of_birth: users.date_of_birth,
        age: ageExpr.as("age"),
      })
      .from(users)
      .where(eq(users.status, "active"));

    console.log("[match] active users (pre-filter):", activeUsersDebug);
    if (preferredLocation) {
      console.log(
        `[match] preferredLocation="${preferredLocation}" — matches:`,
        activeUsersDebug
          .filter((u) => u.address?.toLowerCase().includes(preferredLocation.toLowerCase()))
          .map((u) => u.id)
      );
    }
    if (partnerReligionId) {
      console.log(
        `[match] partnerReligionId="${partnerReligionId}" — matches:`,
        activeUsersDebug.filter((u) => String(u.religion_id) === partnerReligionId).map((u) => u.id)
      );
    }

    const rows = await db
      .select({
        id: users.id,
        name: users.name,
        gender: users.gender,
        age: ageExpr.as("age"),
        address: users.address,
        profile_photo: users.profile_photo,
        religion_id: users.religion_id,
        profession_id: users.profession_id,
      })
      .from(users)
      .where(and(...conditions));

    console.log("[match] final row count:", rows.length);

    // religion_id and profession_id both reference the same `categories`
    // table, so resolve every id we need in one batch query.
    const categoryIds = Array.from(
      new Set(
        rows
          .flatMap((r) => [r.religion_id, r.profession_id])
          .filter((id): id is number => id !== null && id !== undefined)
      )
    );

    const categoryRows = categoryIds.length
      ? await db
          .select({ id: categories.id, name: categories.name })
          .from(categories)
          .where(inArray(categories.id, categoryIds))
      : [];

    const categoryNameById = new Map(categoryRows.map((c) => [c.id, c.name]));

    const data = rows.map((r) => ({
      id: String(r.id),
      fullName: r.name,
      age: r.age ?? 0,
      gender: r.gender,
      religion: r.religion_id ? categoryNameById.get(r.religion_id) ?? "" : "",
      profession: r.profession_id
        ? categoryNameById.get(r.profession_id)
        : undefined,
      location: r.address ?? "",
      photoUrl: r.profile_photo ?? undefined,
    }));

    console.log("[match] returning data:", data);
    return NextResponse.json(
      { success: true, data },
      { headers: corsHeaders(origin) }
    );
  } catch (err: any) {
    console.error("GET /api/profiles/match Error:", err);
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
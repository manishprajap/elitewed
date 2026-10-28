import { NextRequest, NextResponse } from "next/server";
import { eq, like, and, or, desc, SQL } from "drizzle-orm";
import { users, sub_categories } from "@/db/schema";
import { db } from "@/db";
import { alias } from "drizzle-orm/mysql-core";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const religion_id   = searchParams.get("religion_id");
    const profession_id = searchParams.get("profession_id");
    const gender        = searchParams.get("gender")?.trim();
    const marital       = searchParams.get("marital_status")?.trim();
    const motherTongue  = searchParams.get("mother_tongue")?.trim();
    const q             = searchParams.get("q")?.trim();

    // ✅ alias for sub_categories
    const religionSub   = alias(sub_categories, "religion_sub");
    const professionSub = alias(sub_categories, "profession_sub");

    const filters: SQL[] = [];

    // ✅ ID-based filtering (MAIN FIX)
    if (religion_id) {
      filters.push(eq(users.religion_id, Number(religion_id)));
    }

    if (profession_id) {
      filters.push(eq(users.profession_id, Number(profession_id)));
    }

    if (motherTongue) {
      filters.push(eq(users.mother_tongue, motherTongue));
    }

    if (gender) {
      filters.push(eq(users.gender, gender as "male" | "female" | "other"));
    }

    if (marital) {
      filters.push(
        eq(
          users.marital_status,
          marital as "Married" | "Divorced" | "Widowed" | "Single"
        )
      );
    }

    // ✅ search query
    if (q) {
      filters.push(
        or(
          like(users.name, `%${q}%`),
          like(users.address, `%${q}%`),
          like(users.mother_tongue, `%${q}%`)
        )!
      );
    }

    // ✅ MAIN QUERY
    const result = await db
      .select({
        id: users.id,
        name: users.name,
        profile_photo: users.profile_photo,
        gender: users.gender,
        date_of_birth: users.date_of_birth,
        marital_status: users.marital_status,
        mother_tongue: users.mother_tongue,
        annual_income: users.annual_income,
        height: users.height,
        city: users.address,

        // ✅ IMPORTANT (for filtering)
        religion_id: users.religion_id,
        profession_id: users.profession_id,

        // ✅ FIXED (from sub_categories)
        religion: religionSub.name,
        occupation: professionSub.name,

        is_premium: users.role,
      })
      .from(users)
      .leftJoin(religionSub, eq(users.religion_id, religionSub.id))
      .leftJoin(professionSub, eq(users.profession_id, professionSub.id))
      .where(filters.length > 0 ? and(...filters) : undefined)
      .orderBy(desc(users.id));

    // ✅ format response
    const profiles = result.map((u) => ({
      ...u,
      annual_income: u.annual_income ? String(u.annual_income) : null,
      is_premium: u.is_premium === "premium",
    }));

    // ✅ DEBUG (remove later)
    console.log("Search filters:", {
      religion_id,
      profession_id,
      gender,
      marital,
      motherTongue,
      q,
    });
    console.log("Result count:", profiles.length);

    return NextResponse.json({ users: profiles });

  } catch (err) {
    console.error("Search API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
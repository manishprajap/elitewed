import { NextResponse, NextRequest } from "next/server";
import { db } from "@/db";
import { users, categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { alias } from "drizzle-orm/mysql-core";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const userId = Number(id);

    if (Number.isNaN(userId)) {
      return NextResponse.json(
        { error: "Invalid user id" },
        { status: 400 }
      );
    }

    // ✅ Create aliases for same table
    const religion = alias(categories, "religion");
    const caste = alias(categories, "caste");
    const education = alias(categories, "education");
    const profession = alias(categories, "profession");

    const result = await db
      .select({
        id: users.id,
        name: users.name, // or full_name
        profile_photo: users.profile_photo,
        address: users.address,
        profile_for: users.profile_for,
        gender: users.gender,
        marital_status: users.marital_status,
        religion: religion.name,
        mother_tongue: users.mother_tongue,
        caste: caste.name,
        education: education.name,
        profession: profession.name,
        annual_income: users.annual_income,
      })
      .from(users)
      .leftJoin(religion, eq(users.religion_id, religion.id))
  
      .leftJoin(profession, eq(users.profession_id, profession.id))
      .where(eq(users.id, userId))
      .limit(1);

    if (!result.length) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0]);

  } catch (error) {
    console.error("PUBLIC PROFILE ERROR:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
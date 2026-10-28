// /app/api/users/public/[id]/route.ts

import { NextResponse, NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import {  users } from "@/db/schema";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ FIX
) {
  const { id } = await context.params; // ✅ FIX
  const userId = Number(id);

  if (Number.isNaN(userId)) {
    return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
  }

  try {
    const result = await db
      .select({
        id: users.id,
        name: users.name,
        profile_photo: users.profile_photo,
        address: users.address,
        profile_for: users.profile_for,
        gender: users.gender,
        marital_status: users.marital_status,
       date_of_birth: users.date_of_birth,
        mobile: users.mobile,
        bio: users.bio,
        role: users.role,
        status: users.status,
        mother_tongue: users.mother_tongue,
       height: users.height,
        weight: users.weight, 
        annual_income: users.annual_income,
      })
      .from(users)
      
      .where(eq(users.id, userId))
      .limit(1);
// console.log("PUBLIC PROFILE RESULT:", result);
    if (!result.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(result[0]);

  } catch (err) {
    console.error("PUBLIC PROFILE ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
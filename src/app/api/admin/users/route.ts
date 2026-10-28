import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, categories } from "@/db/schema";
import { eq, and, or, like, inArray, sql, SQL } from "drizzle-orm";

// ── GET: list users with filters ────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const gender = searchParams.get("gender");
    const status = searchParams.get("status");

    const conditions: (SQL | undefined)[] = [];

    if (status && status !== "all") {
      conditions.push(eq(users.status, status as "active" | "inactive" | "pending" | "banned"));
    }
    if (gender && gender !== "all") {
      conditions.push(eq(users.gender, gender as "male" | "female" | "other"));
    }
    if (search) {
      conditions.push(
        or(
          like(users.name, `%${search}%`),
          like(users.email, `%${search}%`),
          like(users.mobile, `%${search}%`)
        )
      );
    }

    const whereClause = conditions.length ? and(...conditions) : undefined;

    // 1) Fetch users — no join at all
    const rows = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        mobile: users.mobile,
        address: users.address,
        profile_for: users.profile_for,
        gender: users.gender,
        date_of_birth: users.date_of_birth,
        marital_status: users.marital_status,
        mother_tongue: users.mother_tongue,
        height: users.height,
        weight: users.weight,
        annual_income: users.annual_income,
        profile_photo: users.profile_photo,
        bio: users.bio,
        role: users.role,
        status: users.status,
        email_verified_at: users.email_verified_at,
        mobile_verified_at: users.mobile_verified_at,
        created_at: users.created_at,
        updated_at: users.updated_at,
        profession_id: users.profession_id,
        religion_id: users.religion_id,
      })
      .from(users)
      .where(whereClause)
      .orderBy(sql`${users.created_at} DESC`);

    // 2) Collect category ids actually needed
    const categoryIds = Array.from(
      new Set(
        rows
          .flatMap((u) => [u.profession_id, u.religion_id])
          .filter((id): id is number => id !== null && id !== undefined)
      )
    );

    // 3) Fetch category names separately
    let categoryMap = new Map<number, string>();
    if (categoryIds.length > 0) {
      const catRows = await db
        .select({ id: categories.id, name: categories.name })
        .from(categories)
        .where(inArray(categories.id, categoryIds));

      categoryMap = new Map(catRows.map((c) => [c.id, c.name]));
    }

    // 4) Merge in JS
    const data = rows.map((u) => ({
      ...u,
      profession: u.profession_id ? categoryMap.get(u.profession_id) ?? "—" : "—",
      religion: u.religion_id ? categoryMap.get(u.religion_id) ?? "—" : "—",
      caste: null,
      education: null,
    }));

    return NextResponse.json({
      success: true,
      data,
      _debug_version: "v2-no-join", // remove this line once confirmed working
    });
  } catch (error) {
    console.error("GET /api/users error:", error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// ── PATCH: approve / block / deactivate ─────────────────────────
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, action } = body as { id: number; action: string };

    if (!id || !action) {
      return NextResponse.json({ success: false, message: "id and action are required" }, { status: 400 });
    }

    const actionToStatus: Record<string, "active" | "inactive" | "pending" | "banned"> = {
      approve: "active",
      block: "banned",
      deactivate: "inactive",
      pending: "pending",
    };

    const newStatus = actionToStatus[action];
    if (!newStatus) {
      return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });
    }

    await db
      .update(users)
      .set({ status: newStatus, updated_at: new Date() })
      .where(eq(users.id, id));

    return NextResponse.json({ success: true, message: `User ${action}d successfully` });
  } catch (error) {
    console.error("PATCH /api/users error:", error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Failed to update user" },
      { status: 500 }
    );
  }
}

// ── DELETE: remove a user ────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "id is required" }, { status: 400 });
    }

    await db.delete(users).where(eq(users.id, Number(id)));

    return NextResponse.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/users error:", error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Failed to delete user" },
      { status: 500 }
    );
  }
}
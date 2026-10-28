import { db } from "@/db";
import { categories, sub_categories } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq, like, asc } from "drizzle-orm";

/**
 * =========================
 * GET Categories
 * =========================
 * Returns: { success: true, data: { "Religion": [{id, name}], "Profession": [{id, name}] } }
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

    // If search param exists → return flat parent categories list (for admin search)
    if (search) {
      const data = await db
        .select()
        .from(categories)
        .where(like(categories.name, `%${search}%`));
      return NextResponse.json({ success: true, data });
    }

    // ✅ No search → return subcategories grouped by parent category name
    const result: Record<string, { id: number; name: string }[]> = {};

    const categoryData = await db
      .select({ id: categories.id, name: categories.name })
      .from(categories)
      .orderBy(asc(categories.name));

    for (const category of categoryData) {
      const subs = await db
        .select({ id: sub_categories.id, name: sub_categories.name })
        .from(sub_categories)
        .where(eq(sub_categories.category_id, category.id))
        .orderBy(asc(sub_categories.name));

      result[category.name] = subs;
    }

    return NextResponse.json({ success: true, data: result });

  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

/**
 * =========================
 * ADD Category
 * =========================
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.name) {
      return NextResponse.json(
        { success: false, message: "Name required" },
        { status: 400 }
      );
    }

    await db.insert(categories).values({ name: body.name });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

/**
 * =========================
 * DELETE Category
 * =========================
 */
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));

    await db.delete(categories).where(eq(categories.id, id));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
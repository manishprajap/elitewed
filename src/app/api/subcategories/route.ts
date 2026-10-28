import { db } from "@/db";
import { sub_categories, categories } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq, like, desc } from "drizzle-orm";

/**
 * =========================
 * GET sub_categories
 * =========================
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

    const query = db
      .select({
        id: sub_categories.id,
        name: sub_categories.name,
        category_id: sub_categories.category_id,
        category_name: categories.name,
        created_at: sub_categories.created_at,
      })
      .from(sub_categories)
      .leftJoin(categories, eq(sub_categories.category_id, categories.id))
      .orderBy(desc(sub_categories.id));

    const data = search
      ? await query.where(like(sub_categories.name, `%${search}%`))
      : await query;

    return NextResponse.json({ success: true, data });
  } catch  {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

/**
 * =========================
 * ADD Subcategory
 * =========================
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.name || !body.category_id) {
      return NextResponse.json(
        { success: false, message: "All fields required" },
        { status: 400 }
      );
    }

    await db.insert(sub_categories).values({
      name: body.name,
      category_id: body.category_id,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

/**
 * =========================
 * DELETE Subcategory
 * =========================
 */
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));

    await db.delete(sub_categories).where(eq(sub_categories.id, id));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { categories, sub_categories } from "@/db/schema";
import { asc, eq, and, SQL } from "drizzle-orm";
import { corsHeaders } from "@/lib/cors";

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin") || "";
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(origin),
  });
}

export async function GET(req: NextRequest) {
  const origin = req.headers.get("origin") || "";
  try {
    const { searchParams } = new URL(req.url);
    const category_id = searchParams.get("category_id");
    const category_name = searchParams.get("category_name");

    const filters: SQL[] = [];
    if (category_id) {
      filters.push(eq(categories.id, Number(category_id)));
    }
    if (category_name) {
      filters.push(eq(categories.name, category_name));
    }

    const whereClause = filters.length ? and(...filters) : undefined;

    const rows = await db
      .select({
        category_id: categories.id,
        category_name: categories.name,
        sub_id: sub_categories.id,
        sub_name: sub_categories.name,
      })
      .from(categories)
      .leftJoin(sub_categories, eq(sub_categories.category_id, categories.id))
      .where(whereClause)
      .orderBy(asc(categories.name), asc(sub_categories.name));

    const result: Record<string, { id: number; name: string }[]> = {};
    for (const row of rows) {
      if (!result[row.category_name]) {
        result[row.category_name] = [];
      }
      if (row.sub_id) {
        result[row.category_name].push({
          id: row.sub_id,
          name: row.sub_name!,
        });
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { headers: corsHeaders(origin) } // ✅ success response me bhi CORS headers missing the
    );
  } catch (error) {
    console.error("Categories API Error:", error);
    return NextResponse.json(
      { success: false, data: {} },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}
// app/api/carousel/route.ts
import { db } from "@/db";
import { categories, users } from "@/db/schema";
import { desc, isNotNull } from "drizzle-orm";

export async function GET() {
  try {
    const data = await db
      .select({
        id: users.id,
        name: users.name,
        profile_photo: users.profile_photo,
        education: categories.name,
        profession: categories.name,
      })
      .from(users)
      .where(isNotNull(users.profile_photo))
      .orderBy(desc(users.id))
      .limit(5);

    return Response.json(data);

  } catch (err) {
    console.error("CAROUSEL API ERROR:", err);
    return Response.json({ error: "DB Error" }, { status: 500 });
  }
}
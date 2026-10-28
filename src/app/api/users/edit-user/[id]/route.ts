// app/api/users/[id]/route.ts

import { NextResponse, NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { promises as fs } from "fs";
import path from "path";
import { getSessionUser } from "@/lib/auth";
import { cookies } from "next/headers";
import { db } from "@/db";
import { users } from "@/db/schema";

const UPLOAD_DIR = path.join(process.cwd(), "public/uploads");

// -------------------- GET USER --------------------
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ FIX
) {
  const { id } = await context.params; // ✅ FIX
  const userId = Number(id);

  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("session_id")?.value;

    if (!sessionId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const sessionUser = await getSessionUser(sessionId);

    if (!sessionUser || sessionUser.id !== userId)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const result = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        profile_photo: users.profile_photo,
        address: users.address,
        profile_for: users.profile_for,
        gender: users.gender,
        marital_status: users.marital_status,
        mother_tongue: users.mother_tongue,
        date_of_birth: users.date_of_birth,
        annual_income: users.annual_income,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!result.length)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json(result[0]);

  } catch (error) {
    console.error("GET ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// -------------------- UPDATE USER --------------------
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ FIX
) {
  const { id } = await context.params; // ✅ FIX
  const userId = Number(id);

  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("session_id")?.value;

    if (!sessionId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const sessionUser = await getSessionUser(sessionId);

    if (!sessionUser || sessionUser.id !== userId)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const formData = await request.formData();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatedData: any = {};

    const basicFields = [
      "name",
      "email",
      "mobile",
      "address",
      "profile_for",
      "gender",
      "marital_status",
      "mother_tongue",
      "date_of_birth",
    ];

    basicFields.forEach((field) => {
      const val = formData.get(field)?.toString();
      if (val) updatedData[field] = val;
    });

    ["height", "weight", "annual_income"].forEach((field) => {
      const val = formData.get(field);
      if (val) updatedData[field] = Number(val);
    });

    ["profession", "religion", "caste", "education"].forEach((field) => {
      const val = formData.get(field);
      if (val) updatedData[`${field}_id`] = Number(val);
    });

    const imageFile = formData.get("profile_photo") as Blob | null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (imageFile && (imageFile as any).name) {
      await fs.mkdir(UPLOAD_DIR, { recursive: true });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fileExt = (imageFile as any).name.split(".").pop() || "png";
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;

      const filePath = path.join(UPLOAD_DIR, fileName);

      const buffer = Buffer.from(await imageFile.arrayBuffer());
      await fs.writeFile(filePath, buffer);

      updatedData.profile_photo = `/uploads/${fileName}`;
    }

    if (Object.keys(updatedData).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    await db
      .update(users)
      .set({
        ...updatedData,
        updated_at: new Date(),
      })
      .where(eq(users.id, userId));

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
    });

  } catch (error) {
    console.error("PUT ERROR:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
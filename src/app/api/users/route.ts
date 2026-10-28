////src/app/api/users/route.ts
import { db } from "@/db";
import {
  categories,
  users,
  userSessions, // ✅ FIX: needed for session creation
} from "@/db/schema";
import { corsHeaders } from "@/lib/cors";
import { NextRequest, NextResponse } from "next/server";
import { eq, like, and, or, SQL } from "drizzle-orm"; // ✅ FIX: added `or`
import { alias } from "drizzle-orm/mysql-core";
import bcrypt from "bcryptjs";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin") || "";
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(origin),
  });
}

// ─────────────────────────────────────────────
// SESSION HELPERS (✅ FIX: added, previously missing)
// ─────────────────────────────────────────────

async function createUserSession(userId: number): Promise<string> {
  const sessionToken = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min

  await db.insert(userSessions).values({
    user_id: userId,
    session_token: sessionToken,
    expires_at: expiresAt,
  });

  return sessionToken;
}

function attachSessionCookie(res: NextResponse, sessionToken: string) {
  res.cookies.set("session_id", sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60,
  });
  return res;
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

async function safeLookup(
  table: typeof categories,
  name: string | undefined | null
): Promise<number | null> {
  if (!name) return null;
  const rows = await db
    .select({ id: table.id })
    .from(table)
    .where(eq(table.name, name))
    .limit(1);
  return rows.length > 0 ? rows[0].id : null;
}

async function parseRequestBody(
  req: Request
): Promise<{ fields: Record<string, any>; photoFile: File | null }> {
  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const form = await req.formData();
    const fields: Record<string, any> = {};
    let photoFile: File | null = null;

    for (const [key, value] of form.entries()) {
      if (key === "profilePhoto" && value instanceof File) {
        if (value.size > 0) photoFile = value;
      } else {
        fields[key] = value;
      }
    }
    return { fields, photoFile };
  }

  const json = await req.json();
  return { fields: json, photoFile: null };
}

async function saveProfilePhoto(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null;

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name) || "";
  const filename = `${crypto.randomUUID()}${ext}`;

  const uploadDir = path.join(process.cwd(), "public", "uploads", "profile-photos");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), buffer);

  return `/uploads/profile-photos/${filename}`;
}

// ─────────────────────────────────────────────
// GET USERS (unchanged)
// ─────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const origin = req.headers.get("origin") || "";
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search");
    const gender = searchParams.get("gender") as "male" | "female" | "other" | null;
    const status = searchParams.get("status") as "active" | "inactive" | "banned" | "pending" | null;

    const conditions: SQL[] = [];

    if (search) conditions.push(like(users.name, `%${search}%`));
    if (gender) conditions.push(eq(users.gender, gender));
    if (status) conditions.push(eq(users.status, status));

    const religionCat = alias(categories, "religion_cat");
    const professionCat = alias(categories, "profession_cat");

    const baseQuery = db
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
        created_at: users.created_at,
        updated_at: users.updated_at,
        religion: religionCat.name,
        profession: professionCat.name,
      })
      .from(users)
      .leftJoin(religionCat, eq(users.religion_id, religionCat.id))
      .leftJoin(professionCat, eq(users.profession_id, professionCat.id));

    const data = conditions.length
      ? await baseQuery.where(and(...conditions))
      : await baseQuery;

    return NextResponse.json(
      { success: true, data },
      { headers: corsHeaders(origin) }
    );
  } catch (err: unknown) {
    const error = err as Error & { cause?: unknown };
    console.error("GET API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Server error",
        cause: (error.cause as any)?.message ?? error.cause ?? null,
      },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}

// ─────────────────────────────────────────────
// CREATE USER
// ─────────────────────────────────────────────

type ProfileForEnum = "Self" | "Daughter" | "Son" | "Others";
type GenderEnum = "Male" | "Female" | "Other";
type MaritalEnum = "Single" | "Married" | "Divorced" | "Widowed";

const PROFILE_FOR_VALUES: ProfileForEnum[] = ["Self", "Daughter", "Son", "Others"];
const GENDER_VALUES: GenderEnum[] = ["Male", "Female", "Other"];
const MARITAL_VALUES: MaritalEnum[] = ["Single", "Married", "Divorced", "Widowed"];

function validateEnum<T extends string>(allowed: T[], value: unknown): T | null {
  if (typeof value !== "string") return null;
  return (allowed as string[]).includes(value) ? (value as T) : null;
}

function parseAnnualIncome(value: any): string | null {
  if (value === undefined || value === null || value === "") return null;
  const cleaned = String(value).replace(/[^0-9.]/g, "");

  if (!cleaned) {
    console.warn(`parseAnnualIncome: no numeric content in "${value}"`);
    return null;
  }

  const num = Number(cleaned);

  if (isNaN(num)) {
    console.warn(`parseAnnualIncome: could not parse "${value}" (cleaned: "${cleaned}")`);
    return null;
  }

  return num.toFixed(2);
}

function parseIntOrNull(value: any): number | null {
  if (value === undefined || value === null || value === "") return null;
  const num = Number(value);
  return Number.isFinite(num) ? Math.trunc(num) : null;
}

// ─── POST API ─────────────────────────────────────────

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin") || "";
  try {
    const { fields: body, photoFile } = await parseRequestBody(req);

    const name = body.name;
    const email = body.email;
    const password = body.password;
    const mobile = body.mobile ?? null;
    const profile_for = body.profile_for ?? body.profileFor;
    const gender = body.gender;
    const date_of_birth = body.date_of_birth ?? body.dob;
    const marital_status = body.marital_status ?? body.maritalStatus;
    const mother_tongue = body.mother_tongue ?? body.motherTongue;
    const height = body.height;
    const weight = body.weight;
    const annual_income = body.annual_income ?? body.annualIncome;
    const address = body.address ?? body.location;
    const bio = body.bio;

    const religionSelectedId = body.religion;
    const casteSelectedId = body.caste;
    const educationSelectedId = body.education;
    const professionSelectedId = body.profession;

    const religionName = body.religionName;
    const casteName = body.casteName;
    const educationName = body.educationName;
    const professionName = body.professionName;

    const profession_id = body.profession_id;
    const religion_id = body.religion_id;
    const caste_id = body.caste_id;
    const education_id = body.education_id;

    // ─── VALIDATION ───────────────────────────────

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "name, email, password required" },
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    if (!email.includes("@")) {
      return NextResponse.json(
        { success: false, message: "Invalid email format" },
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    // ✅ FIX: normalize once, reuse everywhere
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanMobile = mobile ? String(mobile).trim() : null;

    // ─── DUPLICATE CHECK (✅ FIX: now checks email AND mobile) ──────────────

    const existingConditions = cleanMobile
      ? or(eq(users.email, cleanEmail), eq(users.mobile, cleanMobile))
      : eq(users.email, cleanEmail);

    const existingUser = await db
      .select({ id: users.id, email: users.email, mobile: users.mobile })
      .from(users)
      .where(existingConditions)
      .limit(1);

    if (existingUser.length > 0) {
      const dupe = existingUser[0];
      const isEmailDupe = dupe.email === cleanEmail;
      const isMobileDupe = cleanMobile !== null && dupe.mobile === cleanMobile;

      return NextResponse.json(
        {
          success: false,
          message: isEmailDupe
            ? "This email is already registered"
            : isMobileDupe
            ? "This mobile number is already registered"
            : "Email or mobile already exists",
        },
        { status: 409, headers: corsHeaders(origin) }
      );
    }

    // ─── ENUM VALIDATION ──────────────────────────

    const mappedProfileFor = validateEnum<ProfileForEnum>(PROFILE_FOR_VALUES, profile_for);
    const mappedGender = validateEnum<GenderEnum>(GENDER_VALUES, gender);
    const mappedMarital = validateEnum<MaritalEnum>(MARITAL_VALUES, marital_status);

    // ─── PASSWORD HASH ────────────────────────────

    const hashedPassword = await bcrypt.hash(password, 10);

    // ─── DATE FORMAT ──────────────────────────────

    const dob = date_of_birth ? new Date(date_of_birth) : null;

    // ─── INCOME PARSE ─────────────────────────────

    const parsedIncome = parseAnnualIncome(annual_income);

    // ─── FOREIGN KEY IDS ──────────────────────────

    const parsedProfessionId =
      parseIntOrNull(profession_id) ??
      parseIntOrNull(professionSelectedId) ??
      (await safeLookup(categories, professionName));

    const parsedReligionId =
      parseIntOrNull(religion_id) ??
      parseIntOrNull(religionSelectedId) ??
      (await safeLookup(categories, religionName));

    const parsedCasteId =
      parseIntOrNull(caste_id) ??
      parseIntOrNull(casteSelectedId) ??
      (await safeLookup(categories, casteName));

    const parsedEducationId =
      parseIntOrNull(education_id) ??
      parseIntOrNull(educationSelectedId) ??
      (await safeLookup(categories, educationName));

    // ─── PROFILE PHOTO ────────────────────────────
    const profilePhotoUrl = await saveProfilePhoto(photoFile);

    // ─── TYPE-SAFE INSERT ─────────────────────────

    type NewUser = typeof users.$inferInsert;

    const newUser: NewUser = {
      name,
      email: cleanEmail, // ✅ FIX: store normalized email
      password: hashedPassword,
      mobile: cleanMobile, // ✅ FIX: store normalized mobile
      profile_for: mappedProfileFor as any,
      gender: mappedGender as any,
      date_of_birth: dob,
      marital_status: mappedMarital as any,

      mother_tongue: mother_tongue ?? null,
      height: height ? String(height) : null,
      weight: weight ? String(weight) : null,
      annual_income: parsedIncome,

      address: address ?? null,
      bio: bio ?? null,
      profile_photo: profilePhotoUrl,

      profession_id: parsedProfessionId,
      religion_id: parsedReligionId,
      caste_id: parsedCasteId,
      education_id: parsedEducationId,

      email_verified_at: null,
      mobile_verified_at: null,

      role: "user",
      status: "active", // ✅ FIX: was "pending" — changed so direct-login works right after register. Revert to "pending" if you have a separate admin-approval flow that must run before login.

      created_at: new Date(),
      updated_at: new Date(),
    };

    // ✅ FIX: capture inserted row so we have the new user's id for session creation
   // ✅ MySQL-safe version
const [insertedUser] = await db.insert(users).values(newUser).$returningId();
const userId = insertedUser?.id;

let res: NextResponse;
if (userId) {
  const sessionToken = await createUserSession(userId);
  res = NextResponse.json(
    {
      success: true,
      message: "User created successfully",
      user: { id: userId, name, email: cleanEmail, mobile: cleanMobile },
    },
    { headers: corsHeaders(origin) }
  );
  res = attachSessionCookie(res, sessionToken);
} else {
  res = NextResponse.json(
    { success: true, message: "User created successfully" },
    { headers: corsHeaders(origin) }
  );
}

return res;
  } catch (err: any) {
    console.error("POST API Error:", err);

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

// ─────────────────────────────────────────────
// UPDATE USER STATUS (unchanged)
// ─────────────────────────────────────────────

export async function PATCH(req: NextRequest) {
  const origin = req.headers.get("origin") || "";
  try {
    const body = await req.json();
    const { id, action } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "id is required" },
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    const statusMap: Record<string, "active" | "inactive" | "banned" | "pending"> = {
      approve: "active",
      block: "banned",
      deactivate: "inactive",
      pending: "pending",
    };

    if (!statusMap[action]) {
      return NextResponse.json(
        { success: false, message: "Invalid action" },
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    await db
      .update(users)
      .set({ status: statusMap[action] })
      .where(eq(users.id, Number(id)));

    return NextResponse.json(
      { success: true, message: "Status updated" },
      { headers: corsHeaders(origin) }
    );
  } catch (err: unknown) {
    const error = err as Error & { cause?: unknown };
    console.error("PATCH API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Update failed",
        cause: (error.cause as any)?.message ?? error.cause ?? null,
      },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}

// ─────────────────────────────────────────────
// DELETE USER (unchanged)
// ─────────────────────────────────────────────

export async function DELETE(req: NextRequest) {
  const origin = req.headers.get("origin") || "";
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Valid id required" },
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    await db.delete(users).where(eq(users.id, id));

    return NextResponse.json(
      { success: true, message: "User deleted successfully" },
      { headers: corsHeaders(origin) }
    );
  } catch (err: unknown) {
    const error = err as Error & { cause?: unknown };
    console.error("DELETE API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Delete failed",
        cause: (error.cause as any)?.message ?? error.cause ?? null,
      },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}
// src/app/api/profiles/me/route.ts
import { db } from "@/db";
import { users, categories } from "@/db/schema";
import { NextResponse, NextRequest } from "next/server";
import { eq, inArray } from "drizzle-orm";
import { calculateAge } from "@/lib/profile-matching";
import { corsHeaders } from "@/lib/cors";
import { getSessionUser } from "@/lib/auth";
import { cookies as nextCookies } from "next/headers";
import jwt from "jsonwebtoken";

interface AuthTokenPayload {
  id: number;
  email: string;
  mobile: string;
  role: string;
  iat: number;
  exp: number;
}

type AuthResult =
  | { id: number }
  | { id: null; reason: string };

async function resolveUserId(req: Request): Promise<AuthResult> {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!authHeader) {
    console.warn("[profiles/me] no Authorization header on request at all");
  } else if (!token) {
    console.warn("[profiles/me] Authorization header present but not Bearer-formatted:", authHeader);
  }

  if (token) {
    if (!process.env.JWT_SECRET) {
      console.error("[profiles/me] JWT_SECRET env var is not set on the server");
    } else {
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET) as AuthTokenPayload;
        return { id: Number(payload.id) };
      } catch (err: any) {
        console.warn("[profiles/me] jwt.verify failed:", err.message);
      }
    }
  }

  const cookieStore = await Promise.resolve(nextCookies());
  const sessionId = cookieStore.get("session_id")?.value;
  if (!sessionId) {
    return { id: null, reason: "no bearer token and no session_id cookie" };
  }

  const sessionUser = await getSessionUser(sessionId);
  if (!sessionUser) {
    return { id: null, reason: "session_id cookie present but getSessionUser returned null" };
  }

  return { id: Number(sessionUser.id) };
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin") || "";
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(origin),
  });
}

export async function GET(req: Request) {
  const origin = req.headers.get("origin") ?? "";
  try {
    const auth = await resolveUserId(req);
    if (auth.id === null) {
      console.warn("[profiles/me] 401:", auth.reason);
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401, headers: corsHeaders(origin) }
      );
    }

    const rows = await db.select().from(users).where(eq(users.id, auth.id)).limit(1);
    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Profile not found" },
        { status: 404, headers: corsHeaders(origin) }
      );
    }
    const user = rows[0];

    const categoryIds = [user.religion_id, user.profession_id].filter(
      (v): v is number => v !== null && v !== undefined
    );
    const categoryRows = categoryIds.length
      ? await db
          .select({ id: categories.id, name: categories.name })
          .from(categories)
          .where(inArray(categories.id, categoryIds))
      : [];
    const categoryNameById = new Map(categoryRows.map((c) => [c.id, c.name]));

    const data = {
      id: String(user.id),
      fullName: user.name,
      age: calculateAge(user.date_of_birth) ?? 0,
      gender: user.gender,
      religion: user.religion_id
        ? categoryNameById.get(user.religion_id) ?? ""
        : "",
      profession: user.profession_id
        ? categoryNameById.get(user.profession_id)
        : undefined,
      location: user.address ?? "",
      photoUrl: user.profile_photo ?? undefined,
      motherTongue: user.mother_tongue ?? undefined,
      height: user.height ?? undefined,
      weight: user.weight ?? undefined,
      annualIncome: user.annual_income ?? undefined,
      bio: user.bio ?? undefined,
      maritalStatus: user.marital_status ?? undefined,
    };

    return NextResponse.json(
      { success: true, data },
      { headers: corsHeaders(origin) }
    );
  } catch (err: any) {
    console.error("GET /api/profiles/me Error:", err);
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

// ---- PUT: update the current user's profile ----

interface UpdateProfileBody {
  fullName?: string;
  gender?: string;
  maritalStatus?: string;
  religion?: string;
  profession?: string;
  location?: string;
  photoUrl?: string;
  motherTongue?: string;
  height?: string;
  weight?: string;
  annualIncome?: string;
  bio?: string;
  dateOfBirth?: string;
}

async function resolveCategoryId(name: string): Promise<number | null> {
  const rows = await db
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.name, name))
    .limit(1);
  return rows.length ? rows[0].id : null;
}

export async function PUT(req: Request) {
  const origin = req.headers.get("origin") ?? "";
  try {
    const auth = await resolveUserId(req);
    if (auth.id === null) {
      console.warn("[profiles/me] PUT 401:", auth.reason);
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401, headers: corsHeaders(origin) }
      );
    }

    let body: UpdateProfileBody;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid JSON body" },
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    const existingRows = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, auth.id))
      .limit(1);
    if (existingRows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Profile not found" },
        { status: 404, headers: corsHeaders(origin) }
      );
    }

    let religionId: number | null | undefined;
    if (body.religion !== undefined) {
      if (body.religion === "") {
        religionId = null;
      } else {
        religionId = await resolveCategoryId(body.religion);
        if (religionId === null) {
          return NextResponse.json(
            { success: false, message: `Unknown religion: "${body.religion}"` },
            { status: 400, headers: corsHeaders(origin) }
          );
        }
      }
    }

    let professionId: number | null | undefined;
    if (body.profession !== undefined) {
      if (body.profession === "") {
        professionId = null;
      } else {
        professionId = await resolveCategoryId(body.profession);
        if (professionId === null) {
          return NextResponse.json(
            { success: false, message: `Unknown profession: "${body.profession}"` },
            { status: 400, headers: corsHeaders(origin) }
          );
        }
      }
    }

    const updates: Record<string, unknown> = {};
    if (body.fullName !== undefined) updates.name = body.fullName;
    if (body.gender !== undefined) updates.gender = body.gender;
    if (body.maritalStatus !== undefined) updates.marital_status = body.maritalStatus;
    if (religionId !== undefined) updates.religion_id = religionId;
    if (professionId !== undefined) updates.profession_id = professionId;
    if (body.location !== undefined) updates.address = body.location;
    if (body.photoUrl !== undefined) updates.profile_photo = body.photoUrl;
    if (body.motherTongue !== undefined) updates.mother_tongue = body.motherTongue;
    if (body.height !== undefined) updates.height = body.height;
    if (body.weight !== undefined) updates.weight = body.weight;
    if (body.annualIncome !== undefined) updates.annual_income = body.annualIncome;
    if (body.bio !== undefined) updates.bio = body.bio;
    if (body.dateOfBirth !== undefined) updates.date_of_birth = body.dateOfBirth;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, message: "No fields provided to update" },
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    await db.update(users).set(updates).where(eq(users.id, auth.id));

    const rows = await db.select().from(users).where(eq(users.id, auth.id)).limit(1);
    const user = rows[0];

    const categoryIds = [user.religion_id, user.profession_id].filter(
      (v): v is number => v !== null && v !== undefined
    );
    const categoryRows = categoryIds.length
      ? await db
          .select({ id: categories.id, name: categories.name })
          .from(categories)
          .where(inArray(categories.id, categoryIds))
      : [];
    const categoryNameById = new Map(categoryRows.map((c) => [c.id, c.name]));

    const data = {
      id: String(user.id),
      fullName: user.name,
      age: calculateAge(user.date_of_birth) ?? 0,
      gender: user.gender,
      religion: user.religion_id
        ? categoryNameById.get(user.religion_id) ?? ""
        : "",
      profession: user.profession_id
        ? categoryNameById.get(user.profession_id)
        : undefined,
      location: user.address ?? "",
      photoUrl: user.profile_photo ?? undefined,
      motherTongue: user.mother_tongue ?? undefined,
      height: user.height ?? undefined,
      weight: user.weight ?? undefined,
      annualIncome: user.annual_income ?? undefined,
      bio: user.bio ?? undefined,
      maritalStatus: user.marital_status ?? undefined,
    };

    return NextResponse.json(
      { success: true, message: "Profile updated successfully", data },
      { headers: corsHeaders(origin) }
    );
  } catch (err: any) {
    console.error("PUT /api/profiles/me Error:", err);
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
///src/app/api/users/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import bcrypt from "bcryptjs";
import { or, eq } from "drizzle-orm";
import { users } from "@/db/schema";
import { createUserSession, setSessionCookie } from "@/lib/session";

export const runtime = "nodejs";

type NewUser = typeof users.$inferInsert;

const PROFILE_FOR_VALUES = ["Self", "Son", "Daughter", "Others"] as const;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      profile_for,
      name,
      gender,
      date_of_birth,
      marital_status,
      religion_id,
      caste_id,
      mother_tongue,
      address,
      height,
      weight,
      education_id,
      profession_id,
      annual_income,
      bio,
      email,
      mobile,
      password,
    } = body;

    // ✅ Basic required-field validation
    if (!name || !email || !mobile || !password) {
      return NextResponse.json(
        { error: "Name, email, mobile and password are required" },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanMobile = String(mobile).trim();

    // ✅ Check BOTH email and mobile for duplicates in ONE query
    const existing = await db
      .select({ id: users.id, email: users.email, mobile: users.mobile })
      .from(users)
      .where(or(eq(users.email, cleanEmail), eq(users.mobile, cleanMobile)))
      .limit(1);

    if (existing.length > 0) {
      const dupe = existing[0];
      if (dupe.email === cleanEmail) {
        return NextResponse.json(
          { error: "This email is already registered" },
          { status: 409 }
        );
      }
      if (dupe.mobile === cleanMobile) {
        return NextResponse.json(
          { error: "This mobile number is already registered" },
          { status: 409 }
        );
      }
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ FIX: use the destructured JSON body variables directly, not formData
    const newUser: NewUser = {
      name,
      email: cleanEmail,
      password: hashedPassword,
      mobile: cleanMobile,
      address: address || null,
      profile_for: profile_for || null,
      gender: gender || null,
      marital_status: marital_status || null,
      mother_tongue: mother_tongue || null,
      height: height ? String(height) : null,
      weight: weight ? String(weight) : null,
      bio: bio || null,
      religion_id: religion_id ? Number(religion_id) : null,
      profession_id: profession_id ? Number(profession_id) : null,
      annual_income: annual_income ? String(annual_income) : null,
      date_of_birth: date_of_birth ? new Date(date_of_birth) : null,
      profile_photo: null, // ✅ FIX: no file upload in this JSON flow
      role: "user",
      status: "active", // so the session created below can log the user in right away
      email_verified_at: null,
      mobile_verified_at: null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const [insertedUser] = await db.insert(users).values(newUser).$returningId();

    // ✅ Direct login: create session using the returned id
    const sessionToken = await createUserSession(insertedUser.id);

    const res = NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: insertedUser.id,
          name: newUser.name,
          email: newUser.email,
          mobile: newUser.mobile,
        },
      },
      { status: 201 }
    );

    return setSessionCookie(res, sessionToken);

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
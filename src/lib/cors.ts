// src/lib/cors.ts (tumhara already sahi hai, bas ek chhota fix)
import { NextResponse } from "next/server";

const ALLOWED_ORIGINS = [
  "http://localhost:8100",
  "http://localhost:3000",
  "https://eliteweds.com",
  "https://localhost",
  "http://localhost",        // Android default (androidScheme not set)
  "capacitor://localhost",   // iOS default
];

export function corsHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Credentials"] = "true";
    headers["Vary"] = "Origin";
  }
  return headers;
}

export function jsonWithCors(
  origin: string | null,
  body: unknown,
  init?: { status?: number }
) {
  return NextResponse.json(body, {
    status: init?.status ?? 200,
    headers: corsHeaders(origin),
  });
}
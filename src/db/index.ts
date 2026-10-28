// src/db/index.ts
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "@/db/schema";

const pool = mysql.createPool({
  host:               process.env.DB_HOST     ?? "localhost",
  port:               Number(process.env.DB_PORT ?? 3306),
  user:               process.env.DB_USER     ?? "root",
  password:           process.env.DB_PASSWORD ?? "101Acres@2050",
  database:           process.env.DB_NAME     ?? "elitewedding",
  waitForConnections: true,
  connectionLimit:    10,
  timezone:           "Z", // ✅ FIX: force UTC — keeps Node Date vs MySQL NOW() consistent
});

export const db = drizzle(pool, { schema, mode: "default" });
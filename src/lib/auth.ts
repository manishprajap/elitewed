// src/lib/auth.ts
import { db } from "@/db";
import { users, userSessions } from "@/db/schema";
import { eq, and, gt, sql, desc } from "drizzle-orm";

/**
 * Get user by session token
 */
export async function getSessionUser(sessionToken?: string) {
  if (!sessionToken) return null;

  // ✅ FIX: compare against a JS Date (app server clock) instead of MySQL's NOW(),
  // so there's no timezone mismatch between Node and the DB server.
  const now = new Date();

  const result = await db
    .select({
      user: users,
    })
    .from(userSessions)
    .innerJoin(users, eq(users.id, userSessions.user_id))
    .where(
      and(
        eq(userSessions.session_token, sessionToken),
        gt(userSessions.expires_at, now) // ✅ FIX
      )
    )
    .limit(1);

  return result.length ? result[0].user : null;
}

export async function getActiveSessionsSummary() {
  const rows = await db.execute(sql`
    WITH latest_sessions AS (
      SELECT s1.user_id, s1.session_token, s1.expires_at
      FROM user_sessions s1
      INNER JOIN (
          SELECT user_id, MAX(created_at) AS latest_created
          FROM user_sessions
          WHERE expires_at > NOW()
          GROUP BY user_id
      ) s2 
      ON s1.user_id = s2.user_id 
      AND s1.created_at = s2.latest_created
    )
    SELECT 
        s.user_id,
        COUNT(*) AS active_sessions_count,
        MAX(ls.session_token) AS latest_session_token,
        MAX(ls.expires_at) AS latest_expires_at
    FROM user_sessions s
    LEFT JOIN latest_sessions ls ON s.user_id = ls.user_id
    WHERE s.expires_at > NOW()
    GROUP BY s.user_id
  `);

  return rows;
}
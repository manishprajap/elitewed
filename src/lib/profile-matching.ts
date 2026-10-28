// src/lib/profile-matching.ts
//
// Shared helpers for the partner-preference matching feature
// (src/app/api/profiles/match/route.ts and
//  src/app/api/profiles/[id]/route.ts).

/**
 * Converts an age-range string from the frontend ("21-25", "26-30",
 * "31-35", "36-40", "41+") into a date-of-birth window to query against.
 * Returns null if the string doesn't match a recognized shape.
 */
export function ageRangeToDobBounds(
  rangeStr: string
): { minDob: Date; maxDob: Date } | null {
  const today = new Date();

  const rangeMatch = rangeStr.match(/^(\d+)-(\d+)$/);
  const plusMatch = rangeStr.match(/^(\d+)\+$/);

  let minAge: number;
  let maxAge: number;

  if (rangeMatch) {
    minAge = Number(rangeMatch[1]);
    maxAge = Number(rangeMatch[2]);
  } else if (plusMatch) {
    minAge = Number(plusMatch[1]);
    maxAge = 120; // effectively "no upper bound"
  } else {
    return null;
  }

  // Someone who just turned `minAge` has the most recent birth date in
  // the window; someone about to turn `maxAge + 1` has the oldest.
  const maxDob = new Date(
    today.getFullYear() - minAge,
    today.getMonth(),
    today.getDate()
  );
  const minDob = new Date(
    today.getFullYear() - maxAge - 1,
    today.getMonth(),
    today.getDate() + 1
  );

  return { minDob, maxDob };
}

/**
 * Computes a person's current age in whole years from their
 * date_of_birth column (Date, string, or null).
 */
export function calculateAge(dob: Date | string | null | undefined): number | null {
  if (!dob) return null;

  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}
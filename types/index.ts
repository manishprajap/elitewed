// types/index.ts  — add these to your existing Profile type
export interface Profile {
  // … existing fields …
  dob?: string;
  weight?: string;
  mother_tongue?: string;
  caste?: string;
  sub_caste?: string;
  gotra?: string;
  manglik?: string;
  college?: string;
  employer?: string;
  work_city?: string;
  state?: string;
  native_place?: string;
  country?: string;
  willing_to_relocate?: boolean;
  diet?: string;
  smoking?: string;
  drinking?: string;
  differently_abled?: boolean;
  family_type?: string;
  family_status?: string;
  father_occupation?: string;
  mother_occupation?: string;
  siblings?: string;
  partner_pref?: {
    min_age: number;
    max_age: number;
    min_height: string;
    max_height: string;
    religion?: string;
    education?: string;
    min_income?: number;
    location?: string;
  };
}
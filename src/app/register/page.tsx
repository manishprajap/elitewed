"use client";

import { useState, ChangeEvent, useEffect } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type ProfileFor = "Self" | "Son" | "Daughter" | "Others" | "";
type Gender = "Male" | "Female" | "Other" | "";
type MaritalStatus = "Single" | "Divorced" | "Widowed" | "";

interface FormState {
  profile_for: ProfileFor;
  name: string;
  gender: Gender;
  date_of_birth: string;
  marital_status: MaritalStatus;
  religion_id: string;
  caste_id: string;
  mother_tongue: string;
  address: string;
  height: string;
  weight: string;
  education_id: string;
  profession_id: string;
  annual_income: string;
  bio: string;
  partner_age: string;
  partner_religion: string;
  partner_location: string;
  email: string;
  mobile: string;
  password: string;
  agree: boolean;
}

const initialForm: FormState = {
  profile_for: "",
  name: "",
  gender: "",
  date_of_birth: "",
  marital_status: "",
  religion_id: "",
  caste_id: "",
  mother_tongue: "",
  address: "",
  height: "",
  weight: "",
  education_id: "",
  profession_id: "",
  annual_income: "",
  bio: "",
  partner_age: "",
  partner_religion: "",
  partner_location: "",
  email: "",
  mobile: "",
  password: "",
  agree: false,
};

// ─── Validation per step ──────────────────────────────────────────────────────

function validateStep1(form: FormState): Partial<Record<keyof FormState, string>> {
  const errors: Partial<Record<keyof FormState, string>> = {};
  if (!form.profile_for) errors.profile_for = "Please select who this profile is for";
  if (!form.name.trim()) errors.name = "Full name is required";
  if (!form.gender) errors.gender = "Please select gender";
  if (!form.date_of_birth) errors.date_of_birth = "Date of birth is required";
  if (!form.marital_status) errors.marital_status = "Please select marital status";
  return errors;
}

function validateStep2(form: FormState): Partial<Record<keyof FormState, string>> {
  const errors: Partial<Record<keyof FormState, string>> = {};
  if (!form.religion_id) errors.religion_id = "Please select religion";
  if (!form.caste_id.trim()) errors.caste_id = "Community / Caste is required";
  if (!form.mother_tongue.trim()) errors.mother_tongue = "Mother tongue is required";
  if (!form.address.trim()) errors.address = "Address is required";
  if (!form.height) errors.height = "Height is required";
  if (!form.weight) errors.weight = "Weight is required";
  if (!form.education_id) errors.education_id = "Please select education level";
  if (!form.profession_id) errors.profession_id = "Please select profession";
  if (!form.annual_income) errors.annual_income = "Please select annual income";
  if (!form.bio.trim()) errors.bio = "Please write a short bio";
  return errors;
}

function validateStep3(form: FormState): Partial<Record<keyof FormState, string>> {
  const errors: Partial<Record<keyof FormState, string>> = {};
  if (!form.partner_age) errors.partner_age = "Please select partner age range";
  if (!form.partner_religion) errors.partner_religion = "Please select partner religion";
  if (!form.partner_location.trim()) errors.partner_location = "Preferred location is required";
  return errors;
}

function validateStep4(form: FormState): Partial<Record<keyof FormState, string>> {
  const errors: Partial<Record<keyof FormState, string>> = {};
  if (!form.email.trim()) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Enter a valid email address";
  if (!form.mobile.trim()) errors.mobile = "Mobile number is required";
  else if (!/^[6-9]\d{9}$/.test(form.mobile.replace(/\s/g, ""))) errors.mobile = "Enter a valid 10-digit mobile number";
  if (!form.password) errors.password = "Password is required";
  else if (form.password.length < 8) errors.password = "Password must be at least 8 characters";
  else if (!/(?=.*[0-9])(?=.*[^a-zA-Z0-9])/.test(form.password)) errors.password = "Include at least one number and one symbol";
  if (!form.agree) errors.agree = "You must agree to the Terms of Service";
  return errors;
}

const STEPS = ["Profile Info", "Personal Details", "Partner Preference", "Account Setup"];

// ─── Reusable sub-components ──────────────────────────────────────────────────

interface RadioGroupProps<T extends string> {
  options: T[];
  value: T | "";
  onChange: (val: T) => void;
  error?: string;
}

function RadioGroup<T extends string>({ options, value, onChange, error }: RadioGroupProps<T>) {
  return (
    <div>
      <div className="flex gap-2 flex-wrap">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`flex-1 min-w-[80px] py-2.5 px-3 rounded-xl border text-sm font-semibold transition-all duration-200 cursor-pointer
              ${value === opt
                ? "border-red-700 bg-red-50 text-red-700"
                : error
                ? "border-red-400 bg-red-50/40 text-amber-800 hover:border-red-500"
                : "border-orange-100 bg-orange-50/60 text-amber-800 hover:border-red-300"
              }`}
          >
            {opt}
          </button>
        ))}
      </div>
      {error && <p className="text-[11px] text-red-600 mt-1 font-medium">{error}</p>}
    </div>
  );
}

interface SelectFieldProps {
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  placeholder?: string;
  error?: string;
}

function SelectField({ name, value, onChange, options, placeholder = "Select", error }: SelectFieldProps) {
  return (
    <div>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-3.5 py-2.5 rounded-xl border-[1.5px] text-sm text-stone-900 outline-none transition-colors duration-200 font-['DM_Sans']
          ${error
            ? "border-red-400 bg-red-50/40 focus:border-red-600"
            : "border-orange-100 bg-orange-50/60 focus:border-red-700 focus:bg-white"
          }`}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      {error && <p className="text-[11px] text-red-600 mt-1 font-medium">{error}</p>}
    </div>
  );
}

interface DynamicSelectProps {
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  items: { id: number; name: string }[];
  placeholder?: string;
  error?: string;
}

function DynamicSelect({ name, value, onChange, items, placeholder = "Select", error }: DynamicSelectProps) {
  return (
    <div>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-3.5 py-2.5 rounded-xl border-[1.5px] text-sm text-stone-900 outline-none transition-colors duration-200 font-['DM_Sans']
          ${error
            ? "border-red-400 bg-red-50/40 focus:border-red-600"
            : "border-orange-100 bg-orange-50/60 focus:border-red-700 focus:bg-white"
          }`}
      >
        <option value="">{placeholder}</option>
        {items.map((item) => (
          <option key={item.id} value={item.id}>{item.name}</option>
        ))}
      </select>
      {error && <p className="text-[11px] text-red-600 mt-1 font-medium">{error}</p>}
    </div>
  );
}

interface InputFieldProps {
  name: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  hint?: string;
  error?: string;
}

function InputField({ name, type = "text", value, onChange, placeholder, hint, error }: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-3.5 py-2.5 rounded-xl border-[1.5px] text-sm text-stone-900 outline-none placeholder:text-stone-400 transition-colors duration-200 font-['DM_Sans']
          ${error
            ? "border-red-400 bg-red-50/40 focus:border-red-600"
            : "border-orange-100 bg-orange-50/60 focus:border-red-700 focus:bg-white"
          }`}
      />
      {hint && !error && <span className="text-[11px] text-amber-700/70">{hint}</span>}
      {error && <p className="text-[11px] text-red-600 font-medium">{error}</p>}
    </div>
  );
}

interface FieldWrapProps {
  label: string;
  children: React.ReactNode;
  full?: boolean;
  required?: boolean;
}

function FieldWrap({ label, children, full, required }: FieldWrapProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${full ? "col-span-2" : ""}`}>
      <label className="text-[12px] font-semibold text-stone-700 tracking-wide uppercase">
        {label}
        {required && <span className="text-red-600 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

// ─── Step Props ───────────────────────────────────────────────────────────────

interface StepProps {
  form: FormState;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  setField: <K extends keyof FormState>(key: K, val: FormState[K]) => void;
  onNext: () => void;
  onBack?: () => void;
  religions?: { id: number; name: string }[];
  professions?: { id: number; name: string }[];
  errors?: Partial<Record<keyof FormState, string>>;
}

// ─── Step 1 ───────────────────────────────────────────────────────────────────

function Step1({ form, onChange, setField, onNext, errors = {} }: StepProps) {
  return (
    <div>
      <h2 className="font-['Playfair_Display'] text-2xl font-bold text-stone-900 mb-1">Who is this profile for?</h2>
      <p className="text-sm text-amber-800/70 mb-5 leading-relaxed">Tell us the basic profile information to get started.</p>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <FieldWrap label="Profile Created For" full required>
          <RadioGroup<ProfileFor>
            options={["Self", "Son", "Daughter", "Others"]}
            value={form.profile_for}
            onChange={(v) => setField("profile_for", v)}
            error={errors.profile_for}
          />
        </FieldWrap>

        <FieldWrap label="Full Name" full required>
          <InputField
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="e.g. Rahul Kumar Sharma"
            error={errors.name}
          />
        </FieldWrap>

        <FieldWrap label="Gender" full required>
          <RadioGroup<Gender>
            options={["Male", "Female", "Other"]}
            value={form.gender}
            onChange={(v) => setField("gender", v)}
            error={errors.gender}
          />
        </FieldWrap>

        <FieldWrap label="Date of Birth" required>
          <div>
            <input
              name="date_of_birth"
              type="date"
              value={form.date_of_birth}
              onChange={onChange}
              className={`w-full px-3.5 py-2.5 rounded-xl border-[1.5px] text-sm text-stone-900 outline-none transition-colors duration-200
                ${errors.date_of_birth
                  ? "border-red-400 bg-red-50/40 focus:border-red-600"
                  : "border-orange-100 bg-orange-50/60 focus:border-red-700 focus:bg-white"
                }`}
            />
            {errors.date_of_birth && <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.date_of_birth}</p>}
          </div>
        </FieldWrap>

        <FieldWrap label="Marital Status" required>
          <SelectField
            name="marital_status"
            value={form.marital_status}
            onChange={onChange}
            options={["Single","Married", "Divorced", "Widowed"]}
            placeholder="Select status"
            error={errors.marital_status}
          />
        </FieldWrap>
      </div>

      <button
        type="button"
        onClick={onNext}
        className="w-full py-3 rounded-full bg-gradient-to-r from-red-800 to-red-500 text-white font-semibold text-sm tracking-wide shadow-lg shadow-red-800/25 hover:-translate-y-0.5 hover:shadow-red-800/40 transition-all duration-200"
      >
        Continue →
      </button>
    </div>
  );
}

// ─── Step 2 ───────────────────────────────────────────────────────────────────

function Step2({ form, onChange, onNext, onBack, religions = [], professions = [], errors = {} }: StepProps) {
  return (
    <div>
      <h2 className="font-['Playfair_Display'] text-2xl font-bold text-stone-900 mb-1">Personal Details</h2>
      <p className="text-sm text-amber-800/70 mb-5 leading-relaxed">Help us understand your background — this improves match quality.</p>

      <div className="grid grid-cols-2 gap-4 mb-5">

        <FieldWrap label="Religion" required>
          <DynamicSelect
            name="religion_id"
            value={form.religion_id || ""}
            onChange={onChange}
            items={religions}
            placeholder="Select religion"
            error={errors.religion_id}
          />
        </FieldWrap>

        <FieldWrap label="Community / Caste" required>
          <InputField name="caste_id" value={form.caste_id} onChange={onChange}
            placeholder="e.g. Brahmin, Ansari..." error={errors.caste_id} />
        </FieldWrap>

        <FieldWrap label="Mother Tongue" required>
          <InputField name="mother_tongue" value={form.mother_tongue} onChange={onChange}
            placeholder="e.g. Hindi, Urdu, Tamil" error={errors.mother_tongue} />
        </FieldWrap>

        <FieldWrap label="Address / Location" required>
          <InputField name="address" value={form.address} onChange={onChange}
            placeholder="City, State" error={errors.address} />
        </FieldWrap>

        <FieldWrap label="Height (cm)" required>
          <InputField name="height" type="number" value={form.height} onChange={onChange}
            placeholder="e.g. 168" error={errors.height} />
        </FieldWrap>

        <FieldWrap label="Weight (kg)" required>
          <InputField name="weight" type="number" value={form.weight} onChange={onChange}
            placeholder="e.g. 65" error={errors.weight} />
        </FieldWrap>

        <FieldWrap label="Education Level" required>
          <SelectField
            name="education_id"
            value={form.education_id}
            onChange={onChange}
            options={["High School", "Graduate (BA/BSc/BCom)", "Post Graduate", "MBA / MCA", "Engineering", "Medical / MBBS", "PhD / Doctorate"]}
            placeholder="Select degree"
            error={errors.education_id}
          />
        </FieldWrap>

        <FieldWrap label="Profession" required>
          <DynamicSelect
            name="profession_id"
            value={form.profession_id || ""}
            onChange={onChange}
            items={professions}
            placeholder="Select profession"
            error={errors.profession_id}
          />
        </FieldWrap>

        <FieldWrap label="Annual Income" full required>
          <SelectField
            name="annual_income"
            value={form.annual_income}
            onChange={onChange}
            options={["Below ₹2 Lakh", "₹2–5 Lakh", "₹5–10 Lakh", "₹10–20 Lakh", "Above ₹20 Lakh", "Prefer not to say"]}
            placeholder="Select income range"
            error={errors.annual_income}
          />
        </FieldWrap>

        <FieldWrap label="About Yourself (Bio)" full required>
          <div>
            <textarea
              name="bio"
              value={form.bio}
              onChange={onChange}
              rows={3}
              placeholder="Write a short bio about yourself — your values, interests, what you're looking for..."
              className={`w-full px-3.5 py-2.5 rounded-xl border-[1.5px] text-sm text-stone-900 outline-none placeholder:text-stone-400 transition-colors duration-200 resize-y font-['DM_Sans']
                ${errors.bio
                  ? "border-red-400 bg-red-50/40 focus:border-red-600"
                  : "border-orange-100 bg-orange-50/60 focus:border-red-700 focus:bg-white"
                }`}
            />
            {errors.bio && <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.bio}</p>}
          </div>
        </FieldWrap>
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={onBack}
          className="px-6 py-3 rounded-full border-[1.5px] border-orange-100 bg-white text-sm font-semibold text-amber-800 hover:border-red-700 hover:text-red-700 transition-all duration-200">
          ← Back
        </button>
        <button type="button" onClick={onNext}
          className="flex-1 py-3 rounded-full bg-gradient-to-r from-red-800 to-red-500 text-white font-semibold text-sm shadow-lg shadow-red-800/25 hover:-translate-y-0.5 hover:shadow-red-800/40 transition-all duration-200">
          Continue →
        </button>
      </div>
    </div>
  );
}

// ─── Step 3 ───────────────────────────────────────────────────────────────────

function Step3({ form, onChange, onNext, onBack, errors = {} }: StepProps) {
  return (
    <div>
      <h2 className="font-['Playfair_Display'] text-2xl font-bold text-stone-900 mb-1">Partner Preferences</h2>
      <p className="text-sm text-amber-800/70 mb-5 leading-relaxed">Describe your ideal life partner — these preferences power our smart matching.</p>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <FieldWrap label="Partner's Age Range" required>
          <SelectField name="partner_age" value={form.partner_age} onChange={onChange}
            options={["18–24 yrs", "25–29 yrs", "30–34 yrs", "35–40 yrs", "40+ yrs", "Any Age"]}
            placeholder="Select age range" error={errors.partner_age} />
        </FieldWrap>

        <FieldWrap label="Partner's Religion" required>
          <SelectField name="partner_religion" value={form.partner_religion} onChange={onChange}
            options={["Same as mine", "Hindu", "Muslim", "Sikh", "Christian", "Any Religion"]}
            placeholder="Select religion" error={errors.partner_religion} />
        </FieldWrap>

        <FieldWrap label="Preferred Location" full required>
          <InputField name="partner_location" value={form.partner_location} onChange={onChange}
            placeholder="e.g. UP, Delhi, Anywhere in India" error={errors.partner_location} />
        </FieldWrap>
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={onBack}
          className="px-6 py-3 rounded-full border-[1.5px] border-orange-100 bg-white text-sm font-semibold text-amber-800 hover:border-red-700 hover:text-red-700 transition-all duration-200">
          ← Back
        </button>
        <button type="button" onClick={onNext}
          className="flex-1 py-3 rounded-full bg-gradient-to-r from-red-800 to-red-500 text-white font-semibold text-sm shadow-lg shadow-red-800/25 hover:-translate-y-0.5 hover:shadow-red-800/40 transition-all duration-200">
          Continue →
        </button>
      </div>
    </div>
  );
}

// ─── Step 4 ───────────────────────────────────────────────────────────────────

function Step4({ form, onChange, setField, onBack, errors = {} }: StepProps) {
  return (
    <div>
      <h2 className="font-['Playfair_Display'] text-2xl font-bold text-stone-900 mb-1">Create Your Account</h2>
      <p className="text-sm text-amber-800/70 mb-5 leading-relaxed">One final step — set up your secure login credentials.</p>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <FieldWrap label="Email Address" full required>
          <InputField name="email" type="email" value={form.email} onChange={onChange}
            placeholder="email@example.com" hint="Used for login & notifications" error={errors.email} />
        </FieldWrap>

        <FieldWrap label="Mobile Number" full required>
          <InputField name="mobile" type="tel" value={form.mobile} onChange={onChange}
            placeholder="98765 43210" hint="For OTP verification" error={errors.mobile} />
        </FieldWrap>

        <FieldWrap label="Create Password" full required>
          <InputField name="password" type="password" value={form.password} onChange={onChange}
            placeholder="Min. 8 characters — include a number & symbol" error={errors.password} />
        </FieldWrap>

        <div className="col-span-2">
          <label className="flex items-start gap-2.5 cursor-pointer text-sm text-amber-800/80 leading-relaxed">
            <input
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={(e) => setField("agree", e.target.checked)}
              className="mt-0.5 accent-red-700 flex-shrink-0 w-4 h-4"
            />
            <span>
              I agree to the{" "}
              <Link href="#" className="text-red-700 font-semibold hover:underline">Terms of Service</Link>
              {" "}and{" "}
              <Link href="#" className="text-red-700 font-semibold hover:underline">Privacy Policy</Link>.
            </span>
          </label>
          {errors.agree && <p className="text-[11px] text-red-600 mt-1 font-medium ml-6">{errors.agree}</p>}
        </div>
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={onBack}
          className="px-6 py-3 rounded-full border-[1.5px] border-orange-100 bg-white text-sm font-semibold text-amber-800 hover:border-red-700 hover:text-red-700 transition-all duration-200">
          ← Back
        </button>
        <button
          type="submit"
          className="flex-1 py-3 rounded-full bg-gradient-to-r from-red-800 to-red-500 text-white font-semibold text-sm shadow-lg shadow-red-800/25 hover:-translate-y-0.5 hover:shadow-red-800/40 transition-all duration-200"
        >
          🎉 Register Free!
        </button>
      </div>

      <p className="text-center text-xs text-amber-800/60 mt-4">
        Already have an account?{" "}
        <Link href="/login" className="text-red-700 font-semibold hover:underline">Login Here</Link>
      </p>
    </div>
  );
}

// ─── Success Screen ───────────────────────────────────────────────────────────

function SuccessScreen({ email }: { email: string }) {
  return (
    <div className="text-center py-12 px-4">
      <div className="text-5xl mb-4">🎉</div>
      <h2 className="font-['Playfair_Display'] text-2xl font-bold text-stone-900 mb-2">
        Welcome to Elite Wedding!
      </h2>
      <p className="text-sm text-amber-800/70 leading-relaxed max-w-xs mx-auto">
        Your profile has been created successfully. We&apos;ve sent a verification link to{" "}
        <strong className="text-stone-900">{email || "your email"}</strong>.
      </p>
      <Link
        href="/"
        className="inline-block mt-6 px-8 py-3 rounded-full bg-gradient-to-r from-red-800 to-red-500 text-white font-semibold text-sm shadow-lg shadow-red-800/25 hover:-translate-y-0.5 transition-all duration-200"
      >
        Go to Dashboard →
      </Link>
    </div>
  );
}

// ─── Step Indicator ───────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center mb-8">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const isActive = current === n;
        const isDone = current > n;
        return (
          <div key={label} className="flex items-center flex-1">
            <div className="flex items-center gap-1.5">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 border-[1.5px] transition-all duration-300
                  ${isActive ? "border-red-700 bg-red-700 text-white"
                    : isDone ? "border-emerald-600 bg-emerald-600 text-white"
                    : "border-orange-100 bg-white text-amber-300"}`}
              >
                {isDone ? "✓" : n}
              </div>
              <span
                className={`text-[10px] font-semibold whitespace-nowrap hidden sm:block
                  ${isActive ? "text-red-700" : isDone ? "text-emerald-600" : "text-amber-300"}`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-[1.5px] mx-2 min-w-[10px] transition-colors duration-300 ${isDone ? "bg-emerald-400" : "bg-orange-100"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Left Panel ───────────────────────────────────────────────────────────────

function LeftPanel() {
  return (
    <div className="relative bg-gradient-to-br from-red-800 to-red-950 p-12 flex flex-col justify-between overflow-hidden">
      <div className="absolute right-[-60px] bottom-[-60px] w-56 h-56 rounded-full bg-white/5" />
      <div className="absolute right-[-20px] top-[-40px] w-36 h-36 rounded-full bg-white/4" />
      <div className="absolute left-[-40px] bottom-40 w-24 h-24 rounded-full bg-white/[0.03]" />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-9">
          <span className="text-2xl text-white/70">♡</span>
          <span className="font-['Playfair_Display'] text-xl font-bold text-white">
            Elite<span className="text-white/60">Wedding</span>
          </span>
        </div>
        <h2 className="font-['Playfair_Display'] text-3xl font-bold text-white leading-tight mb-8">
          Begin a New Chapter<br />of{" "}
          <em className="text-white/70 font-normal">Your Life&apos;s Journey</em>
        </h2>
        <ul className="flex flex-col gap-3 mb-9">
          {["Completely Free Registration", "5 Lakh+ Verified Profiles", "Smart AI Matching", "100% Privacy Protected", "200+ Communities Covered"].map((perk) => (
            <li key={perk} className="flex items-center gap-2.5 text-sm text-white/75 font-medium">
              <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[9px] text-white flex-shrink-0">✓</span>
              {perk}
            </li>
          ))}
        </ul>
        <blockquote className="border-l-2 border-white/20 pl-3 italic text-xs text-white/40 leading-relaxed">
          &ldquo;Every relationship is a new story waiting to be told.&rdquo;
        </blockquote>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const [step, setStep] = useState<number>(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [religions, setReligions] = useState<{ id: number; name: string }[]>([]);
  const [professions, setProfessions] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((res) => {
        if (!res.success) return;
        const data = res.data;
        console.log("Fetched categories:", data);
        console.log("Available keys:", Object.keys(data));

        // find the key regardless of case/pluralization
        const findKey = (obj: Record<string, unknown>, name: string) =>
          Object.keys(obj).find((k) => k.toLowerCase().replace(/s$/, "") === name.toLowerCase());

        const religionKey = findKey(data, "Religion");
        const professionKey = findKey(data, "Profession");

        setReligions(religionKey && Array.isArray(data[religionKey]) ? data[religionKey] : []);
        setProfessions(professionKey && Array.isArray(data[professionKey]) ? data[professionKey] : []);
      })
      .catch(console.error);
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const val = target.type === "checkbox" ? target.checked : target.value;
    setForm((prev) => ({ ...prev, [target.name]: val }));
    // ✅ Clear error for this field on change
    setErrors((prev) => ({ ...prev, [target.name]: undefined }));
  };

  const setField = <K extends keyof FormState>(key: K, val: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    // ✅ Clear error for this field on change
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  // ✅ Validate before advancing — blocks progression if errors exist
  const handleNext = () => {
    let stepErrors: Partial<Record<keyof FormState, string>> = {};
    if (step === 1) stepErrors = validateStep1(form);
    if (step === 2) stepErrors = validateStep2(form);
    if (step === 3) stepErrors = validateStep3(form);

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setErrors({});
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setErrors({});
    setStep((s) => s - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const stepErrors = validateStep4(form);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
if (!res.ok) {
  alert(data.message || data.error || "Registration failed");
  return;
}
setSubmitted(true);
setTimeout(() => {
  window.location.href = "/"; // session cookie set hai, login skip
}, 1800);
    } catch (error) {
      console.error("API Error:", error);
      alert("Something went wrong");
    }
  };

  const stepProps: StepProps = {
    form,
    onChange: handleChange,
    setField,
    onNext: handleNext,
    onBack: handleBack,
    religions,
    professions,
    errors,
  };

  return (
    <main className="min-h-screen bg-orange-50/60 flex items-center justify-center p-4 md:p-8 font-['DM_Sans']">
      <div className="w-full max-w-[1020px] rounded-3xl overflow-hidden shadow-2xl shadow-red-950/15 border border-orange-100 grid grid-cols-1 md:grid-cols-[340px_1fr]">
        <div className="hidden md:block">
          <LeftPanel />
        </div>
        <div className="bg-white px-6 py-8 md:px-10 md:py-10 overflow-y-auto max-h-screen">
          <div className="flex items-center gap-2 mb-6 md:hidden">
            <span className="text-xl text-red-700">♡</span>
            <span className="font-['Playfair_Display'] text-lg font-bold text-stone-900">
              Elite<span className="text-stone-400">Wedding</span>
            </span>
          </div>
          {!submitted ? (
            <form onSubmit={handleSubmit} noValidate>
              <StepIndicator current={step} />
              {step === 1 && <Step1 {...stepProps} />}
              {step === 2 && <Step2 {...stepProps} />}
              {step === 3 && <Step3 {...stepProps} />}
              {step === 4 && <Step4 {...stepProps} />}
            </form>
          ) : (
            <SuccessScreen email={form.email} />
          )}
        </div>
      </div>
    </main>
  );
}
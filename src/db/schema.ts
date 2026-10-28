import {
  mysqlTable,
  bigint,
  varchar,
  timestamp,
  int,
  text,
  date,
  boolean,
  decimal,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";


export const categories = mysqlTable("categories", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  name: varchar("name", { length: 150 }).notNull().unique(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const sub_categories = mysqlTable("sub_categories", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  category_id: bigint("category_id", { mode: "number" }).notNull(), // FK → categories
  name: varchar("name", { length: 150 }).notNull(),
  status: boolean("status").default(true),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// ═══════════════════════════════════════════════════════════
//  ADMINS
// ═══════════════════════════════════════════════════════════

export const admins = mysqlTable("admins", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  name: varchar("name", { length: 150 }).notNull(),
  email: varchar("email", { length: 150 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  role: mysqlEnum("role", ["superadmin", "admin", "moderator"]).default("admin"),
  created_at: timestamp("created_at").defaultNow(),
});

// ═══════════════════════════════════════════════════════════
//  USERS  (core table)
// ═══════════════════════════════════════════════════════════

export const users = mysqlTable("users", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),

  // ── Auth ──
  name: varchar("full_name", { length: 150 }).notNull(),
  email: varchar("email", { length: 150 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(), // bcrypt hash
  mobile: varchar("mobile", { length: 20 }).unique(),

  // ── Profile ──
  profile_for: mysqlEnum("profile_for", ["self", "son", "daughter", "brother", "sister", "friend"]),
  gender: mysqlEnum("gender", ["male", "female", "other"]),
  date_of_birth: date("date_of_birth"),
  marital_status: mysqlEnum("marital_status", ["Married", "Divorced", "Widowed", "Single"]),
  mother_tongue: varchar("mother_tongue", { length: 100 }),
  height: varchar("height", { length: 20 }),   // e.g. "5'8\""
  weight: varchar("weight", { length: 20 }),   // e.g. "70 kg"
  annual_income: decimal("annual_income", { precision: 12, scale: 2 }), // proper money type
  address: varchar("address", { length: 255 }),
  profile_photo: varchar("profile_photo", { length: 255 }),
  bio: text("bio"),
profession_id: bigint("profession_id", { mode: "number" }), 
religion_id: bigint("religion_id", { mode: "number" }),   
caste_id: bigint("caste_id", { mode: "number" }),   
education_id: bigint("education_id", { mode: "number" }),   
  // ── Account ──
  role: mysqlEnum("role", ["user", "premium", "admin"]).default("user"),
  status: mysqlEnum("status", ["active", "inactive", "banned", "pending"]).default("pending"),
  email_verified_at: timestamp("email_verified_at"),
  mobile_verified_at: timestamp("mobile_verified_at"),
 otp: varchar("otp", { length: 6 }),
  otpExpiresAt: timestamp("otp_expires_at"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// ═══════════════════════════════════════════════════════════
//  USER SESSIONS
// ═══════════════════════════════════════════════════════════

export const userSessions = mysqlTable("user_sessions", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  user_id: bigint("user_id", { mode: "number" }).notNull(), // FK → users
  session_token: varchar("session_token", { length: 255 }).notNull().unique(),
  ip_address: varchar("ip_address", { length: 45 }),
  user_agent: text("user_agent"),
  expires_at: timestamp("expires_at").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

// ═══════════════════════════════════════════════════════════
//  INTERESTS  (who sent interest to whom)
// ═══════════════════════════════════════════════════════════

export const interests = mysqlTable("interests", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  sender_id: bigint("sender_id", { mode: "number" }).notNull(),   // FK → users
  receiver_id: bigint("receiver_id", { mode: "number" }).notNull(), // FK → users
  status: mysqlEnum("status", ["pending", "accepted", "rejected"]).default("pending"),
  message: text("message"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// ═══════════════════════════════════════════════════════════
//  SUBSCRIPTIONS / PLANS
// ═══════════════════════════════════════════════════════════

export const plans = mysqlTable("plans", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull(),          // "Gold", "Platinum"
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  duration_days: int("duration_days").notNull(),                     // 30, 90, 365
  features: text("features"),                                    // JSON string
  status: boolean("status").default(true),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const subscriptions = mysqlTable("subscriptions", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  user_id: bigint("user_id", { mode: "number" }).notNull(), // FK → users
  plan_id: bigint("plan_id", { mode: "number" }).notNull(), // FK → plans
  starts_at: timestamp("starts_at").notNull(),
  expires_at: timestamp("expires_at").notNull(),
  status: mysqlEnum("status", ["active", "expired", "cancelled"]).default("active"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// ═══════════════════════════════════════════════════════════
//  PAYMENTS
// ═══════════════════════════════════════════════════════════

export const payments = mysqlTable("payments", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  user_id: bigint("user_id", { mode: "number" }).notNull(),         // FK → users
  subscription_id: bigint("subscription_id", { mode: "number" }),           // FK → subscriptions
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("INR"),
  payment_method: varchar("payment_method", { length: 50 }),               // "razorpay", "upi"
  transaction_id: varchar("transaction_id", { length: 255 }).unique(),
  status: mysqlEnum("status", ["pending", "success", "failed", "refunded"]).default("pending"),
  paid_at: timestamp("paid_at"),
  created_at: timestamp("created_at").defaultNow(),
});

// ═══════════════════════════════════════════════════════════
//  REPORTS  (flagged profiles)
// ═══════════════════════════════════════════════════════════

export const reports = mysqlTable("reports", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  reporter_id: bigint("reporter_id", { mode: "number" }).notNull(),  // FK → users
  reported_id: bigint("reported_id", { mode: "number" }).notNull(),  // FK → users
  reason: varchar("reason", { length: 255 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["pending", "reviewed", "dismissed", "action_taken"]).default("pending"),
  reviewed_by: bigint("reviewed_by", { mode: "number" }),             // FK → admins
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// ═══════════════════════════════════════════════════════════
//  RELATIONS
// ═══════════════════════════════════════════════════════════

// religions → castes
export const religionRelations = relations(categories, ({ many }) => ({
  users: many(users),
}));



// categories → sub_categories
export const categoryRelations = relations(categories, ({ many }) => ({
  sub_categories: many(sub_categories),
}));

export const subCategoryRelations = relations(sub_categories, ({ one }) => ({
  category: one(categories, { fields: [sub_categories.category_id], references: [categories.id] }),
}));

// users → (education, profession, religion, caste)
export const userRelations = relations(users, ({ one, many }) => ({
  education: one(categories, { fields: [users.education_id], references: [categories.id] }),
  profession: one(categories, { fields: [users.profession_id], references: [categories.id] }),
  religion: one(categories, { fields: [users.religion_id], references: [categories.id] }),
  caste: one(categories, { fields: [users.caste_id], references: [categories.id] }),
  sessions: many(userSessions),
  sentInterests: many(interests, { relationName: "sender" }),
  receivedInterests: many(interests, { relationName: "receiver" }),
  subscriptions: many(subscriptions),
  payments: many(payments),
  reportsMade: many(reports, { relationName: "reporter" }),
  reportsAgainst: many(reports, { relationName: "reported" }),
}));

export const professionRelations = relations(categories, ({ many }) => ({ users: many(users) }));

// userSessions → users
export const userSessionRelations = relations(userSessions, ({ one }) => ({
  user: one(users, { fields: [userSessions.user_id], references: [users.id] }),
}));

// interests → users
export const interestRelations = relations(interests, ({ one }) => ({
  sender: one(users, { fields: [interests.sender_id], references: [users.id], relationName: "sender" }),
  receiver: one(users, { fields: [interests.receiver_id], references: [users.id], relationName: "receiver" }),
}));

// subscriptions → users & plans
export const subscriptionRelations = relations(subscriptions, ({ one, many }) => ({
  user: one(users, { fields: [subscriptions.user_id], references: [users.id] }),
  plan: one(plans, { fields: [subscriptions.plan_id], references: [plans.id] }),
  payments: many(payments),
}));

export const planRelations = relations(plans, ({ many }) => ({
  subscriptions: many(subscriptions),
}));

// payments → users & subscriptions
export const paymentRelations = relations(payments, ({ one }) => ({
  user: one(users, { fields: [payments.user_id], references: [users.id] }),
  subscription: one(subscriptions, { fields: [payments.subscription_id], references: [subscriptions.id] }),
}));

// reports → users & admins
export const reportRelations = relations(reports, ({ one }) => ({
  reporter: one(users, { fields: [reports.reporter_id], references: [users.id], relationName: "reporter" }),
  reported: one(users, { fields: [reports.reported_id], references: [users.id], relationName: "reported" }),
  reviewedBy: one(admins, { fields: [reports.reviewed_by], references: [admins.id] }),
}));
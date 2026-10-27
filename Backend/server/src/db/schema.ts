import {
  boolean,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", [
  "admin",
  "issuer",
  "holder",
  "verifier",
]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  clerkId: varchar("clerk_id", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  role: userRole("role").notNull(),
  institutionName: varchar("institution_name", { length: 255 }),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const certificates = pgTable("certificates", {
  id: serial("id").primaryKey(),
  certificateId: varchar("certificate_id", { length: 100 }).notNull().unique(),
  studentName: varchar("student_name", { length: 255 }).notNull(),
  course: varchar("course", { length: 255 }).notNull(),
  certificateHash: text("certificate_hash").notNull(),
  blockchainTxHash: text("blockchain_tx_hash"),
  issuedAt: timestamp("issued_at").defaultNow(),
});

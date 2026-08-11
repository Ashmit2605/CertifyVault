import { pgTable, serial, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const certificates = pgTable("certificates", {
  id: serial("id").primaryKey(),
  certificateId: varchar("certificate_id", { length: 100 }).notNull().unique(),
  studentName: varchar("student_name", { length: 255 }).notNull(),
  course: varchar("course", { length: 255 }).notNull(),
  certificateHash: text("certificate_hash").notNull(),
  blockchainTxHash: text("blockchain_tx_hash"),
  issuedAt: timestamp("issued_at").defaultNow(),
});

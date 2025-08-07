import { integer, pgTable, varchar, boolean, text, timestamp } from "drizzle-orm/pg-core";

export const todos = pgTable("todos", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: varchar("title", { length: 255 }).notNull(),
  description: varchar("description", { length: 1024 }).notNull(),
  isCompleted: boolean("is_completed").notNull().default(false),
  images: text('images').array().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
import { sql } from 'drizzle-orm';
import { sqliteTable as table } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";

export const plannedTransaction = table("planned_transaction", {
  id: t.int( { mode: 'number' } ).primaryKey({ autoIncrement: true }),
  created_at: t.text().default(sql`(current_timestamp)`),
  date: t.int({ mode: 'timestamp' }),
  category: t.text().notNull(),
  description: t.text().notNull(),
  amount: t.numeric().notNull(),
  is_recurring: t.integer({ mode: 'boolean' }).notNull(),
  frequency: t.text().$type<"DAILY" | "WEEKLY" | "MONTHLY">().default("MONTHLY"),
  executed: t.integer({ mode: 'boolean' }).notNull(),
  last_execution_date: t.text(),
});

export const transaction = table("transaction", {
  id: t.int().primaryKey({ autoIncrement: true }),
  created_at: t.text().notNull().default(sql`(current_timestamp)`),
  category: t.text().notNull(),
  description: t.text().notNull(),
  amount: t.numeric().notNull(),
  type: t.text().$type<"INCOME" | "EXPENSE">().default("EXPENSE"),
  payment_method: t.text().$type<"CASH" | "CARD">().default("CASH"),
});

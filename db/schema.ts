import { sql } from 'drizzle-orm';
import { sqliteTable as table } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";

export const plannedTransaction = table("planned_transaction", {
  id: t.int().primaryKey({ autoIncrement: true }),
  createdAt: t.text('created_at').default(sql`(current_timestamp)`),
  category: t.text().notNull(),
  description: t.text().notNull(),
  amount: t.numeric().notNull(),
  recurring: t.integer({ mode: 'boolean' }).notNull(),
  frequency: t.text().$type<"DAILY" | "WEEKLY" | "MONTHLY">().default("MONTHLY"),
  executed: t.integer({ mode: 'boolean' }).notNull(),
  lastExecutionDate: t.text('last_execution_date'),
});

export const transaction = table("transaction", {
  id: t.int().primaryKey({ autoIncrement: true }),
  createdAt: t.text('created_at').notNull().default(sql`(current_timestamp)`),
  category: t.text().notNull(),
  description: t.text().notNull(),
  amount: t.numeric().notNull(),
  type: t.text().$type<"INCOME" | "EXPENSE">().default("EXPENSE"),
  paymentMethod: t.text('payment_method').$type<"CASH" | "CARD">().default("CASH"),
});

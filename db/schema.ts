/* eslint-disable @typescript-eslint/no-require-imports */
import { sqliteTableCreator } from 'drizzle-orm/sqlite-core';
import * as t from 'drizzle-orm/sqlite-core';

const table = sqliteTableCreator((name) => name);

// ==================== CATEGORIES ====================
export const categories = table(
  'categories',
  {
    id: t
      .text()
      .primaryKey()
      .$defaultFn(() => {
        const { randomUUID } = require('expo-crypto');
        return randomUUID();
      }),
    name: t.text().notNull(),
    color: t.text().notNull(),
    icon: t.text(),
    type: t.text().$type<'INCOME' | 'EXPENSE'>().notNull(),
    isDefault: t.integer('is_default', { mode: 'boolean' }).notNull().default(false),
    isDeleted: t.integer('is_deleted', { mode: 'boolean' }).notNull().default(false),
    deletedAt: t.integer('deleted_at', { mode: 'timestamp' }),
    createdAt: t.integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  },
  (table) => [t.uniqueIndex('categories_name_type_unique').on(table.name, table.type)]
);

// ==================== TRANSACTIONS ====================
export const transactions = table(
  'transactions',
  {
    id: t
      .text()
      .primaryKey()
      .$defaultFn(() => {
        const { randomUUID } = require('expo-crypto');
        return randomUUID();
      }),
    plannedTransactionId: t.text('planned_transaction_id').references(() => plannedTransactions.id),
    categoryId: t
      .text('category_id')
      .notNull()
      .references(() => categories.id),
    description: t.text().notNull(),
    amount: t.integer().notNull(),
    type: t.text().$type<'INCOME' | 'EXPENSE'>().notNull(),
    paymentMethod: t
      .text('payment_method')
      .$type<'CASH' | 'BANK' | 'MOBILE_MONEY' | 'OTHER'>()
      .notNull(),
    paymentDetails: t.text('payment_details'),
    transactionDate: t.integer('transaction_date', { mode: 'timestamp' }).notNull(),
    isDeleted: t.integer('is_deleted', { mode: 'boolean' }).notNull().default(false),
    deletedAt: t.integer('deleted_at', { mode: 'timestamp' }),
    createdAt: t.integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  },
  (table) => [
    t.index('transaction_category_idx').on(table.categoryId),
    t.index('transaction_date_idx').on(table.transactionDate),
    t.index('transaction_type_idx').on(table.type),
    t.index('transaction_planned_idx').on(table.plannedTransactionId),
    t.index('transaction_deleted_idx').on(table.isDeleted),
  ]
);

// ==================== PLANNED TRANSACTIONS ====================
export const plannedTransactions = table(
  'planned_transactions',
  {
    id: t
      .text()
      .primaryKey()
      .$defaultFn(() => {
        const { randomUUID } = require('expo-crypto');
        return randomUUID();
      }),
    categoryId: t
      .text('category_id')
      .notNull()
      .references(() => categories.id),
    description: t.text().notNull(),
    amount: t.integer().notNull(),
    type: t.text().$type<'INCOME' | 'EXPENSE'>().notNull(),
    recurring: t.integer({ mode: 'boolean' }).notNull().default(false),
    frequency: t.text().$type<'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'>().notNull(),
    startDate: t.integer('start_date', { mode: 'timestamp' }).notNull(),
    endDate: t.integer('end_date', { mode: 'timestamp' }),
    nextExecutionDate: t.integer('next_execution_date', { mode: 'timestamp' }),
    isActive: t.integer('is_active', { mode: 'boolean' }).notNull().default(true),
    isDeleted: t.integer('is_deleted', { mode: 'boolean' }).notNull().default(false),
    deletedAt: t.integer('deleted_at', { mode: 'timestamp' }),
    createdAt: t.integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  },
  (table) => [
    t.index('planned_category_idx').on(table.categoryId),
    t.index('planned_next_execution_idx').on(table.nextExecutionDate),
    t.index('planned_active_idx').on(table.isActive),
    t.index('planned_deleted_idx').on(table.isDeleted),
  ]
);

// ==================== PLANNED TRANSACTION EXECUTIONS ====================
export const plannedTransactionExecutions = table(
  'planned_transaction_executions',
  {
    id: t
      .text()
      .primaryKey()
      .$defaultFn(() => {
        const { randomUUID } = require('expo-crypto');
        return randomUUID();
      }),
    plannedTransactionId: t
      .text('planned_transaction_id')
      .notNull()
      .references(() => plannedTransactions.id),
    transactionId: t
      .text('transaction_id')
      .notNull()
      .references(() => transactions.id),
    scheduledDate: t.integer('scheduled_date', { mode: 'timestamp' }).notNull(),
    executedAt: t.integer('executed_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    status: t.text().$type<'EXECUTED' | 'MISSED' | 'LATE'>().notNull().default('EXECUTED'),
    gracePeriodDays: t.integer('grace_period_days').notNull().default(3),
    notes: t.text(),
  },
  (table) => [
    t.index('execution_planned_idx').on(table.plannedTransactionId),
    t.index('execution_transaction_idx').on(table.transactionId),
    t.index('execution_date_idx').on(table.executedAt),
    t.index('execution_status_idx').on(table.status),
  ]
);

// ==================== TYPES ====================
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;

export type PlannedTransaction = typeof plannedTransactions.$inferSelect;
export type NewPlannedTransaction = typeof plannedTransactions.$inferInsert;

export type PlannedTransactionExecution = typeof plannedTransactionExecutions.$inferSelect;
export type NewPlannedTransactionExecution = typeof plannedTransactionExecutions.$inferInsert;

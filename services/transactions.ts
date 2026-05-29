import { db } from '@/db';
import { transactions, categories, plannedTransactions } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import type { NewTransaction } from '@/db/schema';
import type { SQLiteUpdateSetSource } from 'drizzle-orm/sqlite-core';

export function getAll() {
  return db.select().from(transactions);
}

export function getById(id: string) {
  return db.select().from(transactions).where(eq(transactions.id, id));
}

export function getByIdWithCategory(id: string) {
  return db
    .select({
      transaction: transactions,
      category: categories,
      plannedTransaction: plannedTransactions,
    })
    .from(transactions)
    .leftJoin(categories, eq(transactions.categoryId, categories.id))
    .leftJoin(plannedTransactions, eq(transactions.plannedTransactionId, plannedTransactions.id))
    .where(eq(transactions.id, id));
}

export function getByCategory(categoryId: string) {
  return db
    .select()
    .from(transactions)
    .where(
      and(
        eq(transactions.categoryId, categoryId),
        eq(transactions.isDeleted, false),
      ),
    )
    .orderBy(desc(transactions.transactionDate));
}

export function getAllWithCategory() {
  return db
    .select({
      id: transactions.id,
      transactionDate: transactions.transactionDate,
      type: transactions.type,
      amount: transactions.amount,
      description: transactions.description,
      paymentMethod: transactions.paymentMethod,
      paymentDetails: transactions.paymentDetails,
      categoryName: categories.name,
      categoryType: categories.type,
    })
    .from(transactions)
    .leftJoin(categories, eq(transactions.categoryId, categories.id))
    .where(eq(transactions.isDeleted, false))
    .orderBy(desc(transactions.transactionDate));
}

export function getByPlannedTransaction(plannedTransactionId: string) {
  return db
    .select()
    .from(transactions)
    .where(eq(transactions.plannedTransactionId, plannedTransactionId))
    .orderBy(desc(transactions.transactionDate));
}

export async function create(data: NewTransaction) {
  await db.insert(transactions).values(data);
}

export async function update(id: string, data: SQLiteUpdateSetSource<typeof transactions>) {
  await db.update(transactions).set(data).where(eq(transactions.id, id));
}

export async function softDelete(id: string) {
  await db
    .update(transactions)
    .set({ isDeleted: true, deletedAt: new Date() })
    .where(eq(transactions.id, id));
}

export async function deleteAll() {
  await db.delete(transactions);
}

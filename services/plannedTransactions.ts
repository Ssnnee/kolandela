import { db } from '@/db';
import { plannedTransactions, categories, transactions } from '@/db/schema';
import { eq, desc, leftJoin } from 'drizzle-orm';
import type { NewPlannedTransaction } from '@/db/schema';
import type { SQLiteUpdateSetSource } from 'drizzle-orm/sqlite-core';

export function getAll() {
  return db.select().from(plannedTransactions).where(eq(plannedTransactions.isDeleted, false));
}

export function getById(id: string) {
  return db.select().from(plannedTransactions).where(eq(plannedTransactions.id, id));
}

export function getByIdWithCategory(id: string) {
  return db
    .select({
      plannedTransaction: plannedTransactions,
      category: categories,
    })
    .from(plannedTransactions)
    .leftJoin(categories, eq(plannedTransactions.categoryId, categories.id))
    .where(eq(plannedTransactions.id, id));
}

export function getAllWithCategory() {
  return db
    .select({
      id: plannedTransactions.id,
      type: plannedTransactions.type,
      amount: plannedTransactions.amount,
      description: plannedTransactions.description,
      frequency: plannedTransactions.frequency,
      startDate: plannedTransactions.startDate,
      endDate: plannedTransactions.endDate,
      recurring: plannedTransactions.recurring,
      categoryName: categories.name,
      categoryType: categories.type,
    })
    .from(plannedTransactions)
    .leftJoin(categories, eq(plannedTransactions.categoryId, categories.id))
    .where(eq(plannedTransactions.isDeleted, false))
    .orderBy(desc(plannedTransactions.startDate));
}

export async function create(data: NewPlannedTransaction) {
  await db.insert(plannedTransactions).values(data);
}

export async function update(id: string, data: SQLiteUpdateSetSource<typeof plannedTransactions>) {
  await db.update(plannedTransactions).set(data).where(eq(plannedTransactions.id, id));
}

export async function deleteAll() {
  await db
    .update(plannedTransactions)
    .set({ isDeleted: true, deletedAt: new Date(), isActive: false });
}

export async function softDelete(id: string) {
  await db
    .update(plannedTransactions)
    .set({ isDeleted: true, deletedAt: new Date(), isActive: false })
    .where(eq(plannedTransactions.id, id));
}

export async function execute(id: string, paymentMethod: 'CASH' | 'BANK' | 'MOBILE_MONEY' | 'OTHER') {
  const rows = await db
    .select()
    .from(plannedTransactions)
    .where(eq(plannedTransactions.id, id));

  const ptx = rows[0];
  if (!ptx) throw new Error('Planned transaction not found');

  await db.insert(transactions).values({
    plannedTransactionId: ptx.id,
    categoryId: ptx.categoryId,
    description: ptx.description,
    amount: ptx.amount,
    type: ptx.type,
    paymentMethod,
    transactionDate: new Date(),
  });

  if (ptx.recurring) {
    const next = new Date(ptx.nextExecutionDate || ptx.startDate);
    switch (ptx.frequency) {
      case 'DAILY':
        next.setDate(next.getDate() + 1);
        break;
      case 'WEEKLY':
        next.setDate(next.getDate() + 7);
        break;
      case 'MONTHLY':
        next.setMonth(next.getMonth() + 1);
        break;
      case 'YEARLY':
        next.setFullYear(next.getFullYear() + 1);
        break;
    }
    await db
      .update(plannedTransactions)
      .set({ nextExecutionDate: next })
      .where(eq(plannedTransactions.id, ptx.id));
  } else {
    await db
      .update(plannedTransactions)
      .set({ isActive: false, nextExecutionDate: null })
      .where(eq(plannedTransactions.id, ptx.id));
  }
}

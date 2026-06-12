import { db } from '@/db';
import { categories } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import type { NewCategory } from '@/db/schema';
import type { SQLiteUpdateSetSource } from 'drizzle-orm/sqlite-core';

export function getAll() {
  return db.select().from(categories);
}

export function getById(id: string) {
  return db.select().from(categories).where(eq(categories.id, id));
}

export function getByType(type: 'INCOME' | 'EXPENSE') {
  return db
    .select()
    .from(categories)
    .where(and(eq(categories.type, type), eq(categories.isDeleted, false)));
}

export async function create(data: NewCategory) {
  await db.insert(categories).values(data);
}

export async function update(id: string, data: SQLiteUpdateSetSource<typeof categories>) {
  await db.update(categories).set(data).where(eq(categories.id, id));
}

export async function deleteAll() {
  await db
    .update(categories)
    .set({ isDeleted: true, deletedAt: new Date(), isActive: false });
}

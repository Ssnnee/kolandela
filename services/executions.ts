import { db } from '@/db';
import { plannedTransactionExecutions } from '@/db/schema';
import { eq } from 'drizzle-orm';
import type { NewPlannedTransactionExecution } from '@/db/schema';

export function getByPlannedTransaction(plannedTransactionId: string) {
  return db
    .select()
    .from(plannedTransactionExecutions)
    .where(eq(plannedTransactionExecutions.plannedTransactionId, plannedTransactionId));
}

export async function create(data: NewPlannedTransactionExecution) {
  await db.insert(plannedTransactionExecutions).values(data);
}

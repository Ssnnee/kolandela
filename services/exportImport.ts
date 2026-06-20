import { db } from '@/db';
import { categories, transactions, plannedTransactions, plannedTransactionExecutions } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

export interface BackupData {
  version: number;
  exportedAt: string;
  categories: typeof categories.$inferSelect[];
  transactions: typeof transactions.$inferSelect[];
  plannedTransactions: typeof plannedTransactions.$inferSelect[];
  plannedTransactionExecutions: typeof plannedTransactionExecutions.$inferSelect[];
}

function escapeCSV(val: any): string {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function exportToJSON(): Promise<void> {
  // Fetch all rows including soft-deleted ones for a complete backup restore
  const allCategories = await db.select().from(categories);
  const allTransactions = await db.select().from(transactions);
  const allPlannedTransactions = await db.select().from(plannedTransactions);
  const allExecutions = await db.select().from(plannedTransactionExecutions);

  const backupData: BackupData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    categories: allCategories,
    transactions: allTransactions,
    plannedTransactions: allPlannedTransactions,
    plannedTransactionExecutions: allExecutions,
  };

  const jsonString = JSON.stringify(backupData, null, 2);
  const fileName = `kolandela_backup_${new Date().toISOString().split('T')[0]}.json`;

  const fileUri = `${FileSystem.documentDirectory}${fileName}`;
  await FileSystem.writeAsStringAsync(fileUri, jsonString, { encoding: 'utf8' });
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri, { mimeType: 'application/json', dialogTitle: 'Export Backup' });
  } else {
    throw new Error('Sharing is not available on this device');
  }
}

export async function exportToCSV(): Promise<void> {
  // Fetch non-deleted transactions for a spreadsheet view
  const rows = await db
    .select({
      transactionDate: transactions.transactionDate,
      type: transactions.type,
      amount: transactions.amount,
      description: transactions.description,
      paymentMethod: transactions.paymentMethod,
      paymentDetails: transactions.paymentDetails,
      categoryName: categories.name,
    })
    .from(transactions)
    .leftJoin(categories, eq(transactions.categoryId, categories.id))
    .where(eq(transactions.isDeleted, false))
    .orderBy(desc(transactions.transactionDate));

  const csvHeaders = ['Date', 'Type', 'Category', 'Description', 'Amount', 'Payment Method', 'Payment Details'];
  const csvRows = rows.map((r) => [
    new Date(r.transactionDate).toISOString().split('T')[0],
    r.type,
    r.categoryName || '',
    r.description,
    r.amount,
    r.paymentMethod,
    r.paymentDetails || '',
  ]);

  const csvString = [
    csvHeaders.join(','),
    ...csvRows.map((row) => row.map(escapeCSV).join(',')),
  ].join('\n');

  const fileName = `kolandela_transactions_${new Date().toISOString().split('T')[0]}.csv`;

  const fileUri = `${FileSystem.documentDirectory}${fileName}`;
  await FileSystem.writeAsStringAsync(fileUri, csvString, { encoding: 'utf8' });
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri, { mimeType: 'text/csv', dialogTitle: 'Export CSV' });
  } else {
    throw new Error('Sharing is not available on this device');
  }
}

export async function importFromJSON(jsonString: string): Promise<void> {
  const data = JSON.parse(jsonString);

  // Structural Validation
  if (
    !data ||
    typeof data.version !== 'number' ||
    !Array.isArray(data.categories) ||
    !Array.isArray(data.transactions) ||
    !Array.isArray(data.plannedTransactions) ||
    !Array.isArray(data.plannedTransactionExecutions)
  ) {
    throw new Error('Invalid backup file structure');
  }

  // Parse strings back to JS Date objects for timestamp fields
  const parsedCategories = data.categories.map((c: any) => ({
    ...c,
    createdAt: c.createdAt ? new Date(c.createdAt) : new Date(),
    deletedAt: c.deletedAt ? new Date(c.deletedAt) : null,
  }));

  const parsedPlannedTransactions = data.plannedTransactions.map((pt: any) => ({
    ...pt,
    startDate: pt.startDate ? new Date(pt.startDate) : new Date(),
    endDate: pt.endDate ? new Date(pt.endDate) : null,
    nextExecutionDate: pt.nextExecutionDate ? new Date(pt.nextExecutionDate) : null,
    createdAt: pt.createdAt ? new Date(pt.createdAt) : new Date(),
    deletedAt: pt.deletedAt ? new Date(pt.deletedAt) : null,
  }));

  const parsedTransactions = data.transactions.map((t: any) => ({
    ...t,
    transactionDate: t.transactionDate ? new Date(t.transactionDate) : new Date(),
    createdAt: t.createdAt ? new Date(t.createdAt) : new Date(),
    deletedAt: t.deletedAt ? new Date(t.deletedAt) : null,
  }));

  const parsedExecutions = data.plannedTransactionExecutions.map((e: any) => ({
    ...e,
    scheduledDate: e.scheduledDate ? new Date(e.scheduledDate) : new Date(),
    executedAt: e.executedAt ? new Date(e.executedAt) : null,
  }));

  // Perform safe database replacement inside an atomic transaction
  await db.transaction(async (tx) => {
    // Delete in reverse order of foreign key dependencies
    await tx.delete(plannedTransactionExecutions);
    await tx.delete(transactions);
    await tx.delete(plannedTransactions);
    await tx.delete(categories);

    // Insert new data in order of dependencies (if rows exist)
    if (parsedCategories.length > 0) {
      await tx.insert(categories).values(parsedCategories);
    }
    if (parsedPlannedTransactions.length > 0) {
      await tx.insert(plannedTransactions).values(parsedPlannedTransactions);
    }
    if (parsedTransactions.length > 0) {
      await tx.insert(transactions).values(parsedTransactions);
    }
    if (parsedExecutions.length > 0) {
      await tx.insert(plannedTransactionExecutions).values(parsedExecutions);
    }
  });
}

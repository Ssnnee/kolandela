import { z } from 'zod';

const plannedTransactionSchema = z.object({
  id: z.number().nullable(),
  createdAt: z.string().datetime().optional(),
  category: z.string().min(3).max(20),
  description: z.string().min(3).max(50),
  amount: z.number().positive(),
  isRecurring: z.boolean(),
  frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']).default('MONTHLY'),
  isExecuted: z.boolean(),
  lastExecutionDate: z.string().datetime().nullable(),
});

export const transactionSchema = z.object({
  id: z.number().nullable(),
  description: z.string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(20, { message: "Name must be at most 50 characters long" }),
  createAt: z.string().datetime().optional(),
  amount: z.string({ message: "Amount must be a positive number" }),
  category: z.string()
    .min(3, { message: "Category must be at least 3 characters long" })
    .max(20, { message: "Category must be at most 50 characters long" }),
  type: z.enum(["INCOME", "EXPENSE"]).default("EXPENSE"),
  paymentMethod: z.enum(["CASH", "CARD"]).default("CASH"),
});

export type Transaction = z.infer<typeof transactionSchema>;
export type PlannedTransaction = z.infer<typeof plannedTransactionSchema>;

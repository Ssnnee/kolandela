import { z } from 'zod';

const plannedTransactionSchema = z.object({
  id: z.string(),
  user_id: z.number(),
  date: z.date(),
  category: z.string().min(3).max(20),
  description: z.string().min(3).max(50),
  amount: z.number().positive(),
  isRecurring: z.boolean(),
  frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']).optional(), // assuming enum RecurringFrequency
  isExecuted: z.boolean(),
  lastExecutionDate: z.date().optional(),
});

export const transactionSchema = z.object({
  id: z.string(),
  description: z.string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(20, { message: "Name must be at most 50 characters long" }),
  date: z.date(),
  amount: z.number().positive({ message: "Amount must be a positive number" }),
  category: z.string()
    .min(3, { message: "Category must be at least 3 characters long" })
    .max(20, { message: "Category must be at most 50 characters long" }),
  type: z.enum(["INCOME", "EXPENSE"]),
  paymentMethod: z.enum(["CASH", "CARD"]).optional(),
});

export type Transaction = z.infer<typeof transactionSchema>;
export type PlannedTransaction = z.infer<typeof plannedTransactionSchema>;

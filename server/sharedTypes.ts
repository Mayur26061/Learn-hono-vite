import { z } from 'zod';

export const expenseSchema = z.object({
    id: z.number().int().positive().min(1),
    amount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Amount must be a valid number with up to two decimal places"),
    title: z.string().min(3).max(100),
});
export const createExpenseSchema = expenseSchema.omit({ id: true });
export type Expense = z.infer<typeof expenseSchema>;

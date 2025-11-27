import { z } from 'zod';
import { insertExpenseSchema } from './db/schema/expenses';
export const expenseSchema = insertExpenseSchema.omit({
    userId: true,
    createAt: true,
})
export type NewExpense = z.infer<typeof expenseSchema>;

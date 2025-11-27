import { sql } from "drizzle-orm";
import { pgTable as table } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';
import z from "zod";


export const expenses = table("expenses", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  title: t.text('title').notNull(),
  userId: t.text('user_id').notNull(),
  amount: t.numeric('amount', { precision: 12, scale: 2 }).notNull(),
  createAt: t.timestamp('created_at', { withTimezone: true }).notNull().default(sql`now()`),
  date: t.date('date').notNull(),
}, (expenses) => [
  t.index('expenses_user_id_index').on(expenses.userId)
]
);

export const selectExpensesSchema = createSelectSchema(expenses);

export const insertExpenseSchema = createInsertSchema(expenses, {
  title: z.string()
    .min(3, { message: "Title must be atleast 3 characters" }),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Amount must be a valid number with up to two decimal places"),
});

import { pgTable as table } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";


export const expenses = table("expenses", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  title: t.text('title').notNull(),
 userId: t.text('user_id').notNull(),
 amount: t.numeric('amount', { precision: 12, scale: 2}).notNull(),
}, (expenses)=> [
    t.index('expenses_user_id_index').on(expenses.userId)
]
);

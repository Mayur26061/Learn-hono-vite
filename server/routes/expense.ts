import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator'
import { userMiddleWare } from '../kinde';
import { db } from '../db/index';
import { expenses as expensesTable } from '../db/schema/expenses';
import { eq } from 'drizzle-orm';

const expenseSchema = z.object({
    id: z.number().int().positive().min(1),
    amount: z.string(),
    title: z.string().min(3).max(100),
});
const createExpenseSchema = expenseSchema.omit({ id: true });

type Expense = z.infer<typeof expenseSchema>;

const fakeExpenses: Expense[] = [
    { id: 1, amount: "50", title: "Groceries" },
    { id: 2, amount: "20", title: "Transport" },
    { id: 3, amount: "100", title: "Utilities" },
];

const expenseRoute = new Hono()
    .get("/", userMiddleWare, async (c) => {
        const expneses = await db.select().from(expensesTable).where(eq(expensesTable.userId, c.var.user.id));
        return c.json({ expenses: expneses })
    })
    .post("/",  userMiddleWare, zValidator("json", createExpenseSchema, async (result, c) => {
        if (!result.success) {
            return c.text('Invalid!', 400)
        }
    }), async (c) => {
        const body = c.req.valid("json");
        const result = await db.insert(expensesTable).values({
            ...body,
            userId: c.var.user.id,
        }).returning();
        console.log(body);

        c.status(201);
        return c.json(result)
    })
    .get("/:id{[0-9]+}", userMiddleWare, c => {
        const id = Number(c.req.param("id"));
        const expense = fakeExpenses.find(e => e.id === id);
        if (!expense) {
            return c.notFound()
        }
        return c.json({ expense })
    })
    .get("/total", userMiddleWare, c=> {
        const total = fakeExpenses.reduce((acc, expense) => acc + +expense.amount, 0);
        return c.json({ total })
    })
    .delete("/:id{[0-9]+}", userMiddleWare, c => {
        const id = Number(c.req.param("id"));
        const expenseInd = fakeExpenses.findIndex(e => e.id === id);
        if (expenseInd < 0) {
            return c.notFound()
        }
        fakeExpenses.splice(expenseInd, 1);
        return c.json({ message: "Deleted successfully" })
    })

export default expenseRoute;
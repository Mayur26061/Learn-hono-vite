import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator'
import { userMiddleWare } from '../kinde';
import { db } from '../db/index';
import { expenses as expensesTable, insertExpenseSchema } from '../db/schema/expenses';
import { eq, desc, and, sum } from 'drizzle-orm';


import { expenseSchema } from '../sharedTypes';


const expenseRoute = new Hono()
    .get("/", userMiddleWare, async (c) => {
        const expneses = await db.select()
            .from(expensesTable)
            .where(eq(expensesTable.userId, c.var.user.id))
            .orderBy(desc(expensesTable.createAt)).limit(100);
        return c.json({ expenses: expneses })
    })
    .post("/", userMiddleWare, zValidator("json", expenseSchema, async (result, c) => {
        if (!result.success) {
            return c.text('Invalid!', 400)
        }
    }), async (c) => {
        const body = c.req.valid("json");
        insertExpenseSchema.parse({
            ...body,
            userId: c.var.user.id,
        }); // extra validation
        const result = await db.insert(expensesTable).values({
            ...body,
            userId: c.var.user.id,
        }).returning().then(res => res[0]);
        console.log(body);

        c.status(201);
        return c.json(result)
    })
    .get("/:id{[0-9]+}", userMiddleWare, async (c) => {
        const id = Number(c.req.param("id"));
        const expense = await db.select().from(expensesTable).where(
            and(
                eq(expensesTable.id, id),
                eq(expensesTable.userId, c.var.user.id)
            )
        ).limit(1).then(res => res[0]);
        if (!expense) {
            return c.notFound()
        }
        return c.json(expense)
    })
    .get("/total", userMiddleWare, async (c) => {
        const total = await db.select({ total: sum(expensesTable.amount) }).from(expensesTable).where(
            eq(expensesTable.userId, c.var.user.id)
        ).limit(1).then(res => res[0]);
        // const total = fakeExpenses.reduce((acc, expense) => acc + +expense.amount, 0);
        return c.json(total)
    })
    .delete("/:id{[0-9]+}", userMiddleWare, async (c) => {
        const id = Number(c.req.param("id"));
        const expense = await db.delete(expensesTable).where(
            and(
                eq(expensesTable.id, id),
                eq(expensesTable.userId, c.var.user.id)
            ))
            .returning()
            .then(res => res[0]);
        if (!expense) {
            return c.notFound()
        }
        return c.json({ message: `Deleted ${expense.title} successfully` })
    })

export default expenseRoute;
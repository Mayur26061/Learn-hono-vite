import { Hono } from 'hono';
import { logger } from 'hono/logger';
import expenseRoute from './routes/expense';

const app = new Hono()
app.use("*", logger())
app.get('/', (c) => c.json({ name: 'Hono!' }))
app.route("/api/expense", expenseRoute)

export default app
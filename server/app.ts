import { Hono } from 'hono';
import { logger } from 'hono/logger';
import expenseRoute from './routes/expense';
import { authRoute } from './routes/auth';
import { serveStatic } from 'hono/bun'

const app = new Hono()
app.use("*", logger())
// app.get('/', (c) => c.json({ name: 'Hono!' }))
const apiRoute = app.basePath("/api").route("/expense", expenseRoute).route("/", authRoute)

app.use('*', serveStatic({ root: './frontend/dist' }))
app.get('*', serveStatic({ path: './frontend/dist/index.html' }))

export default app
export type ApiRoute = typeof apiRoute;

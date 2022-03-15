import { ApplicationRouter } from './routes/application-router.ts';
import { Application, Database, MySQLConnector } from './deps.ts';
import { User } from './models/index.ts';
import { dotEnvConfig } from './deps.ts';

dotEnvConfig({ export: true });

const connection = new MySQLConnector({
    database: Deno.env.get('MYSQL_DATABASE')!,
    host: Deno.env.get('MYSQL_HOST')!,
    password: Deno.env.get('MYSQL_PASSWORD')!,
    username: Deno.env.get('MYSQL_USERNAME')!,
});

const db = new Database(connection);

db.link([User]);

await db.sync({ drop: true });

const app = new Application();
const applicationRouter = new ApplicationRouter();

// Logger
app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.headers.get('X-Response-Time');
    console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});

// Timing
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.response.headers.set('X-Response-Time', `${ms}ms`);
});

app.use(applicationRouter.routes()); // Pass our router as a middleware
app.use(applicationRouter.allowedMethods()); // Allow HTTP methods on router

await app.listen({ port: 3000 }).finally(() => {
    db.close();
});

import { Application, Database, MySQLConnector } from './deps.ts';
import { router } from './routes/index.ts';
import { dotEnvConfig } from './deps.ts';
import { config } from './config/config.ts';
import { UserModel } from './models/index.ts';

dotEnvConfig({ export: true });

const connection = new MySQLConnector({
    database: config.env.MYSQL_DATABASE,
    host: config.env.MYSQL_HOST,
    password: config.env.MYSQL_PASSWORD,
    username: config.env.MYSQL_USERNAME,
});

const db = new Database(connection);

db.link([UserModel]);

await db.sync({ drop: true });

const app = new Application();

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

app.use(router.routes()); // Pass our router as a middleware
app.use(router.allowedMethods()); // Allow HTTP methods on router

await app.listen({ port: 3000 }).finally(() => {
    db.close();
});

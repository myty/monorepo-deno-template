import { Application, Database, MySQLConnector } from './deps.ts';
import { LogEntry } from './models/index.ts';

const connection = new MySQLConnector({
    host: 'db',
    username: 'deno_user',
    password: 'deno_password',
    database: 'deno_db',
});

const db = new Database(connection);

db.link([LogEntry]);

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

// Hello World
app.use(async (ctx) => {
    const name = ctx.request.url.searchParams.get('name') ?? 'World';
    const responseBody = `Hello ${name}!`;

    const log = new LogEntry();
    log.title = 'Title';
    log.message = 'Hello World!';
    log.json = JSON.stringify({
        message: 'Hello World!',
        name,
    });
    await log.save();

    ctx.response.body = responseBody;
});

await app.listen({ port: 3000 });

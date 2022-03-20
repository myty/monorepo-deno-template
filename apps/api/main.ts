import { Application, oakCors } from './deps.ts';
import { router } from './routes/index.ts';
import * as middleware from './middleware/index.ts';
import * as db from './db/index.ts';

await db.initialize();

const port = 3000;
const app = new Application()
    .use(oakCors())
    .use(middleware.loggerMiddleware)
    .use(middleware.errorMiddleware)
    .use(middleware.timingMiddleware)
    .use(middleware.jwtAuthMiddleware)
    .use(middleware.requestIdMiddleware)
    .use(router.routes()) // Pass our router as a middleware
    .use(router.allowedMethods()); // Allow HTTP methods on router

await app.listen({ port }).finally(async () => {
    await db.database.close();
});

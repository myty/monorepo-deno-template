import { Router } from 'https://deno.land/x/oak@v10.4.0/mod.ts';
import { userRoutes } from './users/index.ts';

export class ApplicationRouter {
    readonly #router: Router;

    constructor() {
        this.#router = new Router()
            .use('/users', userRoutes.routes(), userRoutes.allowedMethods());
    }

    routes() {
        return this.#router.routes();
    }

    allowedMethods() {
        return this.#router.allowedMethods();
    }
}

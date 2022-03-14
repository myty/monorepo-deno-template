import { Router, Status } from 'https://deno.land/x/oak@v10.4.0/mod.ts';
import { createUser, CreateUserRequestDto } from './createUser.ts';
import { getUser } from './getUser.ts';
import { getUsers } from './getUsers.ts';

export const userRoutes = new Router()
    .get('/', async (context) => {
        context.response.body = await getUsers();
    })
    .get('/:id', async (context) => {
        const userResult = await getUser(context?.params?.id);

        if (userResult != null) {
            context.response.body = userResult;
        }
    })
    .post('/', async (context) => {
        if (!context.request.hasBody) {
            context.throw(Status.BadRequest, 'Bad Request');
        }

        const body = context.request.body();

        let user: CreateUserRequestDto | undefined;
        if (body.type === 'json') {
            user = await body.value;
        }

        if (user) {
            context.response.status = Status.Created;
            context.response.body = await createUser(user);
            context.response.type = 'json';
            return;
        }

        context.throw(Status.BadRequest, 'Bad Request');
    });

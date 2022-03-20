import { Router } from '../deps.ts';
import * as userRoutes from './users/index.ts';
import * as authRoutes from './auth/index.ts';

const router: Router = new Router();

router
    .post('/api/v1/login', ...authRoutes.login)
    .post('/api/v1/register', ...authRoutes.register)
    .post('/api/v1/token', ...authRoutes.refreshToken);

router
    .get('/api/v1/users', ...userRoutes.getUsers)
    .get('/api/v1/users/:id', ...userRoutes.getUserById)
    .put('/api/v1/users/:id', ...userRoutes.updateUser)
    .delete('/api/v1/users/:id', ...userRoutes.deleteUser);

export { router };

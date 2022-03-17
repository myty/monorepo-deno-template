import { Router } from '../deps.ts';
import * as userRoutes from './users/index.ts';

const router: Router = new Router();

// router
//   .post("/login", ...authRoutes.login)
//   .post("/register", ...authRoutes.register)
//   .post("/token", ...authRoutes.refreshToken);

router
    .get('/api/v1/users', ...userRoutes.getUsers)
    .get('/api/v1/users/:id', ...userRoutes.getUserById)
    .put('/api/v1/users/:id', ...userRoutes.updateUser)
    .delete('/api/v1/users/:id', ...userRoutes.deleteUser);

export { router };

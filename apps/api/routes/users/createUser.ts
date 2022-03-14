import { User } from '../../models/index.ts';
import { Result } from '../../result.ts';

export interface CreateUserRequestDto {
    email: string;
    username: string;
}

export async function createUser(userDto: CreateUserRequestDto) {
    try {
        const user = new User();
        user.email = userDto.email;
        user.username = userDto.username;

        await user.save();

        console.log('Create User', { user, userDto });

        return Result.success(user);
    } catch (err: unknown) {
        if (err instanceof Error) {
            return Result.error({ message: err.message });
        }

        return Result.error();
    }
}

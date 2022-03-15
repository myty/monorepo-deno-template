import { FieldValue } from 'https://deno.land/x/denodb@v1.0.40/lib/data-types.ts';
import { User } from '../../models/index.ts';
import { Result } from '../../result.ts';

export interface CreateUserRequestDto {
    email: string;
    username: string;
}

export async function createUser(userDto: CreateUserRequestDto) {
    try {
        const { lastInsertId } = await User.create({ ...userDto });
        const user = await User.find(lastInsertId as FieldValue);

        return Result.success(user);
    } catch (err: unknown) {
        if (err instanceof Error) {
            return Result.error({ message: err.message });
        }

        return Result.error();
    }
}

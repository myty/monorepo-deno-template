import { User } from '../../models/index.ts';
import { Result } from '../../result.ts';

export async function getUser(id: string) {
    try {
        const user = await User.find(id);

        return Result.success(user);
    } catch (err: unknown) {
        if (err instanceof Error) {
            return Result.error({ message: err.message });
        }

        return Result.error();
    }
}

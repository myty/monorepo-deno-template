import { Model } from '../../deps.ts';
import { User } from '../../models/index.ts';
import { AnyResult, Result } from '../../result.ts';

export async function getUsers(): Promise<AnyResult<Model[]>> {
    try {
        const users = await User.skip(0).take(25).get();

        return Result.success(Array.isArray(users) ? users : []);
    } catch (err: unknown) {
        if (err instanceof Error) {
            return Result.error({ message: err.message });
        }

        return Result.error();
    }
}

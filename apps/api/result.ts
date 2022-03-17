// deno-lint-ignore-file no-explicit-any
import { Status } from './deps.ts';

// Type Definitions

type SuccessResult<T = any> = {
    resultObject: T;
};

enum ErrorType {
    Error = 0,
    ValidationError = 1,
}

type Error = {
    key: string;
    message?: string;
    type: ErrorType;
};

type ErrorResult = {
    status: Status;
    errors: Error[];
};

export type AnyResult<T = any> = SuccessResult<T> | ErrorResult;

type ErrorParams =
    & { status?: Status }
    & (
        { error?: Partial<Error> } | { errors?: Partial<Error>[] }
    );

// Result Implementaion

export class Result {
    static success<T>(value: T): SuccessResult<T> {
        return {
            resultObject: value,
        };
    }

    static error(errorParams: ErrorParams = {}): ErrorResult {
        const { status = Status.InternalServerError, ...errorOrErrors } =
            errorParams;

        return {
            status,
            errors: Result._getErrors(errorOrErrors).map((error) => ({
                type: error.type ?? ErrorType.Error,
                key: error.key ?? 'ERROR',
                message: error.message,
            })),
        };
    }

    static isSuccessResult<T>(
        result: SuccessResult<T> | ErrorResult,
    ): result is SuccessResult<T> {
        const { errors = [] } = { errors: [], ...result };
        return errors.length === 0;
    }

    static isErrorResult<T>(
        result: SuccessResult<T> | ErrorResult,
    ): result is ErrorResult {
        return !Result.isSuccessResult(result);
    }

    private static _getErrors(
        errorOrErrors: Omit<ErrorParams, 'status'>,
    ): Partial<Error>[] {
        const { error, errors } = {
            errors: [],
            error: {},
            ...errorOrErrors,
        };

        if (Array.isArray(errors) && errors.length > 0) {
            return errors;
        }

        if (error != null) {
            return [error];
        }

        return [];
    }
}

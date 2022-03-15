// deno-lint-ignore-file no-explicit-any

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
    errors: Error[];
};

export type AnyResult<T = any> = SuccessResult<T> | ErrorResult;

// Result Implementaion

export class Result {
    static success<T>(value: T): SuccessResult<T> {
        return {
            resultObject: value,
        };
    }

    static error(): ErrorResult;
    static error(errors: Partial<Error>): ErrorResult;
    static error(errors: Partial<Error>[]): ErrorResult;
    static error(errors: Partial<Error> | Partial<Error>[] = {}): ErrorResult {
        errors = Array.isArray(errors) ? errors : [errors];

        return {
            errors: errors.map((error) => ({
                type: error.type ?? ErrorType.Error,
                key: error.key ?? 'ERROR',
                message: error.message,
            })),
        };
    }
}

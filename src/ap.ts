import { Result } from './types'

/**
 * Applies a Result-wrapped function to a Result-wrapped value.
 * If both the function and value are successful, applies the function to the value.
 * If either is a failure, returns the first failure encountered.
 *
 * @template T Input value type
 * @template U Output value type
 * @param fnResult Result containing a function from T to U
 * @param valueResult Result containing a value of type T
 * @returns Result containing the function applied to the value
 */
export function ap<T, U>(
    fnResult: Result<(value: T) => U>,
    valueResult: Result<T>
): Result<U> {
    if (!fnResult.ok) {
        return fnResult
    }

    if (!valueResult.ok) {
        return valueResult
    }

    try {
        return {
            ok: true,
            value: fnResult.value(valueResult.value)
        }
    } catch (error) {
        return {
            ok: false,
            error: error instanceof Error ? error : new Error(String(error))
        }
    }
}

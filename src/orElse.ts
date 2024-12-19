import { Result } from './types'

/**
 * Returns a fallback Result if the original Result is an error
 * @template T The type of the Result value
 * @param result The original Result to check
 * @param fallback A function that returns a fallback Result
 * @returns The original Result if successful, otherwise the fallback Result
 * @example
 * // Provide a fallback for a failed operation
 * const result = attempt(() => JSON.parse('invalid'))
 * const withFallback = orElse(result, () => attempt(() => ({ default: true })))
 */
export function orElse<T>(
    result: Result<T>,
    fallback: () => Result<T>
): Result<T> {
    if (result.ok) {
        return result
    }
    return fallback()
}

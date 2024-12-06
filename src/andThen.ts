import { Result } from './types'

/**
 * Chains operations that return Result types, allowing for sequential error handling
 * @template T The type of the input Result value
 * @template U The type of the output Result value
 * @param result The initial Result to chain from
 * @param fn A function that takes the success value and returns a new Result
 * @returns A new Result containing either the transformed value or the first error encountered
 * @example
 * // Chain multiple operations that could fail
 * const initialResult = attempt(() => 5)
 * const doubleNumber = (n: number) => attempt(() => n * 2)
 * const result = andThen(initialResult, doubleNumber) // Result<number>
 */
export function andThen<T, U>(result: Result<T>, fn: (value: T) => Result<U>): Result<U> {
  if (result.ok) {
    return fn(result.value)
  }
  return result
}

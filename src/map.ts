import { Result } from './types'

/**
 * Transforms the value inside a successful Result using the provided function
 * @template T The type of the input Result value
 * @template U The type of the transformed Result value
 * @param result The Result to transform
 * @param fn A function that transforms the success value from type T to type U
 * @returns A new Result containing either the transformed value or the original error
 * @example
 * // Transform a number Result to a string Result
 * const numResult = attempt(() => 42)
 * const strResult = map(numResult, num => num.toString()) // Result<string>
 */
export function map<T, U>(result: Result<T>, fn: (value: T) => U): Result<U> {
  if (result.ok) {
    return { ok: true, value: fn(result.value) }
  }
  return result
}

/**
 * Transforms the error inside a failed Result using the provided function
 * @template E The type of the input error, must extend Error
 * @template F The type of the transformed error, must extend Error
 * @param result The Result containing the error to transform
 * @param fn A function that transforms the error from type E to type F
 * @returns A new Result containing either the original value or the transformed error
 * @example
 * // Transform an error message
 * const failedResult = attempt(() => { throw new Error('Failed') })
 * const result = mapError(failedResult,
 *   err => new Error(`Operation failed: ${err.message}`)
 * )
 */
export function mapError<E extends Error, F extends Error>(
  result: Result<any>,
  fn: (error: E) => F
): Result<any> {
  if (result.ok) {
    return result
  }
  return { ok: false, error: fn(result.error as E) }
}

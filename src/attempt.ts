import type { Success, Failure, Result } from './types'

/**
 * Creates a Success result containing the provided value
 * @template T The type of the success value
 * @param value The value to wrap in a Success result
 * @returns A Success result containing the value
 */
function ok<T>(value: T): Success<T> {
  return { ok: true, value }
}

/**
 * Creates a Failure result containing the provided error
 * @template E The type of the error value
 * @param e The error to wrap in a Failure result. If not an Error instance, it will be converted to one
 * @returns A Failure result containing an Error
 */
function fail<E>(e: E): Failure<Error> {
  return { ok: false, error: e instanceof Error ? e : new Error(String(e)) }
}

/**
 * Wraps a synchronous or asynchronous function in error handling logic
 * @template T The return type of the wrapped function
 * @param fn The function to wrap with error handling
 * @returns For sync functions: Result<T> containing either the value or error
 *          For async functions: Promise<Result<T>> containing either the resolved value or error
 * @example
 * // Synchronous usage
 * const result = attempt(() => "success");
 *
 * // Asynchronous usage
 * const asyncResult = await attempt(async () => {
 *   const response = await fetch("https://api.example.com");
 *   return response.json();
 * });
 */
export function attempt<T>(fn: () => T): Result<Awaited<T>>
export function attempt<T>(fn: () => Promise<T>): Promise<Result<Awaited<T>>>
export function attempt<T>(
  fn: () => T | Promise<T>
): Result<Awaited<T>> | Promise<Result<Awaited<T>>> {
  try {
    const result = fn()
    if (result instanceof Promise) {
      return result.then((value) => ok(value as Awaited<T>)).catch(fail)
    }
    return ok(result as Awaited<T>)
  } catch (e) {
    return fail(e)
  }
}

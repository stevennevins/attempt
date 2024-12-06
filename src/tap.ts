import { Result } from './types'

/**
 * Executes side effects on a Result value without modifying it
 * @template T The type of the success value in the Result
 * @param result The Result to inspect and execute side effects on
 * @param handlers Object containing optional handler functions for success and error cases
 * @param handlers.ok Optional function to handle the success case, receives the success value
 * @param handlers.error Optional function to handle the error case, receives the Error
 * @returns The original Result unchanged
 * @example
 * // Log success or error without modifying the Result
 * const result = attempt(() => 42)
 * tap(result, {
 *   ok: (value) => console.log(`Success: ${value}`),
 *   error: (err) => console.error(`Error: ${err.message}`)
 * })
 */
export function tap<T>(
  result: Result<T>,
  handlers: { ok?: (value: T) => void; error?: (error: Error) => void }
): Result<T> {
  if (result.ok && handlers.ok) {
    handlers.ok(result.value)
  } else if (!result.ok && handlers.error) {
    handlers.error(result.error)
  }
  return result
}

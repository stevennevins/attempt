import { Result } from './types'

/**
 * Pattern matches on a Result type to handle both success and error cases
 * @template T The type of the success value in the Result
 * @template U The type of the value returned by both handlers
 * @param result The Result to pattern match on
 * @param handlers Object containing handler functions for success and error cases
 * @param handlers.ok Function to handle the success case, receives the success value
 * @param handlers.error Function to handle the error case, receives the Error
 * @returns The value returned by either the success or error handler
 * @example
 * // Handle both cases of a Result
 * const result = attempt(() => 42)
 * const message = match(result, {
 *   ok: (value) => `Success: ${value}`,
 *   error: (err) => `Error: ${err.message}`
 * })
 */
export function match<T, U>(
  result: Result<T>,
  handlers: { ok: (value: T) => U; error: (error: Error) => U }
): U {
  if (result.ok) {
    return handlers.ok(result.value)
  }
  return handlers.error(result.error)
}

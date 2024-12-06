import { Result } from './types'

export function map<T, U>(result: Result<T>, fn: (value: T) => U): Result<U> {
  if (result.ok) {
    return { ok: true, value: fn(result.value) }
  }
  return result
}

export function mapError<E extends Error, F extends Error>(
  result: Result<any>,
  fn: (error: E) => F
): Result<any> {
  if (result.ok) {
    return result
  }
  return { ok: false, error: fn(result.error as E) }
}

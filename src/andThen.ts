import { Result } from './types'

export function andThen<T, U>(result: Result<T>, fn: (value: T) => Result<U>): Result<U> {
  if (result.ok) {
    return fn(result.value)
  }
  return result
}

import { Result } from './types'

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

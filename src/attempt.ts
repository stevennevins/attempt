type Success<T> = {
  ok: true
  value: T
}

type Failure = {
  ok: false
  error: Error
}

export type Result<T> = Success<T> | Failure

export function ok<T>(value: T): Success<T> {
  return { ok: true, value }
}

export function fail(e: unknown): Failure {
  return { ok: false, error: e instanceof Error ? e : new Error(String(e)) }
}

export function attempt<T>(fn: () => T): Result<T>
export function attempt<T>(fn: () => Promise<T>): Promise<Result<T>>
export function attempt<T>(
  fn: () => T | Promise<T>,
): Result<T> | Promise<Result<T>> {
  try {
    const result = fn()
    if (result instanceof Promise) {
      return result.then(ok).catch(fail)
    }
    return ok(result)
  } catch (e) {
    return fail(e)
  }
}

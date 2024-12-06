type Success<T> = {
  ok: true
  value: T
}

type Failure<Error> = {
  ok: false
  error: Error
}

export type Result<T> = Success<T> | Failure<Error>

export type Either<L, R> = Success<L> | Failure<R>

export function ok<T>(value: T): Success<T> {
  return { ok: true, value }
}

export function fail<E>(e: E): Failure<Error> {
  return { ok: false, error: e instanceof Error ? e : new Error(String(e)) }
}

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

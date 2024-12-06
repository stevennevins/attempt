export type Success<T> = {
  ok: true
  value: T
}

export type Failure<E> = {
  ok: false
  error: E
}

export type Result<T> = Success<T> | Failure<Error>

export type Either<L, R> = Success<L> | Failure<R>

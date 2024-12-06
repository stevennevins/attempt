/**
 * Represents a successful result containing a value of type T
 * @template T The type of the success value
 */
export type Success<T> = {
  ok: true
  value: T
}

/**
 * Represents a failure result containing an error of type E
 * @template E The type of the error value
 */
export type Failure<E> = {
  ok: false
  error: E
}

/**
 * A discriminated union type representing either a successful result with value T,
 * or a failure containing a JavaScript Error
 * @template T The type of the success value
 */
export type Result<T> = Success<T> | Failure<Error>

/**
 * A more flexible version of Result that allows specifying both the success and error types.
 * Used for custom error handling scenarios.
 * @template L The type of the success value
 * @template R The type of the error value
 */
export type Either<L, R> = Success<L> | Failure<R>

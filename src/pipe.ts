import { Result } from './types'

/**
 * A function that takes a value of type T and returns a Result of type U
 * @template T The input value type
 * @template U The output Result value type
 */
type ResultFn<T, U> = (value: T) => Result<U>

/**
 * Recursively determines the final Result type after applying a series of ResultFn functions
 * @template T The initial value type
 * @template Fns Tuple type of ResultFn functions to be applied
 * @returns The final value type after applying all functions in the tuple
 */
type PipeResult<T, Fns extends readonly ResultFn<any, any>[]> = Fns extends []
  ? T
  : Fns extends [ResultFn<T, infer U>, ...infer Rest extends ResultFn<any, any>[]]
    ? PipeResult<U, Rest>
    : never

/**
 * Chains multiple Result-returning functions together, passing the success value of each to the next function
 * @template T The type of the initial Result value
 * @template Fns Tuple type of functions to chain together
 * @param initial The starting Result value
 * @param fns The functions to chain together
 * @returns A Result containing either the final transformed value or the first error encountered
 * @example
 * // Chain multiple operations
 * const initialResult = attempt(() => 5)
 * const addTwo = (n: number) => attempt(() => n + 2)
 * const multiplyByThree = (n: number) => attempt(() => n * 3)
 * const result = pipe(initialResult, addTwo, multiplyByThree) // Result<number>
 */
export function pipe<T, Fns extends ResultFn<any, any>[]>(
  initial: Result<T>,
  ...fns: [...Fns]
): Result<PipeResult<T, Fns>> {
  return fns.reduce((result, fn) => (result.ok ? fn(result.value) : result), initial)
}

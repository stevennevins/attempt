import { Result } from './types'

type ResultFn<T, U> = (value: T) => Result<U>

type PipeResult<T, Fns extends readonly ResultFn<any, any>[]> = Fns extends []
  ? T
  : Fns extends [ResultFn<T, infer U>, ...infer Rest extends ResultFn<any, any>[]]
    ? PipeResult<U, Rest>
    : never

export function pipe<T, Fns extends ResultFn<any, any>[]>(
  initial: Result<T>,
  ...fns: [...Fns]
): Result<PipeResult<T, Fns>> {
  return fns.reduce((result, fn) => (result.ok ? fn(result.value) : result), initial)
}

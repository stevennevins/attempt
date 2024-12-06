import { describe, it, expect } from 'vitest'
import { pipe } from '../src/pipe'
import { attempt } from '../src/attempt'

describe('pipe', () => {
  it('should chain successful operations', () => {
    const initialResult = attempt(() => 5)
    const doubleNumber = (n: number) => attempt(() => n * 2)

    const result = pipe(initialResult, doubleNumber)

    expect(result).toEqual({ ok: true, value: 10 })
  })

  it('should stop at first error', () => {
    const error = new Error('Initial error')
    const initialResult = attempt(() => {
      throw error
    })
    const doubleNumber = (n: number) => attempt(() => n * 2)

    const result = pipe(initialResult, doubleNumber)

    expect(result).toEqual({ ok: false, error })
  })

  it('should handle errors in chained function', () => {
    const initialResult = attempt(() => 'test')
    const error = new Error('Processing error')
    const failingFn = () =>
      attempt(() => {
        throw error
      })

    const result = pipe(initialResult, failingFn)

    expect(result).toEqual({ ok: false, error })
  })

  it('should chain multiple operations', () => {
    const initialResult = attempt(() => 5)
    const addTwo = (n: number) => attempt(() => n + 2)
    const multiplyByThree = (n: number) => attempt(() => n * 3)

    const result = pipe(initialResult, addTwo, multiplyByThree)

    expect(result).toEqual({ ok: true, value: 21 })
  })
})

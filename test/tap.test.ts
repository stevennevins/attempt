import { describe, it, expect } from 'vitest'
import { tap } from '../src/tap'
import { attempt } from '../src/attempt'
import type { Result } from '../src/types'

describe('tap', () => {
  it('should call ok handler and return original result on success', () => {
    let handlerCalled = false
    const successResult: Result<number> = { ok: true, value: 42 }

    const result = tap(successResult, {
      ok: (value) => {
        handlerCalled = true
        expect(value).toBe(42)
      },
    })

    expect(handlerCalled).toBe(true)
    expect(result).toBe(successResult)
  })

  it('should call error handler and return original result on error', () => {
    let handlerCalled = false
    const error = new Error('test error')
    const errorResult: Result<never> = { ok: false, error }

    const result = tap(errorResult, {
      error: (err) => {
        handlerCalled = true
        expect(err).toBe(error)
      },
    })

    expect(handlerCalled).toBe(true)
    expect(result).toBe(errorResult)
  })

  it('should work with attempt on success', () => {
    let handlerCalled = false
    const successFn = () => 'test-value'

    const result = tap(attempt(successFn), {
      ok: (value) => {
        handlerCalled = true
        expect(value).toBe('test-value')
      },
    })

    expect(handlerCalled).toBe(true)
    expect(result).toEqual({ ok: true, value: 'test-value' })
  })

  it('should work with attempt on error', () => {
    let handlerCalled = false
    const error = new Error('test error')
    const failingFn = () => {
      throw error
    }

    const result = tap(attempt(failingFn), {
      error: (err) => {
        handlerCalled = true
        expect(err).toBe(error)
      },
    })

    expect(handlerCalled).toBe(true)
    expect(result).toEqual({ ok: false, error })
  })

  it('should handle empty handlers object', () => {
    const successResult: Result<number> = { ok: true, value: 123 }

    const result = tap(successResult, {})

    expect(result).toBe(successResult)
  })
})

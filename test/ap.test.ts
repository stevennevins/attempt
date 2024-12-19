import { describe, it, expect } from 'vitest'
import { ap } from '../src/ap'
import { attempt } from '../src/attempt'

describe('ap', () => {
    it('should apply wrapped function to wrapped value successfully', () => {
        const wrappedFn = attempt(() => (x: number) => x * 2)
        const wrappedValue = attempt(() => 5)

        const result = ap(wrappedFn, wrappedValue)

        expect(result).toEqual({ ok: true, value: 10 })
    })

    it('should return first error if wrapped function is error', () => {
        const error = new Error('Function error')
        const wrappedFn = attempt(() => {
            throw error
        })
        const wrappedValue = attempt(() => 5)

        const result = ap(wrappedFn, wrappedValue)

        expect(result).toEqual({ ok: false, error })
    })

    it('should return error if wrapped value is error', () => {
        const error = new Error('Value error')
        const wrappedFn = attempt(() => (x: number) => x * 2)
        const wrappedValue = attempt(() => {
            throw error
        })

        const result = ap(wrappedFn, wrappedValue)

        expect(result).toEqual({ ok: false, error })
    })

    it('should handle errors thrown by the wrapped function', () => {
        const wrappedFn = attempt(() => () => {
            throw new Error('Function execution error')
        })
        const wrappedValue = attempt(() => 5)

        const result = ap(wrappedFn, wrappedValue)

        expect(result.ok).toBe(false)
        expect(!result.ok && result.error).toBeInstanceOf(Error)
        expect(!result.ok && result.error.message).toBe('Function execution error')
    })

    it('should work with different types', () => {
        const wrappedFn = attempt(() => (s: string) => s.length)
        const wrappedValue = attempt(() => 'test')

        const result = ap(wrappedFn, wrappedValue)

        expect(result).toEqual({ ok: true, value: 4 })
    })

    it('should handle non-Error thrown values', () => {
        const wrappedFn = attempt(() => () => {
            throw 'string error'
        })
        const wrappedValue = attempt(() => 5)

        const result = ap(wrappedFn, wrappedValue)

        expect(result.ok).toBe(false)
        expect(!result.ok && result.error).toBeInstanceOf(Error)
        expect(!result.ok && result.error.message).toBe('string error')
    })

})

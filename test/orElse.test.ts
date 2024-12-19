import { describe, it, expect } from 'vitest'
import { orElse } from '../src/orElse'
import { attempt } from '../src/attempt'

describe('orElse', () => {
    it('should return original result if successful', () => {
        const initialResult = attempt(() => 5)
        const fallback = () => attempt(() => 10)

        const result = orElse(initialResult, fallback)

        expect(result).toEqual({ ok: true, value: 5 })
    })

    it('should return fallback result if original fails', () => {
        const error = new Error('Initial error')
        const initialResult = attempt(() => {
            throw error
        })
        const fallback = () => attempt(() => 10)

        const result = orElse(initialResult, fallback)

        expect(result).toEqual({ ok: true, value: 10 })
    })

    it('should propagate fallback error if both fail', () => {
        const initialError = new Error('Initial error')
        const fallbackError = new Error('Fallback error')

        const initialResult = attempt(() => {
            throw initialError
        })
        const fallback = () => attempt(() => {
            throw fallbackError
        })

        const result = orElse(initialResult, fallback)

        expect(result).toEqual({ ok: false, error: fallbackError })
    })

    it('should chain multiple fallbacks', () => {
        const initialResult = attempt(() => {
            throw new Error('First error')
        })
        const fallback1 = () => attempt(() => {
            throw new Error('Second error')
        })
        const fallback2 = () => attempt(() => 15)

        const result = orElse(orElse(initialResult, fallback1), fallback2)

        expect(result).toEqual({ ok: true, value: 15 })
    })

    it('should handle async fallbacks', async () => {
        const initialResult = attempt(() => {
            throw new Error('Initial error')
        })
        const fallback = () => attempt(async () => {
            return 'async fallback'
        })

        const result = await orElse(initialResult, fallback)

        expect(result).toEqual({ ok: true, value: 'async fallback' })
    })
})

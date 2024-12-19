import { describe, it, expect } from 'vitest'
import { map, mapError } from '../src/map'
import { attempt } from '../src/attempt'
import type { Result } from '../src/types'

describe('map', () => {
    it('should transform successful result value', () => {
        const initialResult = attempt(() => 5)
        const doubleNumber = (n: number) => n * 2

        const result = map(initialResult, doubleNumber)

        expect(result).toEqual({ ok: true, value: 10 })
    })

    it('should handle object transformations', () => {
        const userResult = attempt(() => ({
            firstName: 'John',
            lastName: 'Doe',
        }))

        const result = map(userResult, (user) => ({
            fullName: `${user.firstName} ${user.lastName}`,
        }))

        expect(result).toEqual({
            ok: true,
            value: { fullName: 'John Doe' },
        })
    })

    it('should handle array transformations', () => {
        const arrayResult = attempt(() => [1, 2, 3])

        const result = map(arrayResult, (numbers) => numbers.map((n) => n * 2))

        expect(result).toEqual({
            ok: true,
            value: [2, 4, 6],
        })
    })

    it('should pass through error results unchanged', () => {
        const error = new Error('test error')
        const errorResult = attempt(() => {
            throw error
        })

        const result = map(errorResult, (value) => value)

        expect(result).toEqual({ ok: false, error })
    })

    it('should chain multiple transformations', () => {
        const initialResult = attempt(() => '42')

        const result = map(
            map(initialResult, (str) => parseInt(str)),
            (num) => num * 2
        )

        expect(result).toEqual({ ok: true, value: 84 })
    })

    it('should handle JSON parsing and transformation', () => {
        const jsonResult = attempt(() => JSON.parse('{"age": 25}'))

        const result = map(jsonResult, (data) => data.age * 12)

        expect(result).toEqual({ ok: true, value: 300 })
    })

    it('should handle errors from transformation function', () => {
        const validateAge = (age: number) => {
            if (age < 0) throw new Error('Age cannot be negative')
            return age
        }

        const ageResult = attempt(() => validateAge(-5))
        const result = map(ageResult, (age) => `Age is ${age} years`) as Result<string>

        expect(!result.ok && result.error.message).toBe('Age cannot be negative')
    })
})

describe('mapError', () => {
    it('should transform error message', () => {
        const error = new Error('test error')
        const errorResult = attempt(() => {
            throw error
        })

        const result = mapError(errorResult, (err) => new Error(`Transformed: ${err.message}`))

        expect(!result.ok && result.error.message).toBe('Transformed: test error')
    })

    it('should pass through success results unchanged', () => {
        const successResult = attempt(() => 42)

        const result = mapError(successResult, (err) => new Error('Should not be called'))

        expect(result).toEqual({ ok: true, value: 42 })
    })

    it('should chain multiple error transformations', () => {
        const error = new Error('initial error')
        const errorResult = attempt(() => {
            throw error
        })

        const result = mapError(
            mapError(errorResult, (err) => new Error(`First: ${err.message}`)),
            (err) => new Error(`Second: ${err.message}`)
        )

        expect(!result.ok && result.error.message).toBe('Second: First: initial error')
    })

    it('should handle custom error types', () => {
        class CustomError extends Error {
            constructor(
                message: string,
                public code: number
            ) {
                super(message)
            }
        }

        const error = new CustomError('custom error', 500)
        const errorResult = attempt(() => {
            throw error
        })

        const result = mapError(errorResult, (err: CustomError) => {
            return new Error(`Error ${err.code}: ${err.message}`)
        })

        expect(!result.ok && result.error.message).toBe('Error 500: custom error')
    })
})

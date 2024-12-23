import { describe, it, expect } from 'vitest'
import { attempt } from '../src/attempt'
import { Either } from '../src/types'

describe('Basic test setup', () => {
  it('should handle successful async operation', async () => {
    const result = await attempt(async () => {
      return 'Data fetched successfully'
    })
    expect(result.ok).toBe(true)
    expect(result.ok && result.value).toBe('Data fetched successfully')
  })

  it('should handle async operation errors', async () => {
    const result = await attempt(async () => {
      throw new Error('Fetch failed')
    })

    expect(result.ok).toBe(false)
    expect(!result.ok && result.error).toBeInstanceOf(Error)
    expect(!result.ok && result.error.message).toBe('Fetch failed')
  })

  it('should handle successful sync operation', () => {
    const result = attempt(() => {
      return 'Data fetched successfully'
    })
    expect(result.ok).toBe(true)
    expect(result.ok && result.value).toBe('Data fetched successfully')
  })

  it('should handle sync operation errors', () => {
    const result = attempt(() => {
      throw new Error('Fetch failed')
    })

    expect(result.ok).toBe(false)
    expect(!result.ok && result.error).toBeInstanceOf(Error)
    expect(!result.ok && result.error.message).toBe('Fetch failed')
  })

  it('should handle non-Error thrown objects in sync operations', () => {
    const result = attempt(() => {
      throw 'string error' // throwing a string instead of Error
    })

    expect(result.ok).toBe(false)
    expect(!result.ok && result.error).toBeInstanceOf(Error)
    expect(!result.ok && result.error.message).toBe('string error')
  })

  it('should handle non-Error thrown objects in async operations', async () => {
    const result = await attempt(async () => {
      throw { custom: 'error object' } // throwing a custom object
    })

    expect(result.ok).toBe(false)
    expect(!result.ok && result.error).toBeInstanceOf(Error)
    expect(!result.ok && result.error.message).toBe('[object Object]')
  })

  it('should handle null/undefined return values', () => {
    const nullResult = attempt(() => null)
    expect(nullResult.ok).toBe(true)
    expect(nullResult.ok && nullResult.value).toBeNull()

    const undefinedResult = attempt(() => undefined)
    expect(undefinedResult.ok).toBe(true)
    expect(undefinedResult.ok && undefinedResult.value).toBeUndefined()
  })

  it('should handle Promise rejection with non-Error values', async () => {
    const result = await attempt(async () => {
      return Promise.reject('rejected with string')
    })

    expect(result.ok).toBe(false)
    expect(!result.ok && result.error).toBeInstanceOf(Error)
    expect(!result.ok && result.error.message).toBe('rejected with string')
  })

  it('should handle successful async operations with various types', async () => {
    const numberResult = await attempt(async () => 42)
    expect(numberResult.ok).toBe(true)
    expect(numberResult.ok && numberResult.value).toBe(42)

    const objectResult = await attempt(async () => ({ key: 'value' }))
    expect(objectResult.ok).toBe(true)
    expect(objectResult.ok && objectResult.value).toEqual({ key: 'value' })

    const arrayResult = await attempt(async () => [1, 2, 3])
    expect(arrayResult.ok).toBe(true)
    expect(arrayResult.ok && arrayResult.value).toEqual([1, 2, 3])
  })

  it('should handle nested async operations', async () => {
    const result = await attempt(async () => {
      const inner = await attempt(async () => 'nested value')
      if (!inner.ok) throw inner.error
      return inner.value.toUpperCase() /// TODO: Typechecker
    })

    expect(result.ok).toBe(true)
    expect(result.ok && result.value).toBe('NESTED VALUE')
  })

  it('should handle async operations that timeout', async () => {
    const result = await attempt(async () => {
      await new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Operation timed out')), 10)
      })
      return 'should not reach here'
    })

    expect(result.ok).toBe(false)
    expect(!result.ok && result.error).toBeInstanceOf(Error)
    expect(!result.ok && result.error.message).toBe('Operation timed out')
  })

  it('should handle sync operations with complex calculations', () => {
    const result = attempt(() => {
      const numbers = Array.from({ length: 1000 }, (_, i) => i)
      return numbers.reduce((sum, num) => {
        if (num === 500) throw new Error('Calculation error')
        return sum + num
      }, 0)
    })

    expect(result.ok).toBe(false)
    expect(!result.ok && result.error).toBeInstanceOf(Error)
    expect(!result.ok && result.error.message).toBe('Calculation error')
  })

  it('should handle deeply nested async operations', async () => {
    const result = await attempt(async () => {
      const firstLevel = await attempt(async () => {
        const secondLevel = await attempt(async () => {
          const thirdLevel = await attempt(async () => 'deep value')
          if (!thirdLevel.ok) {
            throw thirdLevel.error
          }
          return thirdLevel.value.repeat(2)
        })
        if (!secondLevel.ok) {
          throw secondLevel.error
        }
        return secondLevel.value.toUpperCase()
      })
      if (!firstLevel.ok) {
        throw firstLevel.error
      }
      return `${firstLevel.value}!`
    })

    expect(result.ok).toBe(true)
    expect(result.ok && result.value).toBe('DEEP VALUEDEEP VALUE!')
  })

  it('should handle Either type with discriminated unions for simple validation in sync operations', () => {
    type ValidationError =
      | { type: 'EmptyInput'; message: string }
      | { type: 'InvalidCharacter'; message: string }

    const validateInput = (input: string): Either<string, ValidationError> => {
      if (input === '') {
        return {
          ok: false,
          error: { type: 'EmptyInput', message: 'Input is empty' },
        }
      }
      if (!/^[a-zA-Z]+$/.test(input)) {
        return {
          ok: false,
          error: {
            type: 'InvalidCharacter',
            message: 'Input contains invalid characters',
          },
        }
      }
      //   if ('test' === input) {
      //     return {
      //       ok: false,
      //       error: {
      //         type: 'InvalidErrorType',
      //         message: 'Should have type error',
      //       },
      //     }
      //   }
      return { ok: true, value: 'Valid input' }
    }

    const result1 = validateInput('')
    expect(result1.ok).toBe(false)
    expect(!result1.ok && result1.error.type).toBe('EmptyInput')
    expect(!result1.ok && result1.error.message).toBe('Input is empty')

    const result2 = validateInput('abc123')
    expect(result2.ok).toBe(false)
    expect(!result2.ok && result2.error.type).toBe('InvalidCharacter')
    expect(!result2.ok && result2.error.message).toBe('Input contains invalid characters')

    const result3 = validateInput('valid')
    expect(result3.ok).toBe(true)
    expect(result3.ok && result3.value).toBe('Valid input')
  })

  it('should handle Either type with success case', () => {
    const successResult: Either<string, Error> = {
      ok: true,
      value: 'success value',
    }

    expect(successResult.ok).toBe(true)
    expect(successResult.ok && successResult.value).toBe('success value')
  })

  it('should handle Either type with failure case', () => {
    const errorMessage = 'test error'
    const failureResult: Either<string, Error> = {
      ok: false,
      error: new Error(errorMessage),
    }

    expect(failureResult.ok).toBe(false)
    expect(!failureResult.ok && failureResult.error.message).toBe(errorMessage)
  })

  it('should handle Either type with different success and error types', () => {
    type SuccessType = { data: number }
    type ErrorType = { code: string; message: string }

    const successCase: Either<SuccessType, ErrorType> = {
      ok: true,
      value: { data: 42 },
    }

    const failureCase: Either<SuccessType, ErrorType> = {
      ok: false,
      error: { code: 'ERR_001', message: 'Custom error' },
    }

    expect(successCase.ok).toBe(true)
    expect(successCase.ok && successCase.value.data).toBe(42)

    expect(failureCase.ok).toBe(false)
    expect(!failureCase.ok && failureCase.error.code).toBe('ERR_001')
    expect(!failureCase.ok && failureCase.error.message).toBe('Custom error')
  })
})

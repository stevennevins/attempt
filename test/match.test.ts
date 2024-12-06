import { describe, it, expect } from 'vitest'
import { attempt } from '../src/attempt'
import { match } from '../src/match'

describe('match function', () => {
  it('should handle successful JSON parsing', () => {
    const parseResult = attempt(() => JSON.parse('{"name": "Alice"}'))

    const greeting = match(parseResult, {
      ok: (data) => `Hello, ${data.name}!`,
      error: (err) => `Failed to parse: ${err.message}`,
    })

    expect(greeting).toBe('Hello, Alice!')
  })

  it('should handle failed JSON parsing', () => {
    const parseResult = attempt(() => JSON.parse('invalid json'))

    const greeting = match(parseResult, {
      ok: (data) => `Hello, ${data.name}!`,
      error: (err) => `Failed to parse: ${err.message}`,
    })

    expect(greeting).toMatch(/Failed to parse:/)
  })

  it('should handle number parsing and conditional logic', () => {
    const positiveResult = attempt(() => parseInt('42'))

    const positiveDisplay = match(positiveResult, {
      ok: (num) => (num > 0 ? 'Positive' : 'Zero or negative'),
      error: () => 'Invalid number',
    })

    expect(positiveDisplay).toBe('Positive')

    const invalidResult = attempt(() => parseInt('not a number'))

    const invalidDisplay = match(invalidResult, {
      ok: (num) => (num > 0 ? 'Positive' : 'Zero or negative'),
      error: () => 'Invalid number',
    })

    expect(invalidDisplay).toBe('Zero or negative') // NaN is coerced to 0
  })

  it('should handle custom object transformations', () => {
    const successResult = attempt(() => ({ status: 'success', value: 42 }))

    const logMessage = match(successResult, {
      ok: (value) => ({
        level: 'info',
        message: `Operation succeeded with value: ${value.value}`,
      }),
      error: (err) => ({
        level: 'error',
        message: `Operation failed: ${err.message}`,
      }),
    })

    expect(logMessage).toEqual({
      level: 'info',
      message: 'Operation succeeded with value: 42',
    })
  })

  it('should handle errors in custom object transformations', () => {
    const failureResult = attempt(() => {
      throw new Error('Something went wrong')
    })

    const logMessage = match(failureResult, {
      ok: (value) => ({
        level: 'info',
        message: `Operation succeeded with value: ${value}`,
      }),
      error: (err) => ({
        level: 'error',
        message: `Operation failed: ${err.message}`,
      }),
    })

    expect(logMessage).toEqual({
      level: 'error',
      message: 'Operation failed: Something went wrong',
    })
  })
})

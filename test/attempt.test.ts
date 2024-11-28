import { describe, it, expect } from 'vitest'
import { attempt } from '../src/attempt'

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
})

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
})

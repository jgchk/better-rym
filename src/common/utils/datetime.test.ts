import { describe, expect, test } from 'vitest'

import { secondsToString } from './datetime'

describe('secondsToString', () => {
  test('gets rounding correct', () => {
    expect(secondsToString(59.4)).toBe('0:59')
    expect(secondsToString(59.5)).toBe('1:00')
  })
})

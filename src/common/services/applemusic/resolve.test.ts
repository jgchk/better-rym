import { describe, expect, test } from 'vitest'
import { convertAppleMusicDuration } from './resolve'

describe('convertAppleMusicDuration', () => {
  const cases = [
    ['PT3M14S', '3:14'],
    ['PT3M', '3:00'],
    ['PT14S', '0:14'],
  ]

  test.each(cases)('converts %s to %s', (input, output) => {
    expect(convertAppleMusicDuration(input)).toEqual(output)
  })
})

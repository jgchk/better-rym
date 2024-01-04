import { secondsToString } from './datetime'

describe('secondsToString', () => {
  test('gets rounding correct (real cases)', () => {
    expect(secondsToString(60000 / 1000)).toBe('1:00')
    expect(secondsToString(60440 / 1000)).toBe('1:00')
    expect(secondsToString(59760 / 1000)).toBe('0:59')
    expect(secondsToString(59925 / 1000)).toBe('0:59')
  })
})
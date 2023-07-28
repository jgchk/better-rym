import { regex } from './regex'

describe('spotify regex', () => {
  const validUrls = [
    'https://open.spotify.com/track/1PNk1Xno8t3spNEU78Hxsu',
    'https://open.spotify.com/intl-fr/track/1PNk1Xno8t3spNEU78Hxsu',
    'https://open.spotify.com/intl-es/track/1PNk1Xno8t3spNEU78Hxsu',
  ]

  const invalidUrls = [
    'https://open.spotify.com/trackk/1PNk1Xno8t3spNEU78Hxsu',
    'https://open.spotify.com/goober/track/1PNk1Xno8t3spNEU78Hxsu',
    'https://closed.spotify.com/track/1PNk1Xno8t3spNEU78Hxsu',
  ]

  test.each(validUrls)('correctly matches %p', (testCase) => {
    expect(testCase.match(regex)).toBeTruthy()
  })

  test.each(invalidUrls)('correctly matches %p', (testCase) => {
    expect(testCase.match(regex)).toBeFalsy()
  })
})

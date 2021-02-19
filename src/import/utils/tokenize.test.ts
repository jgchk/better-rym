import { splitPhrases } from './tokenize'

describe('split phrases', () => {
  const tests = [
    [
      'Otis! The Definitive Otis Redding.',
      ['Otis!', ' The Definitive Otis Redding.'],
    ],
    [
      'In Time: The Best of R.E.M.',
      ['In Time:', ' The Best of R.', 'E.', 'M.'],
    ],
    [
      "I'm Just a Singer (In a Rock 'n' Roll Band)",
      ["I'm Just a Singer ", "(In a Rock 'n' Roll Band)"],
    ],
    ['What (Howdy) Yay (Yo)', ['What ', '(Howdy)', ' Yay ', '(Yo)']],
  ] as const

  test.each(tests)('correctly splits %p', (input, output) =>
    expect(splitPhrases(input)).toEqual(output)
  )
})

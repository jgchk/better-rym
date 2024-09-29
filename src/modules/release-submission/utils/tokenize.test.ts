import { describe, expect, test } from 'vitest'

import { splitPhrases, tokenizePhrase } from './tokenize'

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
    expect(splitPhrases(input)).toEqual(output),
  )
})

describe('tokenize', () => {
  const tests = [
    ['A', [{ text: 'A', type: 'word' }]],
    [
      'One Two',
      [
        { text: 'One', type: 'word' },
        { text: ' ', type: 'whitespace' },
        { text: 'Two', type: 'word' },
      ],
    ],
    [
      'I’m Ready',
      [
        { text: 'I’m', type: 'word' },
        { text: ' ', type: 'whitespace' },
        { text: 'Ready', type: 'word' },
      ],
    ],
    ['Howžy', [{ text: 'Howžy', type: 'word' }]],
    [
      'Auto IV',
      [
        { text: 'Auto', type: 'word' },
        { text: ' ', type: 'whitespace' },
        { text: 'IV', type: 'romanNumeral' },
      ],
    ],
    [
      'Edifice/Riftworm',
      [
        { text: 'Edifice', type: 'word' },
        { text: '/', type: 'punctuation' },
        { text: 'Riftworm', type: 'word' },
      ],
    ],
  ] as const

  test.each(tests)('correctly tokenizes %p', (input, output) =>
    expect(tokenizePhrase(input)).toEqual(output),
  )
})

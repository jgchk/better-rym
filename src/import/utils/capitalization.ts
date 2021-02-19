import { findLastIndex } from '../../common/utils/array'
import { isUndefined } from '../../common/utils/types'
import { Phrase, tokenize } from './tokenize'

const ENG_DO_NOT_CAPITALIZE = new Set([
  'a',
  'an',
  'the',
  'and',
  'but',
  'or',
  'nor',
  'for',
  'yet',
  'so',
  'as',
  'at',
  'by',
  'for',
  'in',
  'of',
  'on',
  'to',
  'versus',
  'vs',
  'v',
  'n',
  'o',
])

const ENG_DO_NOT_CAPITALIZE_FORCE = new Set(['etc'])

const toTitleCase = (word: string) => {
  const firstLetter = word[0]
  return isUndefined(firstLetter)
    ? word
    : firstLetter.toUpperCase() + word.slice(1).toLowerCase()
}

export const capitalize = (text: string): string =>
  tokenize(text.toLowerCase()).map(capitalizePhrase).join('')

const capitalizePhrase = (phrase: Phrase): string => {
  const firstWordIndex = phrase.findIndex(({ type }) => type === 'word')
  const lastWordIndex = findLastIndex(phrase, ({ type }) => type === 'word')

  const parsed = phrase.map(({ text }, index) => {
    if (index === firstWordIndex || index === lastWordIndex) {
      return ENG_DO_NOT_CAPITALIZE_FORCE.has(text)
        ? text.toLowerCase()
        : toTitleCase(text)
    } else if (ENG_DO_NOT_CAPITALIZE.has(text)) {
      return text.toLowerCase()
    } else {
      return toTitleCase(text)
    }
  })

  return parsed.join('')
}

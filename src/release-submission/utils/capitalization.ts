import { findLastIndex } from '../../common/utils/array'
import { isUndefined } from '../../common/utils/types'
import { Phrase, Token, tokenize } from './tokenize'

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

const isWord = ({ type }: Token) => type === 'word' || type === 'romanNumeral'

const toTitleCase = ({ text, type }: Token) => {
  const firstLetter = text[0]
  if (isUndefined(firstLetter)) return text
  if (type === 'romanNumeral') return text.toUpperCase()
  return firstLetter.toUpperCase() + text.slice(1).toLowerCase()
}

export const capitalize = (text: string): string =>
  tokenize(text.toLowerCase()).map(capitalizePhrase).join('')

const capitalizePhrase = (phrase: Phrase): string => {
  const firstWordIndex = phrase.findIndex(isWord)
  const lastWordIndex = findLastIndex(phrase, isWord)

  const parsed = phrase.map((token, index) => {
    if (index === firstWordIndex || index === lastWordIndex) {
      return ENG_DO_NOT_CAPITALIZE_FORCE.has(token.text.toLowerCase())
        ? token.text.toLowerCase()
        : toTitleCase(token)
    } else if (ENG_DO_NOT_CAPITALIZE.has(token.text.toLowerCase())) {
      return token.text.toLowerCase()
    } else {
      return toTitleCase(token)
    }
  })

  return parsed.join('')
}

import { findLastIndex } from '../../common/utils/array'
import { Phrase, Token, tokenize } from './tokenize'

export const CAPITALIZATION_TYPES = [
  'title-case',
  'sentence-case',
  'as-is',
] as const
export type CapitalizationType = typeof CAPITALIZATION_TYPES[number]

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
  'vs.',
  'v',
  'v.',
  'n',
  "'n",
  "n'",
  "'n'",
  "o'",
  'o',
])

// Don't capitalize even if it's the first or last word
const ENG_DO_NOT_CAPITALIZE_FORCE = new Set(['etc', 'etc.'])

const isWord = ({ type }: Token) => type === 'word' || type === 'romanNumeral'

const toTitleCase = ({ text, type }: Token) => {
  if (!text[0]) return text
  if (type === 'romanNumeral') return text.toUpperCase()
  return text[0].toUpperCase() + text.slice(1).toLowerCase()
}

export const capitalize = (
  text: string,
  capitalization: CapitalizationType
): string =>
  capitalization === 'as-is'
    ? text
    : tokenize(text.toLowerCase())
        .map(capitalizePhrase(capitalization))
        .join('')

const capitalizePhrase = (
  capitalization: Exclude<CapitalizationType, 'as-is'>
) => (phrase: Phrase): string => {
  const firstWordIndex = phrase.findIndex(isWord)
  const lastWordIndex = findLastIndex(phrase, isWord)

  return capitalization === 'sentence-case'
    ? phrase
        .map((token, index) =>
          index === firstWordIndex
            ? toTitleCase(token)
            : token.type === 'romanNumeral'
            ? token.text.toUpperCase()
            : token.text.toLowerCase()
        )
        .join('')
    : phrase
        .map((token, index) => {
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
        .join('')
}

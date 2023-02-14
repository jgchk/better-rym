import { pipe } from '../../../common/utils/pipe'
import { regexIndexOf, regexLastIndexOf } from '../../../common/utils/string'

export type TokenType = 'word' | 'romanNumeral' | 'whitespace' | 'punctuation'

const parsers: [TokenType, RegExp][] = [
  [
    'romanNumeral',
    /(?!mi)(?=[cdilmvx])m*(c[dm]|d?c*)(x[cl]|l?x*)(i[vx]|v?i*)(?=\s|$|\)|]|}|"|”|-|:)/i,
  ],
  ['word', /[^\s"()/[\]{}“”-]+/],
  ['whitespace', /\s+/],
  ['punctuation', /[^\s\w]/],
]

export type Token = {
  text: string
  type: TokenType | 'unknown'
}

export type Phrase = Token[]

export const tokenize = (text: string): Phrase[] =>
  splitPhrases(text).map(tokenizePhrase)

export const tokenizePhrase = (text: string): Token[] => {
  const tokens: Token[] = []
  while (text) {
    let t: Token | undefined
    let matchIndex = text.length
    for (const [key, value] of parsers) {
      const match = value.exec(text)
      const matchText = match?.[0]
      // try to choose the best match if there are several
      // where "best" is the closest to the current starting point
      if (matchText && match && match.index < matchIndex) {
        t = {
          text: matchText,
          type: key,
        }
        matchIndex = match.index
      }
    }
    if (matchIndex) {
      // there is text between last token and currently
      // matched token - push that out as default or "unknown"
      tokens.push({
        text: text.slice(0, Math.max(0, matchIndex)),
        type: 'unknown',
      })
    }
    if (t) {
      // push current token onto sequence
      tokens.push(t)
    }
    text = text.slice(matchIndex + ((t && t.text?.length) ?? 0))
  }
  return tokens
}

const PUNCTUATION = new Set(['.', '!', ':'])
const OPENING_BRACKETS = new Set(['(', '[', '{'])
const CLOSING_BRACKETS = new Set([')', ']', '}'])

const DONT_SPLIT = ['vs.', 'v.', 'etc.']

export const splitPhrases = (text: string): string[] => {
  let lastSplitIndex = 0
  const phrases = []

  for (const [index, char] of [...text].entries()) {
    if (PUNCTUATION.has(char) || CLOSING_BRACKETS.has(char)) {
      const lastSlice = text.slice(lastSplitIndex, index + 1)
      if (DONT_SPLIT.some((word) => lastSlice.endsWith(word))) continue

      phrases.push(lastSlice)
      lastSplitIndex = index + 1
    } else if (char === '/') {
      let lastSlice = text.slice(lastSplitIndex, index)
      lastSlice = lastSlice.slice(
        0,
        pipe(regexLastIndexOf(lastSlice, /\S/), (index_) =>
          index_ === -1 ? undefined : index_ + 1
        )
      )
      phrases.push(lastSlice, ' / ')

      lastSplitIndex = regexIndexOf(text, /\S/, index + 1)
    } else if (OPENING_BRACKETS.has(char)) {
      phrases.push(text.slice(lastSplitIndex, index))
      lastSplitIndex = index
    }
  }

  if (lastSplitIndex < text.length) phrases.push(text.slice(lastSplitIndex))

  return phrases
}

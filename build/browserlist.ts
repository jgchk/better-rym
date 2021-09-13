import argv from 'webpack-nano/argv'

const BROWSERS = ['chrome', 'firefox'] as const
type Browser = typeof BROWSERS[number]
const isBrowser = (browser: string): browser is Browser =>
  (BROWSERS as readonly string[]).includes(browser)

const browserslists: Record<Browser, string> = Object.freeze({
  chrome: 'chrome >= 79',
  firefox: 'firefox >= 79',
})

const { browser } = argv
const browsers = (Array.isArray(browser)
  ? browser
  : browser === undefined
  ? ['chrome', 'firefox']
  : [browser]
).filter(isBrowser)
const browserslist = browsers
  .map((browser) => browserslists[browser])
  .join(', ')

export { browsers, browserslist }

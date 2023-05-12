import { fetch } from './fetch'

interface SearchResults {
  /** Whether there were no results found. */
  noResults: boolean
  /** The VQD of the search query. */
  vqd: string
  /** The web results of the search. */
  results: SearchResult[]
}

interface SearchResult {
  /** The hostname of the website. (i.e. "google.com") */
  hostname: string
  /** The URL of the result. */
  url: string
  /** The title of the result. */
  title: string
  /**
   * The sanitized description of the result.
   * Bold tags will still be present in this string.
   */
  description: string
  /** The description of the result. */
  rawDescription: string
  /** The icon of the website. */
  icon: string
  /** The ddg!bang information of the website, if any. */
  bang?: SearchResultBang
}

interface SearchResultBang {
  /** The prefix of the bang. (i.e. "w" for !w) */
  prefix: string
  /** The title of the bang. */
  title: string
  /** The domain of the bang. */
  domain: string
}

interface CallbackSearchResult {
  /** Website description */
  a: string
  /** Unknown */
  ae: null
  /** ddg!bang information (ex. w Wikipedia en.wikipedia.org) */
  b?: string
  /** URL */
  c: string
  /** URL of some sort. */
  d: string
  /** Class name associations. */
  da?: string
  /** Unknown */
  h: number
  /** Website hostname */
  i: string
  /** Unknown */
  k: null
  /** Unknown */
  m: number
  /** Unknown */
  o: number
  /** Unknown */
  p: number
  /** Unknown */
  s: string
  /** Website Title */
  t: string
  /** Website URL */
  u: string
}

interface CallbackNextSearch {
  /** URL to the next page of results */
  n: string
}

const VQD_REGEX = /vqd=["'](\d+(?:-\d+){1,2})["']/
const SEARCH_REGEX =
  /DDG\.pageLayout\.load\('d',(\[.+])\);DDG\.duckbar\.load\('images'/

const getVQD = async (query: string, ia = 'web') => {
  const response = await fetch({
    url: 'https://duckduckgo.com/',
    urlParameters: { q: query, ia },
  })

  const vqd = VQD_REGEX.exec(response)?.[1]

  if (vqd === undefined)
    throw new Error(`Failed to get the VQD for query "${query}"`)

  return vqd
}

const decode = (html: string) => {
  const txt = document.createElement('textarea')
  txt.innerHTML = html
  return txt.value
}

export const search = async (query: string): Promise<SearchResults> => {
  const vqd = await getVQD(query, 'web')

  const queryObject: Record<string, string> = {
    q: query,
    t: 'D',
    l: 'en-us',
    kl: 'wt-wt',
    s: '0',
    dl: 'en',
    ct: 'US',
    ss_mkt: 'us',
    df: 'a',
    vqd,
    ex: '-2',
    sp: '1',
    bpa: '1',
    biaexp: 'b',
    msvrtexp: 'b',
    nadse: 'b',
    eclsexp: 'b',
    tjsexp: 'b',
  }

  const res = await fetch({
    url: 'https://links.duckduckgo.com/d.js',
    urlParameters: queryObject,
  })

  if (res.includes('DDG.deep.is506')) {
    throw new Error('A DDG server error occurred!')
  }

  const resultsString = SEARCH_REGEX.exec(res)?.[1]?.replace(/\t/g, '    ')
  if (resultsString === undefined) {
    throw new Error('Could not find DDG search resutls')
  }

  const searchResults = JSON.parse(resultsString) as (
    | CallbackSearchResult
    | CallbackNextSearch
  )[]

  // check for no results
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (searchResults.length === 1 && !('n' in searchResults[0]!)) {
    const onlyResult = searchResults[0] as CallbackSearchResult
    if (
      (!onlyResult.da && onlyResult.t === 'EOF') ||
      !onlyResult.a ||
      onlyResult.d === 'google.com search'
    )
      return {
        noResults: true,
        vqd,
        results: [],
      }
  }

  const results: SearchResults = {
    noResults: false,
    vqd,
    results: [],
  }

  // Populate search results
  for (const search of searchResults) {
    if ('n' in search) continue
    let bang: SearchResultBang | undefined
    if (search.b) {
      const [prefix, title, domain] = search.b.split('\t')
      if (prefix !== undefined && title !== undefined && domain !== undefined) {
        bang = { prefix, title, domain }
      }
    }
    results.results.push({
      title: search.t,
      description: decode(search.a),
      rawDescription: search.a,
      hostname: search.i,
      icon: `https://external-content.duckduckgo.com/ip3/${search.i}.ico`,
      url: search.u,
      bang,
    })
  }

  return results
}

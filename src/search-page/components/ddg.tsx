import { FunctionComponent, h } from 'preact'
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks'

import { isTuple } from '../../common/utils/array'
import { fetch } from '../../common/utils/fetch'
import { pipe } from '../../common/utils/pipe'
import { ifDefined } from '../../common/utils/types'
import classes from '../styles/ddg.module.css'

enum SearchType {
  Everything = 'everything',
  Artist = 'a',
  Releases = 'l',
  VaRelease = 'y',
  Label = 'b',
  CatalogNo = 'j',
  Genre = 'g',
  Work = 'r',
  User = 'u',
  List = 's',
}

type CallbackSearchResult = {
  a: string
  ae: null
  b?: string
  c: string
  d: string
  da?: string
  h: number
  i: string
  k: null
  m: number
  o: number
  p: number
  s: string
  t: string
  u: string
}

type CallbackNextSearch = {
  n: string
}

type SearchResult = {
  hostname: string
  url: string
  title: string
  description: string
  rawDescription: string
  icon: string
  bang?: SearchResultBang
}

type SearchResultBang = {
  prefix: string
  title: string
  domain: string
}

const SEARCH_TYPE_PATHS: Record<SearchType, string> = {
  everything: '',
  a: 'artist',
  l: 'release',
  y: 'release',
  b: 'label',
  j: 'release',
  g: 'genre',
  r: 'work',
  u: '',
  s: 'list',
}

const VQD_REGEX = /vqd='(\d+-\d+-\d+)'/
const SEARCH_REGEX =
  /DDG\.pageLayout\.load\('d',(\[.+])\);DDG\.duckbar\.load\('images'/

const getVqd = async (query: string) => {
  const vqdRequest = await fetch({
    url: 'https://duckduckgo.com',
    urlParameters: { q: query, ia: 'web' },
  })
  const vqd = VQD_REGEX.exec(vqdRequest)?.[1]
  if (vqd === undefined)
    throw new Error(`Failed to get the VQD for query "${query}".`)
  return vqd
}

const decodeHTMLEntities = (text: string) => {
  const textArea = document.createElement('textarea')
  textArea.innerHTML = text
  return textArea.value
}

const search = async (query: string): Promise<SearchResult[]> => {
  const vqd = await getVqd(query)
  const body = await fetch({
    url: 'https://duckduckgo.com/d.js',
    urlParameters: {
      q: query,
      l: 'en-US',
      kl: 'wt-wt',
      s: '0',
      dl: 'en',
      ct: 'US',
      ss_mkt: 'us',
      df: 'a',
      ex: '-2',
      sp: '1',
      bpa: '1',
      cdrexp: 'b',
      biaexp: 'b',
      msvrtexp: 'b',
      vqd,
    },
  })

  if (body.includes('DDG.deep.is506'))
    throw new Error('A server error occurred!')

  const searchResults =
    pipe(
      SEARCH_REGEX.exec(body)?.[1]?.replace(/\t/g, '    '),
      ifDefined(
        (results) =>
          JSON.parse(results) as (CallbackSearchResult | CallbackNextSearch)[]
      )
    ) ?? []

  // check for no results
  if (isTuple(searchResults, 1) && !('n' in searchResults[0])) {
    const onlyResult = searchResults[0]
    if (
      (!onlyResult.da && onlyResult.t === 'EOF') ||
      !onlyResult.a ||
      onlyResult.d === 'google.com search'
    )
      return []
  }

  const results = []

  // Populate search results
  for (const search of searchResults) {
    if ('n' in search) continue
    let bang: SearchResultBang | undefined
    if (search.b) {
      const [prefix, title, domain] = search.b.split('\t')
      if (prefix !== undefined && title !== undefined && domain !== undefined)
        bang = { prefix, title, domain }
    }
    results.push({
      title: search.t,
      description: decodeHTMLEntities(search.a),
      rawDescription: search.a,
      hostname: search.i,
      icon: `https://external-content.duckduckgo.com/ip3/${search.i}.ico`,
      url: search.u,
      bang,
    })
  }

  return results
}

export const DDG: FunctionComponent = () => {
  const { searchTerm, searchType } = useMemo(() => {
    const parameters = new URLSearchParams(location.search)
    const searchTerm = parameters.get('searchterm') ?? ''
    const searchType = (parameters.get('searchtype') ||
      'everything') as SearchType
    return { searchTerm, searchType }
  }, [])

  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])

  const fetchResults = useCallback(async () => {
    setLoading(true)
    const rymPath = SEARCH_TYPE_PATHS[searchType]
    const query = `site:rateyourmusic.com/${rymPath} ${searchTerm}`
    const searchResults = await search(query)
    setResults(searchResults)
    setLoading(false)
  }, [searchTerm, searchType])
  useEffect(() => void fetchResults(), [fetchResults])

  if (loading) return <div>Loading...</div>
  return (
    <div className={classes.results}>
      {results.map((result) => (
        <a key={result.url}>
          <img src={result.icon} width={16} height={16} />
          <div>{result.url}</div>
          <div className={classes.title}>{result.title}</div>
          <div dangerouslySetInnerHTML={{ __html: result.description }} />
        </a>
      ))}
    </div>
  )
}

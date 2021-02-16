import { SearchFunction } from '..'
import { fetch, fetchJson } from '../../../common/utils/fetch'
import { isDefined, isUndefined } from '../../../common/utils/types'
import { MusicObject, SearchObject } from './codecs'

const getScriptUrls = async () => {
  const response = await fetch({ url: 'https://soundcloud.com' })
  return [
    ...response.matchAll(
      /<script crossorigin src="(https:\/\/a-v2\.sndcdn\.com\/assets\/[\da-z-]+\.js)"><\/script>/gm
    ),
  ]
    .map((match) => match[1])
    .filter(isDefined)
}

const fetchClientId = async (url: string) => {
  const response = await fetch({ url })
  return [...(/client_id:"([\dA-Za-z]+)"/.exec(response) ?? [])][1]
}

const scrapeClientId = async (urls: string[]) => {
  const maybeClientIds = await Promise.all(
    urls.map((url) => fetchClientId(url))
  )
  return maybeClientIds.find(isDefined)
}

const requestToken = async () => {
  const scriptUrls = await getScriptUrls()
  return scrapeClientId(scriptUrls)
}

export const search: SearchFunction = async ({ artist, title }) => {
  const token = await requestToken()
  if (isUndefined(token)) throw new Error('Could not find client id')

  const response = await fetchJson(
    {
      url: 'https://api-v2.soundcloud.com/search',
      urlParams: { q: `${artist} ${title}`, client_id: token },
    },
    SearchObject
  )
  return response.collection.find(MusicObject.is)?.permalink_url
}

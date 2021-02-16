import { fetch } from '../../utils/fetch'
import { isDefined } from '../../utils/types'

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

export const requestToken = async (): Promise<string | undefined> => {
  const scriptUrls = await getScriptUrls()
  return scrapeClientId(scriptUrls)
}

import { fetchUrl } from '../lib/fetch'
import sources from './sources'
import { deduplicate } from '../lib/array'

function getSource(link, includedSources) {
  return Object.keys(sources).find(
    key =>
      includedSources.includes(key.toLowerCase()) &&
      sources[key].regex.test(link)
  )
}

function getLinksBySource(links, includedSources) {
  return Object.assign(
    {},
    ...links.map(link => {
      const source = getSource(link, includedSources)
      if (source) return { [source.toLowerCase()]: link }
      return {}
    })
  )
}

export default async function getLinks(historyUrl, includedSources) {
  const response = await fetchUrl(historyUrl, 'GET', 'text')
  const $html = $(response)
  const $links = $html.find('a.normal_link')
  const links = deduplicate($links.map((i, link) => link.href).get())
  return getLinksBySource(links, includedSources)
}

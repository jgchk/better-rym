import { fetchUrl } from '../lib/fetch'
import { similarity } from '../lib/string'

const searchUrl = (title, artist, limit, sources, haveSources) => {
  let url = `https://jake.cafe/api/music/search?title=${encodeURIComponent(
    title
  )}&artist=${encodeURIComponent(artist)}&limit=${encodeURIComponent(limit)}`
  sources.forEach(source => {
    url += `&source=${source.toLowerCase()}`
  })
  haveSources.forEach(source => {
    url += `&haveSource=${source.toLowerCase()}`
  })
  return url
}

export default async function search(
  title,
  artist,
  sources = [],
  haveSources = [],
  limit = 1,
  similarityThreshold = 0.5
) {
  const url = searchUrl(title, artist, limit, sources, haveSources)
  const response = await fetchUrl(url)
  return Object.assign(
    {},
    ...Object.entries(response).map(([source, infos]) => {
      const filteredInfos = infos.filter(info => {
        const sim = similarity(
          `${artist} - ${title}`,
          `${artist} - ${info.title}`
        )
        return sim >= similarityThreshold
      })
      if (filteredInfos.length === 0) return {}
      return { [source]: filteredInfos }
    })
  )
}

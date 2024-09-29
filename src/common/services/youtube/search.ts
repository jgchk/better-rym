import { fetch } from '../../utils/fetch'
import { isDefined } from '../../utils/types'
import type { SearchFunction } from '../types'
import type { SearchObject } from './codecs'

export const search: SearchFunction = async ({ artist, title }) => {
  const response = await fetch({
    url: 'https://youtube.com/results',
    urlParameters: {
      search_query: `${artist} ${title}`,
    },
    credentials: 'omit',
  })

  const html = new DOMParser().parseFromString(response, 'text/html')
  const scripts = [...html.getElementsByTagName('script')]
  const dataScript = scripts.find((script) =>
    script.textContent?.includes('var ytInitialData'),
  )?.textContent
  if (dataScript === null || dataScript === undefined)
    throw new Error('Could not find search metadata tag')

  const searchObjectString = [
    ...(/var ytInitialData = ({.*});/.exec(dataScript) ?? []),
  ][1]
  if (!searchObjectString) throw new Error('Could not find search metadata')

  const searchObject = JSON.parse(searchObjectString) as SearchObject
  const videoData =
    searchObject.contents.twoColumnSearchResultsRenderer.primaryContents
      .sectionListRenderer.contents[0]?.itemSectionRenderer?.contents
  if (!videoData) throw new Error('Could not find video data')

  const videoId = videoData
    .map((video) => video.videoRenderer)
    .find(isDefined)?.videoId
  return videoId ? `https://www.youtube.com/watch?v=${videoId}` : undefined
}

import { stringToDate } from '../../utils/datetime'
import { fetch } from '../../utils/fetch'
import { getReleaseType } from '../../utils/music'
import { isDefined } from '../../utils/types'
import type { ReleaseLabel, ResolveFunction } from '../types'

// Helper function to extract and parse JSON data from Next.js script tag
const extractNextData = (document_: Document) => {
  const scriptElement = document_.querySelector('#__NEXT_DATA__')
  if (!scriptElement?.textContent) {
    throw new Error('Could not find __NEXT_DATA__ script tag')
  }
  
  try {
    return JSON.parse(scriptElement.textContent)
  } catch (error) {
    throw new Error('Failed to parse __NEXT_DATA__ JSON')
  }
}

const getTitle = (nextData: any) => {
  return nextData?.props?.pageProps?.release?.name
}

const getArtists = (nextData: any) => {
  const artists = nextData?.props?.pageProps?.release?.artists || []
  return artists.map((artist: any) => artist.name).filter(isDefined)
}

const getDate = (nextData: any) => {
  const dateString = nextData?.props?.pageProps?.release?.publish_date
  return !dateString ? undefined : stringToDate(dateString)
}

const getTracks = (nextData: any) => {
  // Extract tracks from dehydrated state queries
  const queries = nextData?.props?.pageProps?.dehydratedState?.queries || []
  const tracksQuery = queries.find((query: any) => 
    Array.isArray(query.queryKey) && query.queryKey[0] === 'tracks'
  )
  
  const tracks = tracksQuery?.state?.data?.results || []
  
  return tracks.map((track: any, index: number) => {
    const position = (index + 1).toString()
    
    // Build track title with mix name and remixer info
    let title = track.name || ''
    
    // Add mix name if it exists and isn't "Original Mix"
    if (track.mix_name && track.mix_name.toLowerCase() !== 'original mix') {
      title += ` (${track.mix_name})`
    }
    
    // Add remixer info if available
    const remixers = track.remixers || []
    if (remixers.length > 0) {
      const remixerNames = remixers.map((remixer: any) => remixer.name).join(', ')
      if (!title.includes('(')) {
        title += ` (${remixerNames} Remix)`
      }
    }
    
    // Add artist names if different from release artists
    const trackArtists = track.artists || []
    if (trackArtists.length > 0) {
      const artistNames = trackArtists.map((artist: any) => artist.name).join(', ')
      // Only add if it's different from the main release artist
      title = `${artistNames} - ${title}`
    }

    // Convert milliseconds to mm:ss format
    let duration: string | undefined
    if (track.length_ms) {
      const totalSeconds = Math.floor(track.length_ms / 1000)
      const minutes = Math.floor(totalSeconds / 60)
      const seconds = totalSeconds % 60
      duration = `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    return { position, title, duration }
  })
}

const getCoverArt = (nextData: any) => {
  const image = nextData?.props?.pageProps?.release?.image
  if (!image) return []
  
  // Get the highest resolution image
  const maxSizeUrl = image.uri?.replace(/\/\d+x\d+\//, '/0x0/')
  const originalUrl = image.uri
  
  return [maxSizeUrl, originalUrl].filter(isDefined)
}

const getLabel = (nextData: any): ReleaseLabel => {
  const label = nextData?.props?.pageProps?.release?.label
  
  return {
    name: label?.name,
    catno: nextData?.props?.pageProps?.release?.catalog_number
  }
}

export const resolve: ResolveFunction = async (url) => {
  const response = await fetch({ url })
  const document_ = new DOMParser().parseFromString(response, 'text/html')

  // Extract and parse the Next.js data
  const nextData = extractNextData(document_)

  const title = getTitle(nextData)
  const artists = getArtists(nextData)
  const date = getDate(nextData)
  const tracks = getTracks(nextData)
  const type = getReleaseType(tracks.length)
  const coverArt = getCoverArt(nextData)
  const label = getLabel(nextData)

  return {
    url,
    title,
    artists,
    date,
    tracks,
    type,
    format: 'lossless digital',
    attributes: ['downloadable', 'streaming'],
    label,
    coverArt,
  }
}

import { stringToDate } from '../../utils/datetime'
import { fetch } from '../../utils/fetch'
import { getReleaseType } from '../../utils/music'
import { isDefined } from '../../utils/types'
import type { ReleaseLabel, ResolveFunction } from '../types'

const getTitle = (document_: Document) => {
  // Strategy 1: Extract title from structured HTML elements
  // Look for the title in the page-head section
  const titleElement = document_.querySelector('.page-head .title, .page-head h1.title')
  if (titleElement) {
    const title = titleElement.textContent?.trim()
    if (title) {
      return title
    }
  }
  
  // Strategy 2: Look for the title in meta tags
  const ogTitle = document_
    .querySelector('meta[property="og:title"]')
    ?.getAttribute('content')
  if (ogTitle) {
    // If the title contains " - ", it's likely "Artist - Title" format
    // Extract just the title part (after the " - ")
    const dashMatch = ogTitle.match(/^.+?\s*-\s*(.+)$/)
    if (dashMatch) {
      return dashMatch[1].trim()
    }
    return ogTitle.trim()
  }

  // Strategy 3: Fallback to page title and extract release name
  const pageTitle = document_.querySelector('title')?.textContent
  if (pageTitle) {
    // Extract title before " on Traxsource"
    const match = pageTitle.match(/^(.+?)\s+on\s+Traxsource$/i)
    if (match) {
      const fullTitle = match[1].trim()
      // Again, check for "Artist - Title" format
      const dashMatch = fullTitle.match(/^.+?\s*-\s*(.+)$/)
      if (dashMatch) {
        return dashMatch[1].trim()
      }
      return fullTitle
    }
    return pageTitle.trim()
  }

  return undefined
}

const getArtists = (document_: Document) => {
  const artists: string[] = []
  
  // Strategy 1: Extract artists from structured HTML elements
  // Look for artist links ONLY in the page-head section (not from track listings)
  const artistElements = document_.querySelectorAll('.page-head .artists .com-artists')
  
  if (artistElements.length > 0) {
    artistElements.forEach((element) => {
      const artistName = element.textContent?.trim()
      if (artistName) {
        artists.push(artistName)
      }
    })
  }
  
  // Strategy 2: If no artists found, try to extract from meta tags
  if (artists.length === 0) {
    const ogTitle = document_
      .querySelector('meta[property="og:title"]')
      ?.getAttribute('content')
    if (ogTitle) {
      // Check if title has "Artist - Title" format
      const dashMatch = ogTitle.match(/^(.+?)\s*-\s*.+$/)
      if (dashMatch) {
        const artistsPart = dashMatch[1].trim()
        // Handle "feat." format properly
        if (artistsPart.includes(' feat.') || artistsPart.includes(' ft.')) {
          // Split on feat./ft. and treat both parts as separate artists
          const featMatch = artistsPart.match(/^(.+?)\s+(?:feat\.?|ft\.?)\s+(.+)$/i)
          if (featMatch) {
            artists.push(featMatch[1].trim(), featMatch[2].trim())
          } else {
            artists.push(artistsPart)
          }
        } else if (artistsPart.includes(', ')) {
          // For comma separation, be more careful - only split on ", " (comma + space)
          // to avoid breaking names like "Kiko Navarro"
          const splitArtists = artistsPart.split(', ')
          artists.push(...splitArtists.map(a => a.trim()).filter(a => a.length > 0))
        } else {
          // Single artist
          artists.push(artistsPart)
        }
      }
    }
  }

  // Strategy 3: If no artists found from title, try to extract from page title
  if (artists.length === 0) {
    const pageTitle = document_.querySelector('title')?.textContent
    if (pageTitle) {
      const match = pageTitle.match(/^(.+?)\s+on\s+Traxsource$/i)
      if (match) {
        const fullTitle = match[1].trim()
        const dashMatch = fullTitle.match(/^(.+?)\s*-\s*.+$/)
        if (dashMatch) {
          const artistsPart = dashMatch[1].trim()
          // Handle "feat." format properly
          if (artistsPart.includes(' feat.') || artistsPart.includes(' ft.')) {
            // Split on feat./ft. and treat both parts as separate artists
            const featMatch = artistsPart.match(/^(.+?)\s+(?:feat\.?|ft\.?)\s+(.+)$/i)
            if (featMatch) {
              artists.push(featMatch[1].trim(), featMatch[2].trim())
            } else {
              artists.push(artistsPart)
            }
          } else if (artistsPart.includes(', ')) {
            // For comma separation, be more careful - only split on ", " (comma + space)
            const splitArtists = artistsPart.split(', ')
            artists.push(...splitArtists.map(a => a.trim()).filter(a => a.length > 0))
          } else {
            // Single artist
            artists.push(artistsPart)
          }
        }
      }
    }
  }

  // Strategy 4: Fallback - if still no artists, extract just the most common artists from track listings
  // This should be a last resort and should try to identify the main release artists
  if (artists.length === 0) {
    const artistLinks = document_.querySelectorAll(
      '.trk-cell.artists .com-artists',
    )
    if (artistLinks.length > 0) {
      // Count frequency of each artist
      const artistCounts = new Map<string, number>()
      artistLinks.forEach((link) => {
        const artistName = link.textContent?.trim()
        if (artistName) {
          artistCounts.set(artistName, (artistCounts.get(artistName) || 0) + 1)
        }
      })
      
      // Only include artists that appear on most tracks (likely main artists)
      const totalTracks = document_.querySelectorAll('.trk-row').length
      const threshold = Math.ceil(totalTracks * 0.7) // Artist must appear on at least 70% of tracks
      
      for (const [artistName, count] of artistCounts.entries()) {
        if (count >= threshold) {
          artists.push(artistName)
        }
      }
      
      // If no artists meet the threshold, take the most frequent ones (up to 3)
      if (artists.length === 0) {
        const sortedArtists = Array.from(artistCounts.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([name]) => name)
        artists.push(...sortedArtists)
      }
    }
  }

  return artists.length > 0 ? artists : []
}

const getDate = (document_: Document) => {
  // Try to extract date from visible elements
  const dateSelectors = [
    '.bsd-detail-release-date',
    '.release-date',
    '[class*="release-date"]'
  ];

  for (const selector of dateSelectors) {
    const element = document_.querySelector(selector)
    if (element) {
      const text = element.textContent?.trim()
      if (text) {
        return stringToDate(text)
      }
    }
  }

  // Look for the release date in the main content area
  // Check for the pattern "Label | CatNo | Date" format
  const textContent = document_.body?.textContent || ''
  const datePattern = /\d{4}-\d{2}-\d{2}/g
  const matches = textContent.match(datePattern)
  if (matches && matches.length > 0) {
    // Return the first valid date found
    for (const match of matches) {
      const date = stringToDate(match)
      if (date) {
        return date
      }
    }
  }

  // Fallback: Look for date patterns in the page content or scripts
  const scripts = document_.querySelectorAll('script')
  for (const script of scripts) {
    const content = script.textContent || ''
    const dateMatch = content.match(/release.*date.*?(\d{4}-\d{2}-\d{2})/i)
    if (dateMatch) {
      return stringToDate(dateMatch[1])
    }
  }

  return undefined
}
const getTracks = (document_: Document) => {
  const tracks = []

  // Extract tracks from the track listing
  const trackRows = document_.querySelectorAll('.trk-row')

  for (const row of trackRows) {
    const positionElement = row.querySelector('.tnum')
    const position = positionElement?.textContent?.trim()

    const titleElement = row.querySelector('.trk-cell.title a')
    let title = titleElement?.textContent?.trim()

    // Get the version/remix info
    const versionElement = row.querySelector('.trk-cell.title .version')
    let version = versionElement?.textContent?.trim()

    // Clean up version text and append to title if it's not "Original Mix"
    if (version) {
      // Remove duration from version
      version = version.replace(/\s*\(\d+:\d+\)\s*$/, '').trim()
      if (
        version &&
        version.toLowerCase() !== 'original mix' &&
        !title?.includes(version)
      ) {
        title += ` (${version})`
      }
    }

    // Extract track-specific artists (if different from main release artists)
    // Try multiple selectors to get all artists for this track
    let trackArtists: string[] | undefined
    
    // Try to get all artist links for this track
    const artistLinks = row.querySelectorAll('.trk-cell.artists .com-artists')
    
    if (artistLinks.length > 0) {
      const artists: string[] = []
      artistLinks.forEach((link) => {
        const artistText = link.textContent?.trim()
        if (artistText) {
          artists.push(artistText)
        }
      })
      if (artists.length > 0) {
        trackArtists = artists
      }
    }
    
    // Fallback: try to extract from the entire artists cell text
    if (!trackArtists) {
      const trackArtistCell = row.querySelector('.trk-cell.artists')
      if (trackArtistCell) {
        const cellText = trackArtistCell.textContent?.trim()
        if (cellText) {
          // Remove "follow:" text if present
          const cleanText = cellText.replace(/follow:\s*/gi, '').trim()
          if (cleanText) {
            // Split by common separators and clean up
            const artistParts = cleanText.split(/\s*,\s+/)
            trackArtists = artistParts
              .map(a => a.trim())
              .filter(a => a.length > 0 && !a.toLowerCase().includes('recording'))
          }
        }
      }
    }

    // Extract duration
    const durationElement = row.querySelector('.duration')
    let duration = durationElement?.textContent?.trim()

    // Clean up duration format
    if (duration) {
      duration = duration.replace(/[()]/g, '').trim()
    }

    if (title) {
      const track: any = { position, title, duration }
      // Only include track artists if they're different from main artists
      if (trackArtists && trackArtists.length > 0) {
        track.artists = trackArtists
      }
      tracks.push(track)
    }
  }

  return tracks
}

const getCoverArt = (document_: Document) => {
  const urls: string[] = []

  // Look for cover art in meta tags
  const ogImage = document_
    .querySelector('meta[property="og:image"]')
    ?.getAttribute('content')
  if (ogImage) {
    urls.push(ogImage)
  }

  // Look for higher resolution images by modifying the URL
  if (ogImage && ogImage.includes('/files/images/')) {
    // Try to get a larger version by removing size constraints
    const largerUrl = ogImage.replace(/\/\d+x\d+\//, '/1200x1200/')
    if (largerUrl !== ogImage) {
      urls.unshift(largerUrl)
    }
  }

  return urls.filter(isDefined)
}

const getLabel = (document_: Document): ReleaseLabel => {
  let labelName: string | undefined
  let catno: string | undefined

  console.log('getLabel - Starting label extraction')
  
  // Strategy 1: Extract label from structured HTML elements
  // Look for the label link in the page-head section
  const labelElement = document_.querySelector('.page-head .com-label, a.com-label')
  if (labelElement) {
    labelName = labelElement.textContent?.trim()
    console.log('getLabel - Found label from .com-label element:', labelName)
  }
  
  // Extract catalog number from the cat-rdate div
  const catRdateElement = document_.querySelector('.cat-rdate')
  if (catRdateElement) {
    const catRdateText = catRdateElement.textContent?.trim()
    console.log('getLabel - Found cat-rdate text:', catRdateText)
    
    if (catRdateText) {
      // Extract catalog number from pattern like "GCM312 | 2025-08-01"
      const catnoMatch = catRdateText.match(/^([A-Z0-9\-\.]+)\s+\|/)
      if (catnoMatch) {
        catno = catnoMatch[1].trim()
        console.log('getLabel - Found catalog number from cat-rdate:', catno)
      }
    }
  }
  
  // Strategy 2: Fallback to text-based extraction if DOM elements not found
  if (!labelName || !catno) {
    console.log('getLabel - Falling back to text-based extraction')
    
    const content = document_.body?.textContent || ''
    
    // Look for the pattern "CATNO | Date" and work backwards to find the label
    const catnoDatePattern = /([A-Z0-9\-\.]+)\s+\|\s+(\d{4}-\d{2}-\d{2})/g
    const matches = [...content.matchAll(catnoDatePattern)]
    
    console.log('getLabel - Found catalog/date matches:', matches.map(m => ({ catno: m[1], date: m[2], fullMatch: m[0] })))
    
    if (matches.length > 0) {
      for (const match of matches) {
        const potentialCatno = match[1].trim()
        const date = match[2].trim()
        
        // Use catalog number if we don't have one yet
        if (!catno) {
          catno = potentialCatno
          console.log('getLabel - Using catalog from text match:', catno)
        }
        
        // Look for label if we don't have one yet
        if (!labelName) {
          // Find the text immediately before this catalog number pattern
          const beforeCatno = content.substring(0, match.index)
          
          console.log('getLabel - Text before catno (last 200 chars):', beforeCatno.slice(-200))
          
          // Look for "Label CATNO" pattern - the label should be the word directly before catno
          const directLabelPattern = new RegExp(`([A-Za-z][A-Za-z\s]+?)\s+${potentialCatno.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g')
          const directMatches = [...beforeCatno.matchAll(directLabelPattern)]
          console.log('getLabel - Direct pattern matches:', directMatches.map(m => m[1]))
          
          if (directMatches.length > 0) {
            // Get the last match (most recent occurrence)
            const lastMatch = directMatches[directMatches.length - 1]
            const candidate = lastMatch[1].trim()
            
            // Validate that this looks like a label name
            if (candidate && 
                candidate.length >= 3 && 
                candidate.length <= 30 &&
                // Exclude obvious artist names (First Last pattern)
                !candidate.match(/^[A-Z][a-z]+\s+[A-Z][a-z]+$/) &&
                // Exclude common title/track words
                !candidate.match(/\b(Again|Together|Back|Love|Song|Mix|Remix|Edit|Version|Extended|Original|Club|Radio|Instrumental|Vocal|Dub)\b/i) &&
                // Avoid timestamps
                !/\d{1,2}:\d{2}/.test(candidate)) {
              labelName = candidate
              console.log('getLabel - Found label with direct pattern:', labelName)
            }
          }
        }
        
        // Break if we have both label and catalog
        if (labelName && catno) {
          break
        }
      }
    }
  }
  
  console.log('getLabel - Final result:', { labelName, catno })
  return { name: labelName || undefined, catno: catno || undefined }
}

export const resolve: ResolveFunction = async (url) => {
  const response = await fetch({ url })
  const document_ = new DOMParser().parseFromString(response, 'text/html')

  const title = getTitle(document_)
  const artists = getArtists(document_)
  const date = getDate(document_)
  const tracks = getTracks(document_)
  const type = getReleaseType(tracks.length)
  const coverArt = getCoverArt(document_)
  const label = getLabel(document_)

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

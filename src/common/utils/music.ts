import type { ReleaseType } from '../services/types'

export const getReleaseType = (numberOfTracks: number): ReleaseType => {
  if (numberOfTracks <= 3) return 'single'
  if (numberOfTracks <= 6) return 'ep'
  return 'album'
}

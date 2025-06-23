import {
  MUSIC_CACHE_KEY,
  MUSIC_GENRES_CSV_URL,
} from '../remote-data'
import addDropdown from './add-dropdown'

export default async function addGenreDropdown(): Promise<void> {
  await addDropdown('Genre', 'genre', MUSIC_CACHE_KEY, MUSIC_GENRES_CSV_URL, 'musicGenres')
}

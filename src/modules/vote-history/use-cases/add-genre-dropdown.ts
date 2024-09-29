import { genres } from '../data/genres'
import addDropdown from './add-dropdown'

export default async function addGenreDropdown() {
  await addDropdown('Genre', 'genre', genres)
}

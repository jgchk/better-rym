import addDropdown from './add-dropdown'
import { genres } from '../data/genres'

export default function addGenreDropdown() {
  addDropdown('Genre', 'genre', genres)
}

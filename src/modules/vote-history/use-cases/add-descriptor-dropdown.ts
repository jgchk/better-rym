import {
  DESCRIPTORS_CACHE_KEY,
  DESCRIPTORS_CSV_URL,
} from '../remote-data'
import addDropdown from './add-dropdown'

export default async function addDescriptorDropdown(): Promise<void> {
  await addDropdown(
    'Descriptor',
    'descriptor',
    DESCRIPTORS_CACHE_KEY,
    DESCRIPTORS_CSV_URL,
    'descriptors',
  )
}

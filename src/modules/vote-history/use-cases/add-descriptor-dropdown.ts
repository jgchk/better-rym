import descriptors from '../data/descriptors'
import addDropdown from './add-dropdown'

export default async function addDescriptorDropdown() {
  await addDropdown('Descriptor', 'descriptor', descriptors)
}

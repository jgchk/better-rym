import addDescriptorDropdown from './use-cases/add-descriptor-dropdown'
import fixPaginationParameters from './use-cases/fix-pagination-parameters'

async function main() {
  await Promise.all([fixPaginationParameters(), addDescriptorDropdown()])
}

void main()

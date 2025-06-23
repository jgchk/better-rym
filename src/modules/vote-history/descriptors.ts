import { pages, runPage } from '~/common/pages'

import runCommonVoteHistoryLogic from './common'
import addDescriptorDropdown from './use-cases/add-descriptor-dropdown'

async function main() {
  await runCommonVoteHistoryLogic()
  await addDescriptorDropdown()
}

void runPage(pages.voteHistoryDescriptors, () => {
  void main()
})

import fixPaginationParameters from './use-cases/fix-pagination-parameters'

export default async function runCommonVoteHistoryLogic(): Promise<void> {
  // Logic that should run on both music and film genre vote history pages
  await fixPaginationParameters()
} 
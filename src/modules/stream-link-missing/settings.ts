import { DisplayType } from './types'

const displayTypeKey = 'brym.missingLinksDisplayType'
export const defaultDisplayType = 'available'

export const getDisplayType = async (): Promise<DisplayType> => {
  const response = await browser.storage.local.get(displayTypeKey)
  return (response[displayTypeKey] as DisplayType) ?? defaultDisplayType
}

export const setDisplayType = async (value: DisplayType): Promise<void> =>
  browser.storage.local.set({ [displayTypeKey]: value })

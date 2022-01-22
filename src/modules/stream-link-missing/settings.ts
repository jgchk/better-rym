import * as storage from '../../common/utils/storage'
import { DisplayType } from './types'

const displayTypeKey = 'brym.missingLinksDisplayType'
export const defaultDisplayType = 'available'

export const getDisplayType = async (): Promise<DisplayType> =>
  (await storage.get(displayTypeKey)) ?? defaultDisplayType

export const setDisplayType = async (value: DisplayType): Promise<void> =>
  storage.set(displayTypeKey, value)

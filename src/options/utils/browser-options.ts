export const getBrowserOption = async <T>(
  key: string,
  defaultValue: T
): Promise<T> => {
  const savedValues = await browser.storage.sync.get(key)
  const value = savedValues[key] as T
  return value !== undefined ? value : defaultValue
}

export const setBrowserOption = <T>(key: string, value: T): Promise<void> =>
  browser.storage.sync.set({ [key]: value })

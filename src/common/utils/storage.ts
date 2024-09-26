import browser from 'webextension-polyfill'

export const get = async <T>(key: string): Promise<T | undefined> => {
  const response = await browser.storage.local.get(key)
  return response[key] as T
}

export const getAll = (): Promise<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}> => browser.storage.local.get()

export const set = <T>(key: string, value: T): Promise<void> =>
  browser.storage.local.set({ [key]: value })

export const remove = (key: string): Promise<void> =>
  browser.storage.local.remove(key)

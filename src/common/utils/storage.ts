export const get = async <T>(key: string): Promise<T | undefined> => {
  const response = await chrome.storage.local.get(key)
  return response[key] as T
}

export const getAll = (): Promise<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}> => chrome.storage.local.get()

export const set = <T>(key: string, value: T): Promise<void> =>
  chrome.storage.local.set({ [key]: value })

export const remove = (key: string): Promise<void> =>
  chrome.storage.local.remove(key)

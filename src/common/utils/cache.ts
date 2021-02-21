import { isDefined, isNotNull, isUndefined } from './types'

interface StoredValue<T> {
  expire: number
  data: T
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isStoredValue = <T>(o: any): o is StoredValue<T> =>
  isDefined(o) &&
  isNotNull(o) &&
  typeof o === 'object' &&
  Object.prototype.hasOwnProperty.call(o, 'expire') &&
  Object.prototype.hasOwnProperty.call(o, 'data')

const isExpired = <T>({ expire }: StoredValue<T>) => Date.now() > expire

const parseStoredValue = <T>(s: string) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const storedValue = JSON.parse(s)
  return isStoredValue<T>(storedValue) ? storedValue : undefined
}

export const get = async <T>(key: string): Promise<T | undefined> => {
  const response = await browser.storage.local.get(key)
  const storedValue = response[key] as StoredValue<T> | undefined
  if (isUndefined(storedValue)) {
    return undefined
  } else {
    if (isExpired(storedValue)) {
      void browser.storage.local.remove(key)
      return undefined
    } else {
      return storedValue.data
    }
  }
}

export const set = async <T>(
  key: string,
  value: T,
  ttl = 3600000
): Promise<void> => {
  console.log('store!!!', value)
  const storedValue: StoredValue<T> = { expire: Date.now() + ttl, data: value }
  await browser.storage.local.set({ [key]: storedValue })
}

export const clean = async (): Promise<void> => {
  const wholeStorage = await browser.storage.local.get()
  await Promise.all(
    Object.entries(wholeStorage).map(async ([key, value]) => {
      const storedValue = parseStoredValue(value)
      if (isDefined(storedValue) && isExpired(storedValue))
        await browser.storage.local.remove(key)
    })
  )
}

import { ServiceId } from '../services/types'

interface StoredValue<T> {
  expire: number
  data: T
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isStoredValue = <T>(o: any): o is StoredValue<T> =>
  o != null &&
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
  if (storedValue !== undefined) {
    if (isExpired(storedValue)) {
      void browser.storage.local.remove(key)
    } else {
      return storedValue.data
    }
  }
  return undefined
}

export const set = async <T>(
  key: string,
  value: T,
  ttl = 3_600_000
): Promise<void> => {
  const storedValue: StoredValue<T> = { expire: Date.now() + ttl, data: value }
  await browser.storage.local.set({ [key]: storedValue })
}

export const clean = async (): Promise<void> => {
  const wholeStorage = await browser.storage.local.get()
  await Promise.all(
    Object.entries(wholeStorage).map(async ([key, value]) => {
      const storedValue = parseStoredValue(value)
      if (storedValue !== undefined && isExpired(storedValue))
        await browser.storage.local.remove(key)
    })
  )
}

export const withCache =
  <A, T>(
    serviceId: ServiceId,
    functionName: string,
    function_: (...arguments_: A[]) => T | Promise<T>
  ) =>
  async (...arguments_: A[]): Promise<T> => {
    const key = JSON.stringify({
      service: serviceId,
      func: functionName,
      params: arguments_,
    })
    const cached = await get<T>(key)
    if (cached !== undefined) return cached

    const result = await function_(...arguments_)
    if (result !== undefined) void set(key, result)
    return result
  }

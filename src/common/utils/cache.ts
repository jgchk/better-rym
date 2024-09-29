import * as storage from './storage'

type StoredValue<T> = {
  expire: number
  data: T
}

const isExpired = <T>({ expire }: StoredValue<T>) => Date.now() > expire

export const get = async <T>(key: string): Promise<T | undefined> => {
  const storedValue = await storage.get<StoredValue<T>>(key)
  if (storedValue !== undefined) {
    if (isExpired(storedValue)) {
      void storage.remove(key)
    } else {
      return storedValue.data
    }
  }
  return undefined
}

export const set = async <T>(
  key: string,
  value: T,
  ttl = 3_600_000,
): Promise<void> => {
  const storedValue: StoredValue<T> = { expire: Date.now() + ttl, data: value }
  await storage.set(key, storedValue)
  void clean()
}

export const clean = async (): Promise<void> => {
  const wholeStorage = await storage.getAll()
  await Promise.all(
    Object.entries(wholeStorage).map(async ([key, value]) => {
      const storedValue = value as StoredValue<unknown> | undefined
      if (storedValue !== undefined && isExpired(storedValue)) {
        await storage.remove(key)
      }
    }),
  )
}

export const withCache =
  <A, T>(
    key: string,
    function_: (...arguments_: A[]) => T | Promise<T>,
    ttl?: number,
  ) =>
  async (...arguments_: A[]): Promise<T> => {
    const argumentKey = JSON.stringify([key, arguments_])
    const cached = await get<T>(argumentKey)
    if (cached !== undefined) return cached

    const result = await function_(...arguments_)
    if (result !== undefined) void set(argumentKey, result, ttl)
    return result
  }

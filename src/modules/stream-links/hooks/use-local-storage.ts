import { useCallback, useEffect, useState } from 'preact/hooks'

import * as storage from '../../../common/utils/storage'

export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T | undefined, (value: T) => void] => {
  const readValue = useCallback(async (): Promise<T> => {
    const item = await storage.get<T>(key)
    return item ?? initialValue
  }, [initialValue, key])

  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>()

  const setInitial = useCallback(
    async () => setStoredValue(await readValue()),
    [readValue]
  )
  useEffect(() => void setInitial(), [setInitial])

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = useCallback(
    async (value: T) => {
      await storage.set(key, value)
      setStoredValue(value)
    },
    [key]
  )

  return [storedValue, setValue]
}

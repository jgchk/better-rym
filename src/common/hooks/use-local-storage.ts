import { useCallback, useEffect, useState } from 'preact/hooks'

export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T | undefined, (value: T) => void] => {
  const readValue = useCallback(async (): Promise<T> => {
    const response = await browser.storage.local.get(key)
    const item = response[key] as T | undefined
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
      await browser.storage.local.set({ [key]: value })
      setStoredValue(value)
    },
    [key]
  )

  return [storedValue, setValue]
}

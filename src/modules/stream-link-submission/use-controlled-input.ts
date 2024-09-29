import { useCallback, useEffect, useState } from 'preact/hooks'

export const useControlledInput = (
  input: HTMLInputElement,
): readonly [string, (value: string) => void] => {
  const [value, setValue] = useState(input.value)

  useEffect(() => {
    const listener = (event: Event) =>
      setValue((event.target as HTMLInputElement).value)
    input.addEventListener('input', listener)
    return () => input.removeEventListener('input', listener)
  }, [input])

  const setInputValue = useCallback(
    (value: string) => {
      input.value = value
    },
    [input],
  )

  return [value, setInputValue] as const
}

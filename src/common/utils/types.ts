export const isDefined = <T>(t: T | undefined): t is T => t !== undefined

export const ifDefined =
  <I, O>(function_: (index: I) => O) =>
  (index: I | undefined): O | undefined =>
    index !== undefined ? function_(index) : undefined

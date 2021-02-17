export const isUndefined = <T>(t: T | undefined): t is undefined =>
  t === undefined
export const asUndefined = <T>(t: T | undefined): undefined | false =>
  isUndefined(t) ? t : false

export const isDefined = <T>(t: T | undefined): t is T => t !== undefined
export const asDefined = <T>(t: T | undefined): T | false =>
  isDefined(t) ? t : false

export const isNull = <T>(t: T | null): t is null => t === null
export const isNotNull = <T>(t: T | null): t is T => t !== null

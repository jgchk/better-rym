import { None, Option, Some, isNone, isSome } from 'fp-ts/Option'

export const asSome = <T>(option: Option<T>): Some<T> | false =>
  isSome(option) ? option : false
export const asNone = <T>(option: Option<T>): None | false =>
  isNone(option) ? option : false

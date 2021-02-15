export type Initial = { type: 'initial' }
export type Loading = { type: 'loading' }
export type Complete<T> = { type: 'complete'; data: T }
export type Failed = { type: 'failed'; error: Error }

export type OneShot<T> = Initial | Loading | Complete<T> | Failed

export const initial: Initial = { type: 'initial' }
export const loading: Loading = { type: 'loading' }
export const complete = <T>(data: T): Complete<T> => ({
  type: 'complete',
  data,
})
export const failed = (error: Error): Failed => ({ type: 'failed', error })

export const isInitial = <T>(oneShot: OneShot<T>): oneShot is Initial =>
  oneShot.type === 'initial'
export const isLoading = <T>(oneShot: OneShot<T>): oneShot is Loading =>
  oneShot.type === 'loading'
export const isComplete = <T>(oneShot: OneShot<T>): oneShot is Complete<T> =>
  oneShot.type === 'complete'
export const isFailed = <T>(oneShot: OneShot<T>): oneShot is Failed =>
  oneShot.type === 'failed'

export const asInitial = <T>(oneShot: OneShot<T>): Initial | false =>
  isInitial(oneShot) ? oneShot : false
export const asLoading = <T>(oneShot: OneShot<T>): Loading | false =>
  isLoading(oneShot) ? oneShot : false
export const asComplete = <T>(oneShot: OneShot<T>): Complete<T> | false =>
  isComplete(oneShot) ? oneShot : false
export const asFailed = <T>(oneShot: OneShot<T>): Failed | false =>
  isFailed(oneShot) ? oneShot : false

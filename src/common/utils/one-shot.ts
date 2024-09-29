export type Initial = { type: 'initial' }
export type Loading = { type: 'loading' }
export type Failed<E> = { type: 'failed'; error: E }
export type Complete<T> = { type: 'complete'; data: T }

export type OneShot<E, T> = Initial | Loading | Failed<E> | Complete<T>

export const initial: Initial = { type: 'initial' }
export const loading: Loading = { type: 'loading' }
export const failed = <E>(error: E): Failed<E> => ({ type: 'failed', error })
export const complete = <T>(data: T): Complete<T> => ({
  type: 'complete',
  data,
})

export const isInitial = <E, T>(oneShot: OneShot<E, T>): oneShot is Initial =>
  oneShot.type === 'initial'
export const isLoading = <E, T>(oneShot: OneShot<E, T>): oneShot is Loading =>
  oneShot.type === 'loading'
export const isFailed = <E, T>(oneShot: OneShot<E, T>): oneShot is Failed<E> =>
  oneShot.type === 'failed'
export const isComplete = <E, T>(
  oneShot: OneShot<E, T>,
): oneShot is Complete<T> => oneShot.type === 'complete'

export const fold =
  <E, A, B>(
    onInitial: () => B,
    onLoading: () => B,
    onFailed: (error: E) => B,
    onComplete: (data: A) => B,
  ) =>
  (oneShot: OneShot<E, A>): B => {
    switch (oneShot.type) {
      case 'initial':
        return onInitial()
      case 'loading':
        return onLoading()
      case 'failed':
        return onFailed(oneShot.error)
      case 'complete':
        return onComplete(oneShot.data)
    }
  }

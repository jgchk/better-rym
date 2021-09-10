export const isDocumentReady = (): boolean =>
  document.readyState === 'complete' || document.readyState === 'interactive'

export const waitForElement = <E extends Element>(query: string): Promise<E> =>
  waitForCallback(() => document.querySelector<E>(query) ?? undefined)

export const waitForCallback = <T>(callback: () => T | undefined): Promise<T> =>
  new Promise((resolve, reject) => {
    if (isDocumentReady()) {
      const result = callback()
      if (result !== undefined) resolve(result)
      else reject(new Error(`Callback never resolved`))
    } else {
      new MutationObserver((_m, observer) => {
        if (!document.body) return

        const result = callback()
        if (result !== undefined) {
          resolve(result)
          observer.disconnect()
        }

        // Document is fully loaded and we didn't find what we were looking for
        if (isDocumentReady()) {
          reject(new Error(`Callback never resolved`))
          observer.disconnect()
        }
      }).observe(document, {
        childList: true,
        subtree: true,
      })
    }
  })

export const forceQuerySelector = <E extends Element = Element>(
  node: ParentNode
) => (query: string): E => {
  const element = node.querySelector<E>(query)
  if (!element) throw new Error(`Could not find element: ${query}`)
  return element
}

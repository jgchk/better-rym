import { isNull } from './types'

export const waitForDocumentReady = (): Promise<void> =>
  new Promise((resolve) => {
    if (
      document.readyState === 'complete' ||
      document.readyState === 'interactive'
    ) {
      resolve()
    } else {
      document.addEventListener('DOMContentLoaded', () => resolve())
    }
  })

export const waitForElement = <E extends Element>(query: string): Promise<E> =>
  new Promise((resolve) => {
    new MutationObserver((mutations, observer) => {
      if (!document.body) return

      const element = document.querySelector<E>(query)
      if (!element) return

      resolve(element)
      observer.disconnect()
    }).observe(document, {
      childList: true,
      subtree: true,
    })
  })

export const forceQuerySelector = <E extends Element = Element>(
  node: ParentNode
) => (query: string): E => {
  const element = node.querySelector<E>(query)
  if (isNull(element)) throw new Error(`Could not find element: ${query}`)
  return element
}

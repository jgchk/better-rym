import { rejects } from 'assert'
import { isNull } from './types'

const isDocumentReady = () =>
  document.readyState === 'complete' || document.readyState === 'interactive'

export const waitForDocumentReady = (): Promise<void> =>
  new Promise((resolve) => {
    if (isDocumentReady()) {
      resolve()
    } else {
      document.addEventListener('DOMContentLoaded', () => resolve())
    }
  })

export const waitForElement = <E extends Element>(query: string): Promise<E> =>
  new Promise((resolve, reject) => {
    new MutationObserver((mutations, observer) => {
      if (!document.body) return

      const element = document.querySelector<E>(query)
      if (element) {
        resolve(element)
        observer.disconnect()
      }

      // Document is fully loaded and we didn't find what we were looking for
      if (isDocumentReady()) {
        reject(new Error(`Could not find element: ${query}`))
        observer.disconnect()
      }
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

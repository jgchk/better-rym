export const isDocumentReady = (): boolean =>
  document.readyState === 'complete' || document.readyState === 'interactive'

export const waitForDocumentReady = (): Promise<void> =>
  new Promise((resolve) => {
    if (isDocumentReady()) return resolve()
    const listener = () => {
      resolve()
      document.removeEventListener('DOMContentLoaded', listener)
    }
    document.addEventListener('DOMContentLoaded', listener)
  })

export const waitForElement = <E extends Element>(query: string): Promise<E> =>
  waitForCallback(() => document.querySelector<E>(query) ?? undefined)

export const waitForCallback = <T>(callback: () => T | undefined): Promise<T> =>
  new Promise((resolve, reject) => {
    if (isDocumentReady()) {
      const result = callback()
      if (result !== undefined) {
        resolve(result)
      } else {
        reject(new Error('Callback never resolved'))
      }
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
          reject(new Error('Callback never resolved'))
          observer.disconnect()
        }
      }).observe(document, {
        childList: true,
        subtree: true,
      })
    }
  })

export const forceQuerySelector =
  <E extends Element = Element>(node: ParentNode) =>
  (query: string): E => {
    const element = node.querySelector<E>(query)
    if (!element) throw new Error(`Could not find element: ${query}`)
    return element
  }

export const runScript = (script: string) => {
  const element = document.createElement('script')
  element.innerHTML = script
  document.head.append(element)
  element.remove()
}

export const waitForResult = (
  iframe: HTMLIFrameElement
): Promise<HTMLDivElement | undefined> =>
  new Promise((resolve) => {
    const listener = () => {
      const firstResult =
        iframe.contentDocument?.querySelector<HTMLDivElement>('div.result')

      if (firstResult != null) resolve(firstResult)
      else resolve(undefined)

      iframe.removeEventListener('load', listener)
    }
    iframe.addEventListener('load', listener)
  })

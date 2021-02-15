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

export const insertAfter = (referenceNode: Node) => (node: Node): void => {
  referenceNode.parentNode?.insertBefore(node, referenceNode.nextSibling)
}

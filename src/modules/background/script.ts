import browser from 'webextension-polyfill'

import {
  ScriptRequest,
  ScriptResponse,
} from '../../common/utils/messaging/codec'

export const script = async (
  { id, data }: ScriptRequest,
  tabId: number
): Promise<ScriptResponse> => {
  await browser.scripting.executeScript({
    target: { tabId },
    world: 'MAIN',
    func: (injectedScript: string) => {
      const element = document.createElement('script')
      element.textContent = injectedScript
      document.head.append(element)
      element.remove()
    },
    args: [data.script],
  })

  return { id, type: 'script' }
}

import { nanoid } from 'nanoid'
import browser from 'webextension-polyfill'

import type { BackgroundRequest, BackgroundResponse } from './codec'
import { isBackgroundResponse } from './codec'

export const sendBackgroundMessage = <
  Request extends BackgroundRequest,
  Response extends BackgroundResponse,
>(
  request: Omit<Request, 'id'>,
): Promise<Response> =>
  new Promise((resolve) => {
    const requestId = nanoid()

    const onResponse = (response: unknown): undefined => {
      if (isBackgroundResponse(response) && response.id === requestId) {
        resolve(response as Response)
        browser.runtime.onMessage.removeListener(onResponse)
      }

      return
    }

    browser.runtime.onMessage.addListener(onResponse)
    void browser.runtime.sendMessage({ id: requestId, ...request })
  })

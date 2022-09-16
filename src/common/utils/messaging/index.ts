import { nanoid } from 'nanoid'

import {
  BackgroundRequest,
  BackgroundResponse,
  isBackgroundResponse,
} from './codec'

export const sendBackgroundMessage = <
  Request extends BackgroundRequest,
  Response extends BackgroundResponse
>(
  request: Omit<Request, 'id'>
): Promise<Response> =>
  new Promise((resolve) => {
    const requestId = nanoid()

    const onResponse = (response: unknown) => {
      if (isBackgroundResponse(response) && response.id === requestId) {
        resolve(response as Response)
        chrome.runtime.onMessage.removeListener(onResponse)
      }
    }

    chrome.runtime.onMessage.addListener(onResponse)
    void chrome.runtime.sendMessage({ id: requestId, ...request })
  })

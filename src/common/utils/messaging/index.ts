import { Type } from 'io-ts'
import { nanoid } from 'nanoid'
import { BackgroundRequest, BackgroundResponse } from './codec'

export const sendBackgroundMessage = <
  Request extends BackgroundRequest,
  Response extends BackgroundResponse
>(
  request: Omit<Request, 'id'>,
  type: Type<Response>
): Promise<Response> =>
  new Promise((resolve) => {
    const requestId = nanoid()

    const onResponse = (response: unknown) => {
      if (type.is(response) && response.id === requestId) {
        resolve(response)
        browser.runtime.onMessage.removeListener(onResponse)
      }
    }

    browser.runtime.onMessage.addListener(onResponse)
    void browser.runtime.sendMessage({ id: requestId, ...request })
  })

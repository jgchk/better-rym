import { sendBackgroundMessage } from './messaging'
import { FetchRequest, FetchResponse } from './messaging/codec'

export const fetch = async (data: FetchRequest['data']): Promise<string> =>
  (
    await sendBackgroundMessage<FetchRequest, FetchResponse>({
      type: 'fetch',
      data,
    })
  ).data.body

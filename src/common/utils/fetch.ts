import { sendBackgroundMessage } from './messaging'
import { FetchRequest, FetchResponse } from './messaging/codec'

export const fetch = async (data: FetchRequest['data']): Promise<string> => {
  const response = await sendBackgroundMessage<FetchRequest, FetchResponse>({
    type: 'fetch',
    data,
  })
  return response.data.body
}

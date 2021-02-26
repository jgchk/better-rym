import { Decoder } from 'io-ts'
import { decode } from './io-ts'
import { sendBackgroundMessage } from './messaging'
import { FetchRequest, FetchResponse } from './messaging/codec'

export const fetch = async (data: FetchRequest['data']): Promise<string> =>
  (await sendBackgroundMessage({ type: 'fetch', data }, FetchResponse)).data
    .body

export const fetchJson = async <B>(
  data: FetchRequest['data'],
  decoder: Decoder<unknown, B>
): Promise<B> => {
  const response = await fetch(data)
  return decode(decoder)(response)
}

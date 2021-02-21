import { Decoder } from 'io-ts'
import { nanoid } from 'nanoid'
import { decode } from './io-ts'

export type Request = {
  id: string
  url: string
} & Partial<Options>

export interface Options {
  method: 'GET' | 'POST'
  urlParams: Record<string, string>
  headers: Record<string, string>
}

export interface Response {
  id: string
  body: string
}

export const fetch = (request: Omit<Request, 'id'>): Promise<string> =>
  new Promise((resolve) => {
    const requestId = nanoid()

    const onResponse = ({ id, body }: Response) => {
      if (id === requestId) {
        resolve(body)
        browser.runtime.onMessage.removeListener(onResponse)
      }
    }

    browser.runtime.onMessage.addListener(onResponse)
    void browser.runtime.sendMessage({ id: requestId, ...request })
  })

export const fetchJson = async <B>(
  request: Omit<Request, 'id'>,
  decoder: Decoder<unknown, B>
): Promise<B> => {
  const response = await fetch(request)
  return decode(decoder)(response)
}

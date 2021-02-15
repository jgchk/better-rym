import { Task } from 'fp-ts/Task'
import { nanoid } from 'nanoid'

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

const fetch = (request: Omit<Request, 'id'>): Task<string> => () =>
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

export default fetch

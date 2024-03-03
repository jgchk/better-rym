import { FetchRequest, FetchResponse } from '../../common/utils/messaging/codec'

export const backgroundFetch = async ({
  id,
  data: { url, method = 'GET', urlParameters = {}, headers, credentials, body },
}: FetchRequest): Promise<FetchResponse> => {
  const urlObject = new URL(url)
  if (urlParameters) {
    for (const [key, value] of Object.entries(urlParameters))
      urlObject.searchParams.append(key, value)
  }

  const responseBody = await fetch(urlObject.toString(), {
    method,
    headers,
    credentials,
    body: body ? JSON.stringify(body) : undefined,
  }).then((response) => response.text())

  return { id, type: 'fetch', data: { body: responseBody } }
}

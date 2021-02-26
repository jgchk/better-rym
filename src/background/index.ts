import {
  BackgroundResponse,
  DownloadRequest,
  DownloadResponse,
  FetchRequest,
  FetchResponse,
} from '../common/utils/messaging/codec'
import { isUndefined } from '../common/utils/types'

const backgroundFetch = async ({
  id,
  data: { url, method = 'GET', urlParameters = {}, headers },
}: FetchRequest): Promise<FetchResponse> => {
  const urlObject = new URL(url)
  if (urlParameters) {
    for (const [key, value] of Object.entries(urlParameters))
      urlObject.searchParams.append(key, value)
  }

  const responseBody = await fetch(urlObject.toString(), {
    method,
    headers,
  }).then((response) => response.text())

  return { id, type: 'fetch', data: { body: responseBody } }
}

const download = async ({
  id,
  data,
}: DownloadRequest): Promise<DownloadResponse> => {
  const downloadId = await browser.downloads.download(data)
  return { id, type: 'download', data: { id: downloadId } }
}

const getResponse = (message: unknown): Promise<BackgroundResponse> => {
  if (FetchRequest.is(message)) {
    return backgroundFetch(message)
  } else if (DownloadRequest.is(message)) {
    return download(message)
  } else {
    throw new Error(`Invalid message: ${JSON.stringify(message)}`)
  }
}

browser.runtime.onMessage.addListener((message, sender) => {
  const tabId = sender.tab?.id
  if (isUndefined(tabId)) return

  void getResponse(message).then((response) =>
    browser.tabs.sendMessage(tabId, response)
  )
})

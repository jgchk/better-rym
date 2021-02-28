import {
  BackgroundResponse,
  DownloadRequest,
  FetchRequest,
} from '../common/utils/messaging/codec'
import { isUndefined } from '../common/utils/types'
import { download } from './download'
import { backgroundFetch } from './fetch'

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

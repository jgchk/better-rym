import {
  BackgroundResponse,
  isBackgroundRequest,
} from '../common/utils/messaging/codec'
import { download } from './download'
import { backgroundFetch } from './fetch'

const getResponse = (message: unknown): Promise<BackgroundResponse> => {
  if (isBackgroundRequest(message)) {
    if (message.type === 'fetch') return backgroundFetch(message)
    if (message.type === 'download') return download(message)
  }
  throw new Error(`Invalid message: ${JSON.stringify(message)}`)
}

browser.runtime.onMessage.addListener((message, sender) => {
  const tabId = sender.tab?.id
  if (tabId === undefined) return

  void getResponse(message).then((response) =>
    browser.tabs.sendMessage(tabId, response)
  )
})

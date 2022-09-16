import { getPageEnabled, pages, setPageEnabled } from '../../common/pages'
import {
  BackgroundResponse,
  isBackgroundRequest,
} from '../../common/utils/messaging/codec'
import { download } from './download'
import { backgroundFetch } from './fetch'

const getResponse = (message: unknown): Promise<BackgroundResponse> => {
  if (isBackgroundRequest(message)) {
    if (message.type === 'fetch') return backgroundFetch(message)
    if (message.type === 'download') return download(message)
  }
  throw new Error(`Invalid message: ${JSON.stringify(message)}`)
}

chrome.runtime.onMessage.addListener((message, sender) => {
  const tabId = sender.tab?.id
  if (tabId === undefined) return

  void getResponse(message).then((response) =>
    chrome.tabs.sendMessage(tabId, response)
  )
})

const setTabIcon = (tabId: number, enabled: boolean) => {
  void chrome.action.setIcon({
    tabId,
    path: enabled
      ? {
          '19': 'extension-enabled-19.png',
          '38': 'extension-enabled-38.png',
        }
      : {
          '19': 'extension-disabled-19.png',
          '38': 'extension-disabled-38.png',
        },
  })
  void chrome.action.setTitle({
    tabId,
    title: `BetterRYM ${enabled ? 'enabled' : 'disabled'}`,
  })
}

chrome.tabs.onUpdated.addListener((id, changeInfo, tab) => {
  const pageUrls = Object.values(pages)
  for (const pageUrl of pageUrls) {
    if (!tab.url) continue
    const url = new URL(tab.url)
    if (
      url.hostname.endsWith('rateyourmusic.com') &&
      url.pathname.startsWith(pageUrl)
    ) {
      void getPageEnabled(pageUrl).then((enabled) => setTabIcon(id, enabled))
      void chrome.action.enable(id)
      return
    }
  }
})

chrome.action.onClicked.addListener((tab) => {
  const pageUrls = Object.values(pages)
  for (const pageUrl of pageUrls) {
    if (tab.url && new URL(tab.url).pathname.startsWith(pageUrl)) {
      void getPageEnabled(pageUrl).then((enabled) => {
        if (tab.id === undefined) return
        void setPageEnabled(pageUrl, !enabled)
        void setTabIcon(tab.id, !enabled)
      })
    }
  }
})

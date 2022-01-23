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

browser.runtime.onMessage.addListener((message, sender) => {
  const tabId = sender.tab?.id
  if (tabId === undefined) return

  void getResponse(message).then((response) =>
    browser.tabs.sendMessage(tabId, response)
  )
})

const setTabIcon = (tabId: number, enabled: boolean) => {
  void browser.pageAction.setIcon({
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
  void browser.pageAction.setTitle({
    tabId,
    title: `BetterRYM ${enabled ? 'enabled' : 'disabled'}`,
  })
}

browser.tabs.onUpdated.addListener((id, changeInfo, tab) => {
  void browser.pageAction.show(id)
  const pageUrls = Object.values(pages)
  for (const pageUrl of pageUrls) {
    if (tab.url && new URL(tab.url).pathname.startsWith(pageUrl)) {
      void getPageEnabled(pageUrl).then((enabled) => setTabIcon(id, enabled))
      return
    }
  }

  void browser.pageAction.setIcon({
    tabId: id,
    path: {
      '19': 'extension-neutral-19.png',
      '38': 'extension-neutral-38.png',
    },
  })
  void browser.pageAction.setTitle({
    tabId: id,
    title: 'BetterRYM',
  })
})

browser.pageAction.onClicked.addListener((tab) => {
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

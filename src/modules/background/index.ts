import browser from 'webextension-polyfill'

import { getPageEnabled, pages, setPageEnabled } from '../../common/pages'
import {
  BackgroundResponse,
  isBackgroundRequest,
} from '../../common/utils/messaging/codec'
import { download } from './download'
import { backgroundFetch } from './fetch'
import { script } from './script'

const getResponse = (
  message: unknown,
  tabId: number
): Promise<BackgroundResponse> => {
  if (isBackgroundRequest(message)) {
    if (message.type === 'fetch') return backgroundFetch(message)
    if (message.type === 'download') return download(message)
    if (message.type === 'script') return script(message, tabId)
  }
  throw new Error(`Invalid message: ${JSON.stringify(message)}`)
}

browser.runtime.onMessage.addListener((message, sender) => {
  const tabId = sender.tab?.id
  if (tabId === undefined) return undefined

  void getResponse(message, tabId).then((response) =>
    browser.tabs.sendMessage(tabId, response)
  )
})

const setTabIcon = (tabId: number, enabled: boolean) => {
  void browser.action.setIcon({
    tabId,
    path: enabled
      ? {
          '19': browser.runtime.getURL('icons/extension-enabled-19.png'),
          '38': browser.runtime.getURL('icons/extension-enabled-38.png'),
        }
      : {
          '19': browser.runtime.getURL('icons/extension-disabled-19.png'),
          '38': browser.runtime.getURL('icons/extension-disabled-38.png'),
        },
  })
  void browser.action.setTitle({
    tabId,
    title: `BetterRYM ${enabled ? 'enabled' : 'disabled'}`,
  })
}

browser.tabs.onUpdated.addListener((id, changeInfo, tab) => {
  const pageUrls = Object.values(pages)
  for (const pageUrl of pageUrls) {
    if (!tab.url) continue
    const url = new URL(tab.url)
    if (
      url.hostname.endsWith('rateyourmusic.com') &&
      url.pathname.startsWith(pageUrl)
    ) {
      void getPageEnabled(pageUrl).then((enabled) => setTabIcon(id, enabled))
      void browser.action.enable(id)
      return
    }
  }
})

browser.action.onClicked.addListener((tab) => {
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

import { Request, Response } from '../common/utils/fetch'

browser.runtime.onMessage.addListener(
  async ({ id, url, method = 'GET', urlParams, headers }: Request, sender) => {
    if (!sender.tab?.id) return

    const urlObject = new URL(url)
    if (urlParams) {
      for (const key of Object.keys(urlParams))
        urlObject.searchParams.append(key, urlParams[key])
    }

    const responseBody = await fetch(urlObject.toString(), {
      method,
      headers,
    }).then((response) => response.text())

    const response: Response = { id, body: responseBody }
    void browser.tabs.sendMessage(sender.tab.id, response)
  }
)

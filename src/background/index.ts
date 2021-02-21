import { Request, Response } from '../common/utils/fetch'

browser.runtime.onMessage.addListener(
  async (
    {
      id,
      url,
      method = 'GET',
      urlParams: urlParameters = {},
      headers,
    }: Request,
    sender
  ) => {
    if (!sender.tab?.id) return

    const urlObject = new URL(url)
    if (urlParameters) {
      for (const key of Object.keys(urlParameters))
        urlObject.searchParams.append(key, urlParameters[key] as string)
    }

    const responseBody = await fetch(urlObject.toString(), {
      method,
      headers,
    }).then((response) => response.text())

    const response: Response = { id, body: responseBody }
    void browser.tabs.sendMessage(sender.tab.id, response)
  }
)

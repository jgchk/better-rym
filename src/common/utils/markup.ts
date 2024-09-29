import { fetch } from './fetch'

export async function parseMarkup(markup: string): Promise<Element> {
  // if markup is empty, just return an empty span
  if (!markup) {
    const span = document.createElement('span')
    span.className = 'rendered_text'
    return span
  }

  const output = await fetch({
    url: 'https://rateyourmusic.com/go/processpreview',
    method: 'POST',
    urlParameters: {
      id: 'body',
      text: markup,
    },
  })

  return new DOMParser()
    .parseFromString(output.slice(33, -2), 'text/html')
    .querySelector('.rendered_text')!
}

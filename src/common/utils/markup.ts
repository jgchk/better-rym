import { fetch } from './fetch'

const parseMarkup = async (markup: string) => {
  const output = await fetch({
    url: 'https://rateyourmusic.com/go/processpreview',
    method: 'POST',
    urlParameters: {
      id: 'body',
      text: markup,
    },
  })

  return new DOMParser().parseFromString(output.slice(33, -2), 'text/html')
    .firstChild as HTMLSpanElement
}

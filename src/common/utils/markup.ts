import { fetch } from './fetch'

const getArtistLinkFromId = async (id: number) => {
  const response = await fetch({
    url: 'https://rateyourmusic.com/go/process_credit_artist_preview',
    method: 'POST',
    urlParameters: {
      id: `credits_artist_${id}`,
      text: `[Artist${id}]`,
      type: 'credits',
    },
  })

  return new DOMParser().parseFromString(
    response.slice(54 + id.toString().length, -2),
    'text/html'
  )
}

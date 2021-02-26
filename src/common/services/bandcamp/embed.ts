import { EmbedFunction } from '..'
import { fetch } from '../../utils/fetch'
import { isUndefined } from '../../utils/types'

export const embed: EmbedFunction = async (url) => {
  const response = await fetch({ url })
  const document_ = new DOMParser().parseFromString(response, 'text/html')

  const twitterEmbedUrl = document_.querySelector<HTMLMetaElement>(
    'meta[property="twitter:player"]'
  )?.content
  const albumId = twitterEmbedUrl?.match(/album=(\d+)/)?.[1]
  if (isUndefined(albumId)) return undefined

  return `<iframe style="border: 0; width: 350px; height: 470px;" src="https://bandcamp.com/EmbeddedPlayer/album=${albumId}/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/transparent=true/" seamless><a href="${url}"></a></iframe>`
}

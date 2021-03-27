import { fetch } from '../../utils/fetch'
import { isNull, isUndefined } from '../../utils/types'
import { EmbedFunction } from '../types'

export const embed: EmbedFunction = async (url) => {
  const response = await fetch({ url })
  const document_ = new DOMParser().parseFromString(response, 'text/html')

  const twitterEmbedUrl = document_.querySelector<HTMLMetaElement>(
    'meta[property="twitter:player"]'
  )?.content
  if (isUndefined(twitterEmbedUrl)) return undefined

  const embedUrl = new URL(twitterEmbedUrl).searchParams.get('url')
  if (isNull(embedUrl)) return undefined

  return `<iframe width="100%" height="300" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=${embedUrl}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"></iframe><div style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;"><a href="" title="" target="_blank" style="color: #cccccc; text-decoration: none;"></a> · <a href="" title="" target="_blank" style="color: #cccccc; text-decoration: none;"></a></div>`
}

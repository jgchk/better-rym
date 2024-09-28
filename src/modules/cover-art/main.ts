import { injectCoverArtDownloader } from '.'
import browser from 'webextension-polyfill'

void injectCoverArtDownloader()

for (const cssPath of import.meta.PLUGIN_WEB_EXT_CHUNK_CSS_PATHS) {
  const styles = document.createElement('link')
  styles.rel = 'stylesheet'
  styles.href = browser.runtime.getURL(cssPath)

  document.head.appendChild(styles)
}

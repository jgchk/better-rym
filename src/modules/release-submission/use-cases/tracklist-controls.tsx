import { forceQuerySelector, waitForElement } from '~/common/utils/dom'

export default async function injectTracklistControls() {
  const clearAll = await waitForElement('a#clearAll')

  const lengthClear = document.createElement('a')
  lengthClear.id = 'clearAllLengths'
  lengthClear.className = 'btn blue_btn btn_small rating_btn'
  lengthClear.href = 'javascript:void(0);'
  lengthClear.style.cssText = 'margin-left: 1em; visibility: visible;'
  lengthClear.textContent = 'clear lengths'

  lengthClear.addEventListener('click', () => {
    const advancedInputContainer = forceQuerySelector(document)('#tracks_adv')
    const isAdvanced =
      window.getComputedStyle(advancedInputContainer).display !== 'none'

    const advancedInput =
      forceQuerySelector<HTMLTextAreaElement>(document)('#track_advanced')

    if (!isAdvanced)
      forceQuerySelector<HTMLAnchorElement>(document)('#goAdvancedBtn').click()

    advancedInput.value = advancedInput.value
      .split('\n')
      .filter((line) => line.length > 0)
      .map((line) => [...line.split('|').slice(0, 2), ''].join('|'))
      .join('\n')

    if (!isAdvanced)
      forceQuerySelector<HTMLAnchorElement>(document)('#goSimpleBtn').click()
  })

  clearAll.after(lengthClear)
}

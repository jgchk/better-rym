import { sources, source } from '../settings'
import '../../res/styles/nav.less'

const navtop = $('#navtop')

function createSettingsPanel() {
  const panel = $('<div>')
  panel.addClass('settings-panel brym')

  const streamSourcesTitle = $('<div>Sources</div>')
  streamSourcesTitle.addClass('setting title')
  panel.append(streamSourcesTitle)

  const streamSourcesList = $('<ul>').sortable({
    onSort: () => {
      const sourceOrder = streamSourcesList
        .children()
        .map((_, el) => $(el).data('source'))
        .toArray()
      sources(sourceOrder)
    },
  })
  streamSourcesList.addClass('setting list')
  sources().forEach(src => {
    const streamSourceContainer = $('<li>')
    streamSourceContainer.addClass('setting list-item-container')
    streamSourceContainer.data('source', src)

    const streamSourceItem = $(`<li>${src}</li>`)
    streamSourceItem.data('source', src)
    streamSourceItem.addClass('setting list-item')
    streamSourceItem.toggleClass('disabled', !source(src))

    const streamSourceCheckbox = $('<input type="checkbox">')
    streamSourceCheckbox.addClass('setting checkbox')
    streamSourceCheckbox.prop('checked', source(src))
    streamSourceCheckbox.change(function change() {
      source(src, this.checked)
      streamSourceItem.toggleClass('disabled', !this.checked)
    })

    streamSourceContainer.append(streamSourceCheckbox)
    streamSourceContainer.append(streamSourceItem)

    streamSourcesList.append(streamSourceContainer)
  })
  panel.append(streamSourcesList)

  return panel
}

function createSettingsBtn() {
  const btn = $('<div>')
  btn.addClass('settings-btn brym')
  return btn
}

function modifyNav() {
  const settingsBtn = createSettingsBtn()
  const settingsPanel = createSettingsPanel()

  settingsBtn.click(() => settingsPanel.toggleClass('active'))
  $(document).click(e => {
    const $target = $(e.target)
    if (
      !$target.closest(settingsBtn).length &&
      !$target.closest(settingsPanel).length
    ) {
      settingsPanel.removeClass('active')
    }
  })

  navtop.find('.helplink').before(settingsBtn)
  navtop.after(settingsPanel)
}

function hasNav() {
  return navtop.length > 0
}

export default function checkNav() {
  if (hasNav()) {
    modifyNav()
  }
}

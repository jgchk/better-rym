import { inPath, splitPath, joinPath } from '../lib/path'

const releaseTypes = [
  ['Albums', 'typs'],
  ['EPs', 'type'],
  ['Singles', 'typi'],
  ['Mixtapes', 'typm'],
  ['DJ Mixes', 'typj'],
  ['Compilations', 'typc'],
  ['Videos', 'typd'],
  ['Bootlegs', 'typb'],
  ['Everything', ''],
]

const path = splitPath()

function makeUrl(modifier) {
  const collectionIndex = path.findIndex(
    el => el.toLowerCase() === 'collection'
  )
  const modifiers = (path[collectionIndex + 2] || '')
    .split(/\s*,\s*/)
    .filter(mod => !mod.startsWith('typ'))
    .concat(modifier)
    .filter(s => s.length > 0)
    .join(',')
  path[collectionIndex + 2] = modifiers
  return joinPath(path.filter(s => s.length > 0))
}

function makeButtons() {
  const $container = $('<div>')
  releaseTypes.forEach(([name, modifier]) => {
    const $button = $('<a>')
    $button.addClass('brym')
    $button.addClass('printbutton')
    $button.addClass(name.toLowerCase())
    $button.text(name.toLowerCase())
    $button.attr('href', makeUrl(modifier))
    $container.append($button)
  })
  return $container
}

function modifyCollectionPage() {
  const $breadcrumb = $('#breadcrumb')
  const $buttons = makeButtons()
  $breadcrumb.after($buttons)
}

function isCollectionPage() {
  return inPath('collection')
}

export default function checkCollectionPage() {
  if (isCollectionPage()) {
    modifyCollectionPage()
    return true
  }
  return false
}

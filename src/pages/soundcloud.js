/* eslint-disable no-console */

import Promise from 'bluebird'

import sources from '../api/sources'
import { fetchUrl } from '../lib/fetch'

const tag = 'SCID: '

function getAssetUrls() {
  const assetRegex = /https:\/\/a-v2\.sndcdn\.com\/assets\/[0-9a-z-]+\.js/gm
  const matches = document.body.innerHTML.matchAll(assetRegex)
  return [...matches].map(match => match[0])
}

async function getClientId(assetUrl) {
  const response = await fetchUrl(assetUrl, 'GET', 'text')

  const clientIdRegex = /{\s*client_id:\s*"([^"]+)"\s*}/
  const match = clientIdRegex.exec(response)
  if (!match) throw Error('No client_id found')
  return match[1]
}

async function findClientId(assetUrls) {
  const clientIds = await Promise.some(assetUrls.map(getClientId), 1)
  if (clientIds.length > 0) return clientIds[0]
  return null
}

async function postClientId(clientId) {
  const url = `https://jake.cafe/api/sc/add?clientId=${encodeURIComponent(
    clientId
  )}`
  console.log(tag, 'Posting client_id...', url)
  return fetchUrl(url)
    .then(response => {
      console.log(tag, 'Successfully posted!')
      return response
    })
    .catch(err => {
      console.log(tag, 'Failed to post.')
      throw err
    })
}

async function main() {
  const assetUrls = getAssetUrls()
  const clientId = await findClientId(assetUrls)
  if (clientId) {
    console.log(tag, 'Found client_id!', clientId)
    postClientId(clientId)
  } else {
    console.log(tag, 'No client_id found.')
  }
}

function isSoundcloudPage() {
  return sources.SoundCloud.regex.test(window.location.href)
}

export default function checkSoundcloudPage() {
  if (isSoundcloudPage()) {
    main()
    return true
  }
  return false
}

// eslint-disable-next-line import/prefer-default-export
export function fetchUrl(url, method = 'GET', responseType = 'json') {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method,
      url,
      responseType,
      onload: result => {
        if (result.status === 200) resolve(result.response)
        else reject(new Error(`Received status code: ${result.status}`))
      },
      onerror: error => reject(error),
    })
  })
}

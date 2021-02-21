const path = require('path')
const browserslist = require('browserslist')
const { customAlphabet } = require('nanoid')
const manifest = require('./manifest.json')
const package = require('./package.json')
const { WebpackManifestPlugin } = require('webpack-manifest-plugin')

const flipObject = (obj) => {
  const ret = {}
  Object.keys(obj).forEach((key) => {
    ret[obj[key]] = key
  })
  return ret
}

const isFirefox = browserslist().every((browser) =>
  browser.startsWith('firefox')
)

const alphabet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const nanoid = customAlphabet(alphabet, 6)

const manifestEntries = {}
const scripts = [
  ...new Set(
    manifest.background.scripts.concat(
      ...manifest.content_scripts.map(({ js }) => js)
    )
  ),
]
scripts.forEach((scriptPath) => {
  const base = path.basename(scriptPath)
  const basename = base.split('.')[0]
  const name =
    basename === 'index' ? path.basename(path.dirname(scriptPath)) : basename

  let uniqueName
  while (!uniqueName || manifestEntries[uniqueName] !== undefined) {
    uniqueName = `${name}-${nanoid(6)}`
  }

  manifestEntries[uniqueName] = scriptPath
})

const ExtensionManifestPlugin = ({ isDevelopment }) =>
  new WebpackManifestPlugin({
    generate: (seed, files, entries) => {
      const {
        manifest_version,
        name,
        description,
        version,
        permissions,
        content_security_policy,
        content_scripts,
        background,
      } = manifest

      const output = {
        manifest_version: manifest_version || 2,
        name: name || package.name,
        description: description || package.description,
        version: version || package.version,
        permissions: permissions || [],
      }

      if (content_security_policy) {
        output.content_security_policy = content_security_policy
      } else if (isDevelopment) {
        output.content_security_policy =
          "script-src 'self' 'unsafe-eval'; object-src 'self'"
      }

      const outputMap = flipObject(manifestEntries)

      output.content_scripts = content_scripts.map(({ js, ...cs }) => {
        const output = { ...cs }

        if (!isFirefox) {
          output.js = (output.js || []).concat('browser-polyfill.js')
        }

        js.forEach((file) => {
          const entry = outputMap[file]
          const outputFiles = entries[entry]
          output.js = (output.js || []).concat(
            outputFiles.filter((f) => path.extname(f) === '.js')
          )
          output.css = (output.css || []).concat(
            outputFiles.filter((f) => path.extname(f) === '.css')
          )
        })

        return output
      })

      output.background = {
        scripts: (isFirefox ? [] : ['browser-polyfill.js']).concat(
          ...background.scripts.map((file) => {
            const entry = outputMap[file]
            const outputFiles = entries[entry]
            return outputFiles.filter((f) => path.extname(f) === '.js')
          })
        ),
      }

      return output
    },
  })

module.exports = {
  manifestEntries,
  ExtensionManifestPlugin,
}

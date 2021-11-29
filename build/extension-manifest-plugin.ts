import { customAlphabet } from 'nanoid'
import path from 'path'
import { WebpackPluginInstance } from 'webpack'
import { WebpackManifestPlugin } from 'webpack-manifest-plugin'

import manifest from '../manifest.json'
import packageInfo from '../package.json'

const alphabet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const nanoid = customAlphabet(alphabet, 6)

const flipObject = (object: { [key: string]: string }) => {
  const returnValue: { [key: string]: string } = {}
  for (const [key, value] of Object.entries(object)) {
    returnValue[value] = key
  }
  return returnValue
}

const getManifestEntries = () => {
  const entries: { [name: string]: string } = {}
  const scripts = [
    ...new Set([
      ...manifest.background.scripts,
      ...manifest.content_scripts.flatMap(({ js }) => js),
    ]),
  ]
  for (const scriptPath of scripts) {
    const base = path.basename(scriptPath)
    const basename = base.split('.')[0] || base
    const name =
      basename === 'index' ? path.basename(path.dirname(scriptPath)) : basename

    let uniqueName
    while (!uniqueName || entries[uniqueName] !== undefined) {
      uniqueName = `${name}-${nanoid()}`
    }

    entries[uniqueName] = scriptPath
  }
  return entries
}

export const manifestEntries = getManifestEntries()

export interface ExtensionManifestPluginOptions {
  isDevelopment: boolean
  isFirefox: boolean
}
export const ExtensionManifestPlugin = ({
  isDevelopment,
  isFirefox,
}: ExtensionManifestPluginOptions): WebpackPluginInstance =>
  new WebpackManifestPlugin({
    generate: (seed, files, entries) => {
      const {
        name,
        permissions,
        icons,
        content_scripts,
        background,
        ...otherEntries
      } = manifest

      const output: { [key: string]: unknown } = {
        manifest_version: 2,
        name: name || packageInfo.name,
        description: packageInfo.description,
        version: packageInfo.version,
        permissions: permissions || [],
        icons: icons || {},
        ...otherEntries,
      }

      if (isDevelopment) {
        output.content_security_policy =
          "script-src 'self' 'unsafe-eval'; object-src 'self'"
      }

      const outputMap = flipObject(manifestEntries)

      output.content_scripts = content_scripts.map(({ js, ...cs }) => {
        const output: {
          js: string[]
          css: string[]
          matches: string[]
          run_at: string
        } = { ...cs, js: [], css: [] }

        if (!isFirefox) {
          output.js.push('browser-polyfill.js')
        }

        for (const file of js) {
          const entry = outputMap[file]
          if (entry === undefined) {
            throw new Error(`Could not find entry for file: ${file}`)
          }

          const outputFiles = entries[entry]
          if (outputFiles === undefined) {
            throw new Error(`Could not find files for entry: ${entry}`)
          }

          output.js.push(
            ...outputFiles.filter((f) => path.extname(f) === '.js')
          )
          output.css.push(
            ...outputFiles.filter((f) => path.extname(f) === '.css')
          )
        }

        return output
      })

      output.background = {
        scripts: [
          ...(isFirefox ? [] : ['browser-polyfill.js']),
          ...background.scripts.flatMap((file) => {
            const entry = outputMap[file]
            if (entry === undefined) {
              throw new Error(`Could not find entry for file: ${file}`)
            }

            const outputFiles = entries[entry]
            if (outputFiles === undefined) {
              throw new Error(`Could not find files for entry: ${entry}`)
            }

            return outputFiles.filter((f) => path.extname(f) === '.js')
          }),
        ],
      }

      return output as Record<string, string>
    },
  })

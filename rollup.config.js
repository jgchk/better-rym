import fs from 'fs'
import process from 'process'
import { babel } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import dotenv from 'dotenv'
import { chromeExtension, simpleReloader } from 'rollup-plugin-chrome-extension'
import { emptyDir } from 'rollup-plugin-empty-dir'

const extensions = ['.js', '.jsx', '.ts', '.tsx']
const environment = dotenv.parse(fs.readFileSync('.env'))

const config = {
  input: 'src/manifest.json',
  output: {
    dir: 'output',
    format: 'esm',
  },
  plugins: [
    chromeExtension({ browserPolyfill: true }),
    simpleReloader(),
    resolve({ extensions, browser: true }),
    commonjs(),
    babel({ babelHelpers: 'bundled', extensions }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      ...Object.entries(environment).reduce((accumulator, [key, value]) => {
        accumulator[`process.env.${key}`] = JSON.stringify(value)
        return accumulator
      }, {}),
    }),
    emptyDir(),
  ],
}

export default config

import fs from 'node:fs/promises'
import path from 'node:path'

import Tonic from 'tonic-ssr'
import less from 'less'

export default class StyleModule extends Tonic {
  async render () {
    try {
      const location = path.resolve(this.props.src)
      const s = await fs.readFile(location, 'utf8')

      const result = await await less.render(s, { paths: path.dirname(location) })

      return this.html`
        <style>
          ${Tonic.unsafeRawString(result.css)}
        </style>
      `
    } catch (err) {
      return this.html`
        Unable to parse PostCSS (sugarss) (${err.message}).
      `
    }
  }
}

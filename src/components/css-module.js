import fs from 'fs'
import path from 'path'

import Tonic from 'tonic-ssr'
import CleanCSS from 'clean-css'

const minifier = new CleanCSS({})

const closest = (node, fn) => {
  while (node.parentNode) {
    node = node.parentNode
    if (fn(node)) return node
  }
}

export default class CssModule extends Tonic {
  async render () {
    const html = closest(this.node, n => n.tagName === 'html')
    const body = closest(this.node, n => n.tagName === 'body')

    //
    // We can remove nodes and create new ones in other
    // branches of the tree at run-time.
    //
    const i = body.childNodes.findIndex(node => {
      return node.tagName === 'css-module'
    })

    body.childNodes.splice(i, 1)

    //
    // Even change the tag at render-time!
    //
    this.node.tagName = 'style'

    const head = html.childNodes.find(node => node.tagName === 'head')

    if (head) {
      this.node.attrs = {}
      head.childNodes.push(this.node)
    }

    try {
      const location = path.resolve(this.props.src)
      let s = await fs.promises.readFile(location, 'utf8')

      //
      // make @import path("...") a compile time directive
      //
      s = s.replace(/@import path\("(.*)\"\);/g, (_, p) => {
        const r = path.resolve(path.dirname(location), p)

        try {
          return fs.readFileSync(r, 'utf8')
        } catch (err) {
          return `// Failed to import ${p}: ${err.message}`
        }
      })

      const result = minifier.minify(s)

      return this.html`${Tonic.unsafeRawString(result.styles)}`
    } catch (err) {
      return this.html`${err.message}`
    }
  }
}

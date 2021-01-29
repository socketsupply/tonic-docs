import fs from 'node:fs/promises'
import path from 'node:path'

import Tonic from 'tonic-ssr'
import less from 'less'
import CleanCSS from 'less-plugin-clean-css'

const cleanCSS = new CleanCSS({ advanced: true })

const closest = (node, fn) => {
  while (node.parentNode) {
    node = node.parentNode
    if (fn(node)) return node
  }
}

export default class StyleModule extends Tonic {
  async render () {
    const html = closest(this.node, n => n.tagName === 'html')
    const body = closest(this.node, n => n.tagName === 'body')

    //
    // We can remove nodes and create new ones in other
    // branches of the tree at run-time.
    //
    const i = body.childNodes.findIndex(node => {
      return node.tagName === 'style-module'
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
      const s = await fs.readFile(location, 'utf8')

      const result = await less.render(s, {
        paths: path.dirname(location),
        plugins: [cleanCSS]
      })

      return this.html`${Tonic.unsafeRawString(result.css)}`
    } catch (err) {
      return this.html`
        Unable to parse PostCSS (sugarss) (${err.message}).
      `
    }
  }
}

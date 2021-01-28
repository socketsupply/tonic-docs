'use strict'

import fs from 'node:fs/promises'
import path from 'node:path'

import Tonic from 'tonic-ssr'
import marked from 'marked'
import hl from 'highlight.js'

const renderer = new marked.Renderer()

//
// This makes header links url friendly
//
renderer.heading = (text, level) => {
  const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-')
  if (level > 1) return `<h${level}>${text}</h${level}>\n`
  return `<h${level} id="${escapedText}">${text}</h${level}>\n`
}

const highlight = (code, lang = 'javascript', escaped) => {
  if (!lang) lang = 'javascript'
  return hl.highlight(lang, code).value
}

marked.setOptions({
  renderer,
  highlight
})

export default class MarkdownModule extends Tonic {
  async render () {
    try {
      const src = path.resolve(this.props.src)
      const md = marked(await fs.readFile(src, 'utf8'))
      return Tonic.unsafeRawString(md)
    } catch (err) {
      return this.html`
        <div class="error">
          Unable to read file ${this.props.src} (${err.message}).
        </div>
      `
    }
  }
}

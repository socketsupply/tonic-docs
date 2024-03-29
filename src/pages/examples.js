import fs from 'node:fs/promises'
import path from 'node:path'

import Tonic from 'tonic-ssr'
import head from './mixins/head.js'
import logo from './mixins/logo.js'

const base = path.join('..', 'markdown', 'components')
const __dirname = path.dirname(new URL(import.meta.url).pathname)

class ExamplePage extends Tonic {
  async getComponentDocs () {
    const dir = path.join(__dirname, base)
    const files = await fs.readdir(dir)
    return files.map(file => ({
      name: file.replace('.md', ''),
      path: path.join(dir, file)
    }))
  }

  renderTableOfContents (files) {
    const html = []

    for (const file of files) {
      html.push(this.html`
        <a href="#${file.name}">
          ${file.name}
        </a>
      `)
    }

    return html
  }

  renderFiles (files) {
    const html = []

    for (const file of files) {
      html.push(this.html`
        <markdown-module src="${file.path}">
        </markdown-module>
      `)
    }

    return html
  }

  async render () {
    const files = await this.getComponentDocs()

    const toc = this.renderTableOfContents(files)
    const content = this.renderFiles(files)

    return this.html`
      <!DOCTYPE html>

      <html>
        <head>
          ${Tonic.unsafeRawString(head({
            title: 'Tonic',
            description: 'A component framework',
            siteName: 'Tonic Framework',
            image: 'https://tonicframework.dev/images/tonic_preview.png',
            url: 'https://tonicframework.dev'
          }))}

          <css-module src="src/styles/index.css">
          </css-module>
        </head>

        <body>
          <aside>
            <toc-nav>
              <a class="logo" href="/">
                ${logo()}
              </a>

              ${toc}

            </toc-nav>
          </aside>

          <main id="examples">
            <a class="logo" href="/">
              ${logo()}
            </a>

            ${content}

          </main>

          <esbuild-module
            src="./src/index.js"
            dest="./build/bundle.js"
            url="/bundle.js"
            minify=${true}
            format="esm"
            minify-whitespace=${true}
            keep-names=${true}
            sourcemap="inline">
          </esbuild-module>

          <tonic-sprite>
          </tonic-sprite>

        </body>
      </html>
    `
  }
}

export default ExamplePage

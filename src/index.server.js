import fs from 'node:fs/promises'
import Tonic from 'tonic-ssr'

import JsBundle from './components/js-bundle.js'
import MarkdownModule from './components/markdown-module.js'
import StyleModule from './components/style-module.js'

import MainPage from './pages/index.js'
import ExamplePage from './pages/examples.js'

Tonic.add(JsBundle)
Tonic.add(StyleModule)
Tonic.add(MarkdownModule)

Tonic.add(MainPage)
Tonic.add(ExamplePage)

export default async path => {
  switch (true) {
    case !!path.match(/examples/): {
      const examplePage = new ExamplePage()
      const html = await examplePage.preRender()
      return fs.writeFile('build/examples.html', html)
    }

    case path === '/': {
      const mainPage = new MainPage()
      const html = await mainPage.preRender()
      return fs.writeFile('build/index.html', html)
    }
  }

  return false
}

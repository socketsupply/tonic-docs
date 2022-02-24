import Tonic from 'tonic-ssr'
import head from './mixins/head.js'
import logo from './mixins/logo.js'

class MainPage extends Tonic {
  async render () {
    return this.html`
      <!DOCTYPE html>

      <html>
        <head>
          ${Tonic.unsafeRawString(head({
            title: 'Tonic',
            description: 'A low-profile component framework',
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
              <a class="logo" href="https://github.com/socketsupply/tonic">
                ${logo()}
              </a>

              <a href="#intro">Intro</a>
              <a href="#gettingstarted">Getting Started</a>
              <a href="#props">Properties</a>
              <a href="#state">State</a>
              <a href="#composition">Composition</a>
              <a href="#events">Events</a>
              <a href="#methods">Methods</a>
              <a href="#styles">Styles</a>
              <a href="#ssr">SSR</a>
              <a href="#csp">CSP</a>
            </toc-nav>
          </aside>

          <main id="main">
            <markdown-module id="intro" src="src/markdown/guides/intro.md"></markdown-module>
            <markdown-module id="gettingstarted" src="src/markdown/guides/gettingstarted.md"></markdown-module>
            <markdown-module id="props" src="src/markdown/guides/props.md"></markdown-module>
            <markdown-module id="state" src="src/markdown/guides/state.md"></markdown-module>
            <markdown-module id="composition" src="src/markdown/guides/composition.md"></markdown-module>
            <markdown-module id="events" src="src/markdown/guides/events.md"></markdown-module>
            <markdown-module id="methods" src="src/markdown/guides/methods.md"></markdown-module>
            <markdown-module id="styles" src="src/markdown/guides/styles.md"></markdown-module>
            <markdown-module id="ssr" src="src/markdown/guides/ssr.md"></markdown-module>
            <markdown-module id="csp" src="src/markdown/guides/csp.md"></markdown-module>
          </main>

          <!--
            Bundles
            -------
            For heavy webapps, use a bundle. For anything
            light weight just use native browser modules.
            -------
          -->

          <esbuild-module
            src="./src/index.js"
            dest="./build/bundle.js"
            url="/bundle.js"
            minify=${true}
            minify-whitespace=${true}
            format="esm"
            keep-names=${true}
            sourcemap="inline">
          </esbuild-module>

          <!--script type="module" src="/tonic.js">
          </script-x->

        </body>
      </html>
    `
  }
}

export default MainPage

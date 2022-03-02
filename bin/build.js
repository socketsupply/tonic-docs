// @ts-check

import fs from 'node:fs/promises'
import path from 'node:path'
import Tonic from 'tonic-ssr'

const dirname = meta => path.dirname(new URL(meta.url).pathname)
const componentsDir = path.join(dirname(import.meta), '../src/components')

const load = async src => {
  const mod = await import(`${src}?t=${Date.now()}`)
  return Tonic.add(mod.default)
}

const compile = async (src, dest) => {
  const p = path.resolve(src)
  const t = new Date()

  t.setMinutes(t.getMinutes() - 1)
  if ((await fs.stat(src)).mtime > t) return Promise.resolve()

  const Page = await load(p)
  const page = new Page()

  try { await fs.mkdir(path.dirname(dest), { recursive: true }) } catch {}
  const r = fs.writeFile(dest, await page.preRender())
  return r
}

export async function build (argv) {
  console.log('export build')
  const base = path.join(dirname(import.meta), '..')

  const dest = typeof argv.out === 'string'
    ? argv.out : path.join(base, 'build')

  //
  // clean and recreate the build directory if it exists
  try {
    await fs.rm(dest, { force: true, recursive: true })
    await fs.mkdir(dest)

    //
    // add symbolic links to the source fonts and images
    //
    for (const dir of ['fonts', 'images', 'styles']) {
      try {
        await fs.symlink(
          path.join(base, 'src', dir),
          path.join(dest, dir)
        )
      } catch (err) {
        console.error('Could not create symlink', err)
      }
    }
  } catch {}

  console.log('call load()')

  //
  // decide which urls we want to build
  //
  await Promise.all([
    load(path.join(componentsDir, 'css-module.js')),
    load(path.join(componentsDir, 'esbuild-module.js')),
    load(path.join(componentsDir, 'markdown-module.js'))
  ])

  console.log('compile pages()')

  const pages = Promise.all([
    compile('src/pages/index.js', `${dest}/index.html`),
    compile('src/pages/examples.js', `${dest}/examples.html`)
  ])

  await pages
}

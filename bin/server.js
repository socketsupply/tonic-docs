#!/usr/bin/env node
// @ts-check

import http from 'node:http'
import fs from 'node:fs/promises'
import path from 'node:path'
import send from '@pre-bundled/send'
import Tonic from 'tonic-ssr'
import minimist from 'minimist'

process.on('unhandledRejection', (err) => {
  process.nextTick(() => {
    throw err
  })
})

let die = null
let port = 8081
let url = 'http://dev.socketsupply.co'

const opts = { root: new URL('../build', import.meta.url).pathname }

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

const PENDING_REQUESTS = new Set()

async function handler (req, res) {
  PENDING_REQUESTS.add(req)

  res.on('finish', () => {
    PENDING_REQUESTS.delete(req)
  })

  const { pathname } = new URL(req.url, `${url}:${port}`)

  const onError = err => {
    if (err.status === 404) {
      req.url = '/'
      handler(req, res)
    }
  }

  return send(req, pathname, opts)
    .on('error', onError)
    .on('end', () => {
      clearTimeout(die)
      die = setTimeout(teardown, 512)
    })
    .pipe(res)
}

async function teardown () {
  if (PENDING_REQUESTS.size > 0) {
    clearTimeout(die)
    die = setTimeout(teardown, 512)
    return
  }

  process.exit(0)
}

export async function build (argv) {
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
      await fs.symlink(
        path.join(base, 'src', dir),
        path.join(dest, dir)
      )
    }
  } catch {}

  //
  // decide which urls we want to build
  //
  await Promise.all([
    load(path.join(componentsDir, 'css-module.js')),
    load(path.join(componentsDir, 'esbuild-module.js')),
    load(path.join(componentsDir, 'markdown-module.js'))
  ])

  const pages = Promise.all([
    compile('src/pages/index.js', `${dest}/index.html`),
    compile('src/pages/examples.js', `${dest}/examples.html`)
  ])

  await pages
}

async function main (argv) {
  port = process.env.PORT
    ? parseInt(process.env.PORT)
    : argv.p || port

  if (argv.url) url = argv.url

  http.createServer(handler).listen(port, async () => {
    console.log(`listening on ${url}:${port}`)
    await build(argv)
  })
}

main(minimist(process.argv.slice(2)))

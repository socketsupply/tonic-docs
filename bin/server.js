#!/usr/bin/env node
// @ts-check

import http from 'node:http'
import send from '@pre-bundled/send'
import minimist from 'minimist'

import { build } from './build.js'

process.on('unhandledRejection', (err) => {
  process.nextTick(() => {
    throw err
  })
})

let die = null
let port = 8081
let url = 'http://dev.socketsupply.co'

const opts = { root: new URL('../build', import.meta.url).pathname }

const PENDING_REQUESTS = new Set()

async function handler (req, res) {
  PENDING_REQUESTS.add(req)

  res.setMaxListeners(50)
  res.on('finish', function _onFinishDelete () {
    PENDING_REQUESTS.delete(req)
  })

  const { pathname } = new URL(req.url, `${url}:${port}`)

  const onError = err => {
    console.log('Got an error', err)

    if (err.status === 404) {
      req.url = '/'
      handler(req, res)
    } else {
      res.statusCode = err.status || 500
      res.end('Internal Server Error')
    }
  }

  return send(req, pathname, opts)
    .once('error', onError)
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

async function main (argv) {
  port = process.env.PORT
    ? parseInt(process.env.PORT)
    : argv.p || port

  if (argv.url) url = argv.url

  await build(argv)
  http.createServer(handler).listen(port, async () => {
    console.log(`listening on ${url}:${port}`)
  })
}

main(minimist(process.argv.slice(2)))

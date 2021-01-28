#!/usr/bin/env node

import build from '../src/index.server.js'

async function main () {
  await Promise.all([
    build('/'),
    build('/example')
  ])
}

main()

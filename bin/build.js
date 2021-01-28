#!/usr/bin/env node

import build from '../src/index.server'

async function main () {
  await Promise.all([
    build('/'),
    build('/example')
  ])
}

main()

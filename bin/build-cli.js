#!/usr/bin/env node
// @ts-check

import minimist from 'minimist'
import { build } from './build.js'

function main() {
  console.log('build now')
  return build(minimist(process.argv.slice(2)))
}

main().then(() => {
  process.exit(0)
}).catch(err => {
  console.error(err)
  process.exit(1)
})

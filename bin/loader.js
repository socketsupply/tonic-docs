#!/usr/bin/env node
//
// Local servers aren't concurrent. So a cheap, fast and stable way to
// achieve hot-reloading is to restart the server after each request cycle,
// you end up with a lambda-like provider.
//
import { spawn } from 'child_process'

const start = () => {
  const node = spawn('node', ['bin/server'])

  node.stdout.on('data', data => process.stdout.write(data.toString()))
  node.stderr.on('data', data => process.stderr.write(data.toString()))
  node.on('close', (code) => {
    if (code && code !== 0) {
      process.exit(code)
    }
    start()
  })
}

start()

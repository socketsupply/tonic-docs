#!/usr/bin/env node

// @ts-check

//
// Local servers aren't concurrent. So a cheap, fast and stable way to
// achieve hot-reloading is to restart the server after each request cycle,
// you end up with a lambda-like provider.
//
import { spawn } from 'child_process'

let childProc
let shutdown

const start = () => {
  childProc = spawn('node', ['bin/server'])

  childProc.stdout.on('data', data => process.stdout.write(data.toString()))
  childProc.stderr.on('data', data => process.stderr.write(data.toString()))
  childProc.on('close', (code) => {
    if (code && code !== 0) {
      process.exit(code)
    }

    if (!shutdown) {
      start()
    }
  })
}

start()

process.on('SIGTERM', () => {
  shutdown = true

  if (childProc) {
    childProc.kill()
  }
})

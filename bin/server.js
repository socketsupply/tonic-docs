#!/usr/bin/env node

import https from 'node:https'
import path from 'node:path'
import send from '@pre-bundled/send'
import build from '../src/index.server.js'

const certs = {
  cert: `-----BEGIN CERTIFICATE-----
MIIC5TCCAc2gAwIBAgIJANzn3w7if9I9MA0GCSqGSIb3DQEBCwUAMBQxEjAQBgNV
BAMMCWxvY2FsaG9zdDAeFw0xOTAzMDUxMDU3NTlaFw0xOTA0MDQxMDU3NTlaMBQx
EjAQBgNVBAMMCWxvY2FsaG9zdDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBAO02/hSdRggyABtqSRx5NggZf5p5LvfvGNigYsz0zWblAKpFanEvn3SO1FGr
NkgY73QYgvmOaUKJ5Z8XaFI+pys35x1tWcRCdECIC9O9I7CaWigAQhrfFnX/6/4V
gb5QO6hIbezFWdvwefIDGaQwXimjzhjEzjMtGiG9WAhqmdSMwTsHC2uKQVLC0Jkd
a2AGFgzI3QU6v15FAXnqzNo9VYKAwv4T6jeuy6Lrg0dXHB3PnmSHB2mBvFoS09Mx
Zn0YPRGtMUyER0J1xbiutXPbV93bjatrVs7DOydFiF0et9cLdQ9RN+4bcsNoKOlb
4T4xZQMragQ8w61aP2iRtA04WmECAwEAAaM6MDgwFAYDVR0RBA0wC4IJbG9jYWxo
b3N0MAsGA1UdDwQEAwIHgDATBgNVHSUEDDAKBggrBgEFBQcDATANBgkqhkiG9w0B
AQsFAAOCAQEAvlpCKsRJhkKpabGjI/YO9RsfoWZxMEixEB78koU5NW4Mp4cyS7Yq
Ew/dsYKF56nm3ljc6qz4MN3k3HvCOK/J3JT9bj5nohjP1Kgck33iGpzvv0MNpoK6
3+KRJXZ88ndf0c/PZpz8aXqpTssb/a80WfO6ki6rd8472YN9tsDt3D7W89rQB5FG
vi/OabPA1QOosQLAgPmaqidMKXMTkiQlPnY9y3ZnviPzNy3oJ3JlMOvEIp0MdMJb
As9AaMfCk7PIA75+i7/lKfUyBjHyAOLvCwUhYg2+DCF+taXFnWHj8fljQ1+3ci82
eQCuplWjm12bZhaQYN51yTCs6R5HdqMuWA==
-----END CERTIFICATE-----`,
  key: `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDtNv4UnUYIMgAb
akkceTYIGX+aeS737xjYoGLM9M1m5QCqRWpxL590jtRRqzZIGO90GIL5jmlCieWf
F2hSPqcrN+cdbVnEQnRAiAvTvSOwmlooAEIa3xZ1/+v+FYG+UDuoSG3sxVnb8Hny
AxmkMF4po84YxM4zLRohvVgIapnUjME7BwtrikFSwtCZHWtgBhYMyN0FOr9eRQF5
6szaPVWCgML+E+o3rsui64NHVxwdz55khwdpgbxaEtPTMWZ9GD0RrTFMhEdCdcW4
rrVz21fd242ra1bOwzsnRYhdHrfXC3UPUTfuG3LDaCjpW+E+MWUDK2oEPMOtWj9o
kbQNOFphAgMBAAECggEBAOjLmzYn0l6gkzJUcEOdQMVaILw8STfQUZXmcI+rfxiH
jMuNLBTAI8CDmyI64B6JOhW5KHA4rlw6cDpdAmgUTIJBbnKWqg3NGcFqwhCeAbSD
Bg9TkYxFewl6iuLjwFxA6QsRaa9/Tdxmd4ZmPHfBb+d1dgEgwyu+C3MpGofH9gd7
50chfgI13gx7ygbiEJPD7s1wUsAW6ctyyGE7Fc98EJDL6LiGwgPEjUTZW+gyyQga
aJAGTRNXg3U76lS+60kiLLLO1Su6O2/5bdMNi6pp3hzoJRf0zhG3tF9VdlUFuGzV
QqxeYElPxtoN3f6KlVwHZKBo0O8ppZYvm3keTcuiJQECgYEA9yUaCMum2AecOUKk
bdOZ3LyQL+I7ITTDi7LZeh74yBpJSUfJFY+ylPZMdbplX/JWZYoM8N/66afBpNSh
nYmn9Wg4Z/j7mMNB2FVeXxLj9YKfDDxEvCqe6L3oQS4K6qrPTpZmNTFwegJjxASM
bvx9oRKEWZbwl5iJpDyfc/RNqPkCgYEA9bbO8jX2vSRkCaicVoqzgnd4mZVnKbxM
cUmoMrQQWI+CQI10vdjCFJjSD+KC0l5gXbvNCLoRkRjy6i30ZGAUkMDMf1hoggD1
bb6Hq1n0b8hytcBfyR8gptSiqCaz1mWkCg/ld6o298JyfYXF9SLPzON+68anbjw/
VTG8DuyjvqkCgYAi6pf6BCOnQ7P7lwG6DnofaHiKe1DVSSoTU4pMKZIGW0hdVQoA
xNN7Hi0BOPtXidpQ8CcR5OMDHdNK4UuQAUG8dyP49IE/PN7RnIX/sqCIMBMeXGlt
mCvpP+NPShz6uHUfajo4a6qzYiEMMYRRrdRl7ELMkXmeQUu462OvsyVBqQKBgBVW
QZRA4WM9VL6N+L1/H+V1cHCNy76RDmZMCiIVBtJZ6+qlHf0aZIgbWSpt9gREk8Ov
+jcGyV27N+TkBrPsr/x98YQhbjnT0XwtLmTP0+0dD/D+epLhdBlon5NQgQ9eFieV
h8yjaFCNfxmtUypdUoQtQSlCP+nPq4Q/ZGA7ZmC5AoGASMaUdski5fKfNoCvl91I
1nJ4bUdeLijGtNlJiMerZrcTrVe0DmIKiSj5Tr2JUYv97zR+ZsXLVfb6O5IXUK0Z
b6KGB4lEAWD45FYoNtIR0QwN6oHD+LuU4ZWZukUadiQWE8ncl80RT1kztCXV1Dfp
O+ScVeKng9YA3ju+83M4dr8=
-----END PRIVATE KEY-----`
}

// eslint-disable-next-line
const __dirname = path.dirname(new URL(import.meta.url).pathname)
const opts = { root: path.join(__dirname, '..', 'build') }

https.createServer(certs, async (req, res) => {
  const { pathname } = new URL(req.url, 'https://localhost:8080')

  //
  // rebuilds everything it hits!
  //
  await build(pathname)

  send(req, pathname, opts).pipe(res)
}).listen(8080)

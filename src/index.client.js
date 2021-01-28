import Tonic from '@optoolco/tonic'
import components from '@optoolco/components'
import examples from './example-setup.js'

components(Tonic)

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname === '/examples.html') {
    examples()
  }

  const theme = window.localStorage.getItem('theme') || 'light'
  document.body.setAttribute('theme', theme)

  const input = document.getElementById('dark')

  if (!input) return

  input.value = theme === 'dark'

  document.addEventListener('change', e => {
    if (Tonic.match(e.target, '#dark')) {
      const theme = e.target.checked ? 'dark' : 'light'
      window.localStorage.setItem('theme', theme)
      document.body.setAttribute('theme', theme)
    }
  })
})

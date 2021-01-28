//
// This file contains code that sets up some interactions
// for a few of the components on the example page.
//
import Tonic from '@optoolco/tonic'
import { Windowed } from '@optoolco/components/windowed'

export default () => {
  //
  // badge
  //
  const add = document.getElementById('add-notification')
  const subtract = document.getElementById('subtract-notification')
  const tonicBadge = document.querySelector('tonic-badge')

  add.addEventListener('click', (e) => {
    ++tonicBadge.state.count

    tonicBadge.reRender()
  })

  subtract.addEventListener('click', e => {
    let count = tonicBadge.state.count
    tonicBadge.state.count = count > 0 ? --count : count

    tonicBadge.reRender()
  })

  //
  // button
  //
  const buttons = [...document.querySelectorAll('.tonic-button-example')]

  for (const button of buttons) {
    button.addEventListener('click', e => {
      clearTimeout(button.timeout)
      button.timeout = setTimeout(() => {
        button.loading(false)
      }, 3e3)
    })
  }

  //
  // chart
  //
  const chart = document.querySelector('tonic-chart')
  chart.library = require('chart.js')
  chart.redraw()

  //
  // dialog
  //
  class ShowRandom extends Tonic {
    async click (e) {
      if (Tonic.match(e.target, '#update')) {
        this.state.message = String(Math.random())
        this.reRender()
      }
    }

    render () {
      return this.html`
        <header>Dialog</header>

        <main>
          ${this.state.message || 'Ready'}
        </main>

        <footer>
          <tonic-button id="update">Update</tonic-button>
        </footer>
      `
    }
  }

  Tonic.add(ShowRandom)

  const link = document.getElementById('example-dialog-link')
  const dialog = document.getElementById('example-dialog')

  link.addEventListener('click', async e => {
    await dialog.reRender()
    await dialog.show()
  })

  //
  // form
  //
  const form = document.getElementById('form-example')
  const button = document.getElementById('form-submit')

  form.addEventListener('input', e => {
    button.disabled = !form.validate()
  })

  form.addEventListener('change', e => {
    button.disabled = !form.validate()
  })

  //
  // input
  //
  const input = document.getElementById('tonic-input-example')
  const span = document.getElementById('tonic-input-state')

  const listener = e => {
    const state = input.state
    span.textContent = `Value: "${state.value || 'Empty'}", Focus: ${state.focus}`
  }

  input.addEventListener('input', listener)
  input.addEventListener('blur', listener)
  input.addEventListener('focus', listener)

  //
  // panel
  //
  class ReadWikipedia extends Tonic {
    async getArticle (title) {
      try {
        const res = await window.fetch(`https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=${title}&origin=*`)
        return Object.values((await res.json()).query.pages)[0]
      } catch (err) {
        return { title: 'Error', extract: err.message }
      }
    }

    async click (e) {
      if (e.target.value === 'close') {
        return this.parentElement.hide()
      }

      if (e.target.value === 'get') {
        const page = await this.getArticle('HTML')

        this.reRender(props => ({
          ...props,
          ...page
        }))
      }
    }

    async * render () {
      const title = this.props.title || 'Hello'
      const content = this.props.extract
        ? this.props.extract
        : 'Click "get" to fetch the content from Wikipedia.'

      return this.html`
        <header>Panel Example</header>
        <main>
          <h3>${title}</h3>
          <p>${content}</p>
        </main>
        <footer>
          <tonic-button value="close">Close</tonic-button>
          <tonic-button value="get" async="true">Get</tonic-button>
        </main>
      `
    }
  }

  Tonic.add(ReadWikipedia)

  const panelLink = document.getElementById('content-panel-link-example')
  const panel = document.getElementById('tonic-panel-example')

  panelLink.addEventListener('click', e => panel.show())

  //
  // profile-image
  //
  const profile = document.getElementById('profile-image-example-editable')

  profile.addEventListener('change', e => console.log(e.data))
  profile.addEventListener('error', e => console.log(e.message))

  //
  // progress-bar
  //
  let percentage = 0
  let interval = null

  const progressBar = document.getElementById('progress-bar-example')

  document.getElementById('start-progress').addEventListener('click', e => {
    clearInterval(interval)
    interval = setInterval(() => {
      progressBar.setProgress(percentage++)
      if (progressBar.value >= 100) percentage = 0
    }, 128)
  })

  document.getElementById('stop-progress').addEventListener('click', e => {
    clearInterval(interval)
  })

  //
  // router
  //
  const selectRoute = document.getElementById('tonic-router-select')
  const page2 = document.getElementById('page2')

  selectRoute.addEventListener('change', e => {
    window.history.pushState({}, '', selectRoute.value)
  })

  page2.addEventListener('match', () => {
    const { number } = page2.state
    const el = document.getElementById('page2-number')
    el.textContent = number
  })

  //
  // select
  //
  const select = document.getElementById('options-example-1')
  const notification = document.getElementsByTagName('tonic-toaster')[0]

  select.addEventListener('change', ({ target }) => {
    if (select.value === 'c') {
      select.setInvalid('Bad choice')
    } else {
      select.setValid()
    }

    notification.create({
      type: 'success',
      message: `Selected option was "${select.value}".`,
      title: 'Selection',
      duration: 2000
    })
  })

  //
  // toaster-inline
  //
  const toaster1 = document.getElementById('toaster-1')
  const toasterLink1 = document.getElementById('toaster-link-1')

  toasterLink1.addEventListener('click', e => toaster1.show())

  //
  // toaster
  //
  const notificationContainer = document.querySelector('tonic-toaster')

  document
    .getElementById('tonic-toaster-example')
    .addEventListener('click', e => notificationContainer.create({
      type: 'success',
      title: 'Greetings',
      message: 'Hello, World'
    }))

  //
  // windowed
  //
  class ExampleWindowed extends Windowed {
    async click (e) {
      const row = Tonic.match(e.target, '[data-id]')

      if (row) {
        console.log(await this.getRow(+row.dataset.id))
      }
    }

    //
    // Reuses the same DOM structure
    //
    updateRow (row, index, element) {
      element.children[0].textContent = row.title
      element.children[1].textContent = row.date
      element.children[2].textContent = row.random
    }

    //
    // Creates a new DOM structure
    //
    renderRow (row, index) {
      return this.html`
        <div class="tr" data-id="${row.id}">
          <div class="td">${row.title}</div>
          <div class="td">${row.date}</div>
          <div class="td">${row.random}</div>
        </div>
      `
    }

    render () {
      return this.html`
        <div class="th">
          <div class="td">Title</div>
          <div class="td">Date</div>
          <div class="td">Random</div>
        </div>
        ${super.render()}
      `
    }
  }

  Tonic.add(ExampleWindowed)

  //
  // This demo generates the data after you click the overlay instead of
  // on page load since 500K rows of data can take a few seconds to create.
  //
  const windowed = document.getElementsByTagName('example-windowed')[0]
  const overlay = document.getElementById('click-to-load')

  overlay.addEventListener('click', e => {
    const rows = []

    for (let i = 1; i < 500001; i++) {
      rows.push({
        id: i - 1,
        title: `Row #${i}`,
        date: String(new Date()),
        random: Math.random().toString(16).slice(2)
      })
    }

    overlay.classList.add('hidden')
    windowed.load(rows)
  })
}

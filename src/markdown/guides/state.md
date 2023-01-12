# Component State

`this.state` is a plain-old javascript object. Its value will be persisted if
the component is re-rendered. Any element that has an `id` attribute can use
state, and any component that uses state must have an `id` property.

```js
//
// Update a component's state
//
this.state.color = 'red'

//
// Reset a component's state
//
this.state = { color: 'red' }
```

```html
<my-app id="my-app"></my-app>
<!-- always set a unique ID if you have multiple elems. -->
<my-downloader id="download-chrome" app="chrome"></my-downloader>
<my-downloader id="download-firefox" app="firefox"></my-downloader>
```

---

Setting the state will *not* cause a component to re-render. This way you can
make incremental updates. Components can be updated independently. And
rendering only happens only when necessary.

Remember to clean up! States are just a set of key-value pairs on the `Tonic`
object. So if you create temporary components that use state, clean up their
state after you delete them. For example, if a list of a component with thousands
of temporary child elements all uses state, I should delete their state after
they get destroyed, `delete Tonic._states[someRandomId]`.

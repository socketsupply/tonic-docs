# Split

A resizable `Split` component that can contain any number of deeply nested
splits or child components (doesn't currently work on mobile).

## Demo

<div class="example split">
<style>
.example.split {
  border: 1px solid var(--tonic-border);
  height: 250px;
}
.example.split section {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
}
</style>
<tonic-split id="split-main" type="vertical">
  <tonic-split-left width="40%">
    <tonic-split id="split-js" type="horizontal">
      <tonic-split-top height="60%">
        <section>
          Hello, World.
        </section>
      </tonic-split-top>
      <tonic-split-bottom height="40%">
        <section>
          Hello, World.
        </section>
      </tonic-split-bottom>
    </tonic-split>
  </tonic-split-left>
  <tonic-split-right width="60%">
    <section>
      <tonic-button>Hello</tonic-button>
    </section>
  </tonic-split-right>
</tonic-split>
</div>

## Code

#### HTML

```
<tonic-split id="split-main" type="vertical">
  <tonic-split-left width="40%">
    <tonic-split id="split-secondary" type="horizontal">
      <tonic-split-top height="60%">
        <section>
          Hello, World.
        </section>
      </tonic-split-top>
      <tonic-split-bottom height="40%">
        <section>
          Hello, World.
        </section>
      </tonic-split-bottom>
    </tonic-split>
  </tonic-split-left>
  <tonic-split-right width="60%">
    <section>
      Hello, World.
    </section>
  </tonic-split-right>
</tonic-split>
```

## API

### Properties

| Property | Type | Description | Default |
| :--- | :--- | :--- | :--- |
| `id` | *string* | Select box with `id` attribute. | |
| `width` | *string* | Width of the select box. | `250px` |
| `height` | *string* | Height of the select box. | |

### Instance Methods

| Method | Description |
| :--- | :--- |
| `toggle(panel, force)` | Show or hide an area of the split. For a `vertical` split, `panel` will be `top` or `bottom`. For a `horizontal` split, `panel` will be `left` or `right`. The boolean `force` parameter will force it to show (true) or hide (false). |

### Instance Members

| Property | Description |
| :--- | :--- |
| `meta` | Gives you some information about the state of the split. |

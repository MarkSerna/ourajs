# Popovers

Floating glassmorphic panels anchored to a trigger element. Popovers support HTML content, titles, and close on outside click.

## Basic Usage

```js
const cleanup = Oura.popover('#settings-btn', {
  title: 'Settings',
  html: '<p>Customize your preferences here.</p>',
  placement: 'bottom'
});
```

<OuraDemo label="▶ Try Popover" :fn="(Oura, el) => Oura.popover(el, { title: 'Quick Settings', html: 'Toggle features here...', placement: 'bottom' })" />

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | `string` | — | Optional header text |
| `html` | `string` | — | HTML content for the body |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'` | Position relative to target |
| `closeOnClickOutside` | `boolean` | `true` | Close when clicking outside |

## With Rich Content

```js
Oura.popover('#info-btn', {
  title: 'Account Info',
  html: `
    <div style="display:flex;gap:12px;align-items:center">
      <div style="width:40px;height:40px;border-radius:50%;background:#3b82f6"></div>
      <div>
        <strong>John Doe</strong>
        <p style="margin:0;color:#64748b;font-size:0.85rem">john@example.com</p>
      </div>
    </div>
  `,
  placement: 'bottom'
});
```

## Cleanup

```js
const destroy = Oura.popover('#el', { html: 'Content' });
destroy(); // Removes popover and listeners
```

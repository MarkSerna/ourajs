# Hover Cards

Glassmorphic preview cards that appear when hovering over an element. Great for user profiles, link previews, or quick info panels.

## Basic Usage

```js
const cleanup = Oura.hoverCard('#user-link', {
  html: `
    <strong>Jane Smith</strong>
    <p style="margin:4px 0 0;color:#64748b;font-size:0.85rem">Full-stack engineer · @janesmith</p>
  `,
  placement: 'bottom',
});
```

<OuraDemo label="▶ Hover me for Card" :fn="(Oura, el) => Oura.hoverCard(el, {
  html: '<strong>Premium UX</strong><p>Swipe gestures enabled!</p>',
  placement: 'top'
})" />

## Options

| Option       | Type                | Default    | Description                 |
| ------------ | ------------------- | ---------- | --------------------------- |
| `html`       | `string`            | —          | HTML content                |
| `placement`  | `'top' \| 'bottom'` | `'bottom'` | Position relative to target |
| `openDelay`  | `number`            | `300`      | Delay before showing (ms)   |
| `closeDelay` | `number`            | `200`      | Delay before hiding (ms)    |

## Link Preview

```js
Oura.hoverCard('#docs-link', {
  html: `
    <div style="display:flex;align-items:center;gap:12px;">
      <div style="width:36px;height:36px;border-radius:8px;background:linear-gradient(135deg,#3b82f6,#8b5cf6)"></div>
      <div>
        <strong>Oura.js Docs</strong>
        <p style="margin:2px 0 0;font-size:0.8rem;color:#64748b">The complete API reference</p>
      </div>
    </div>
  `,
  openDelay: 400,
});
```

## Cleanup

```js
const destroy = Oura.hoverCard('#el', { html: '...' });
destroy(); // Removes card and listeners
```

## Behavior

- The card stays open while the user moves their cursor from the trigger to the card itself
- Configurable open/close delays prevent flickering

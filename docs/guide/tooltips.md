# Tooltips

Glassmorphic tooltips that appear on hover or focus. Supports 4 placements with configurable delays.

## Basic Usage

```js
const cleanup = Oura.tooltip('#my-button', {
  content: 'Save your work',
  placement: 'top'
});
```

<OuraDemo label="▶ Try Tooltip" :fn="(Oura, el) => Oura.tooltip(el, { content: 'This is a glassmorphic tooltip!', placement: 'top' })" />

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `content` | `string` | — | Text content of the tooltip |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Position relative to target |
| `delay` | `number` | `200` | Delay in ms before showing |

## Placements

```js
Oura.tooltip('#btn-top', { content: 'Top', placement: 'top' });
Oura.tooltip('#btn-right', { content: 'Right', placement: 'right' });
Oura.tooltip('#btn-bottom', { content: 'Bottom', placement: 'bottom' });
Oura.tooltip('#btn-left', { content: 'Left', placement: 'left' });
```

## Cleanup

The method returns a cleanup function that removes all event listeners and the DOM element:

```js
const destroy = Oura.tooltip('#el', { content: 'Hello' });

// Later, when you no longer need it:
destroy();
```

## Accessibility

- Tooltips are triggered on `mouseenter`/`mouseleave` *and* `focus`/`blur`
- Follows WAI-ARIA tooltip patterns

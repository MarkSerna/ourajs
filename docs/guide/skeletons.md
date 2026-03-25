# Skeletons

Animated loading placeholders with a glassmorphic shimmer effect. Use them to indicate content is loading.

## Basic Usage

```js
const el = Oura.skeleton({
  variant: 'rectangular',
  width: '100%',
  height: '120px',
  container: '#content-area',
});
```

<OuraDemo label="▶ Generate Skeleton" :fn="(Oura) => Oura.skeleton({
  variant: 'rectangular',
  width: '100%',
  height: '80px',
  container: 'body'
})" />

## Variants

```js
// Text lines
Oura.skeleton({ variant: 'text', count: 3, container: '#area' });

// Circle (avatar)
Oura.skeleton({ variant: 'circular', width: '48px', height: '48px' });

// Rectangle (card)
Oura.skeleton({ variant: 'rectangular', width: '300px', height: '200px' });
```

## Options

| Option      | Type                                    | Default             | Description                 |
| ----------- | --------------------------------------- | ------------------- | --------------------------- |
| `variant`   | `'text' \| 'circular' \| 'rectangular'` | `'rectangular'`     | Shape variant               |
| `width`     | `string`                                | `'100%'` / `'48px'` | CSS width                   |
| `height`    | `string`                                | auto                | CSS height                  |
| `count`     | `number`                                | `1`                 | Number of skeleton elements |
| `container` | `string \| HTMLElement`                 | `document.body`     | Target container            |

## Replace with Content

```js
const skeleton = Oura.skeleton({ variant: 'text', count: 4, container: '#area' });

// After data loads:
skeleton.remove();
document.querySelector('#area').innerHTML = '<p>Real content here</p>';
```

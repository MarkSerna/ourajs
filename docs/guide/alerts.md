# Inline Alerts

Static, inline glassmorphic alert banners. Unlike toasts, these stay in place within your layout until dismissed.

## Basic Usage

```js
Oura.alert({
  title: 'Heads up!',
  description: 'This action cannot be undone.',
  variant: 'warning'
});
```

<OuraDemo label="▶ Show Success Alert" :fn="(Oura) => Oura.alert({
  title: 'All Good!',
  description: 'Procesamiento completado con éxito.',
  variant: 'success'
})" />

## Variants

```js
Oura.alert({ description: 'Default alert.', variant: 'default' });
Oura.alert({ description: 'Operation succeeded!', variant: 'success' });
Oura.alert({ description: 'Something might be wrong.', variant: 'warning' });
Oura.alert({ description: 'An error occurred.', variant: 'error' });
Oura.alert({ description: 'New version available.', variant: 'info' });
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | `string` | — | Bold header text |
| `description` | `string` | — | Alert message |
| `variant` | `'default' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'default'` | Color variant |
| `dismissible` | `boolean` | `true` | Show dismiss × button |
| `container` | `string \| HTMLElement` | `document.body` | Target container |

## Inside a Container

```js
Oura.alert({
  title: 'Saved!',
  description: 'Your changes have been saved successfully.',
  variant: 'success',
  container: '#notifications-area'
});
```

## Programmatic Removal

`Oura.alert()` returns the DOM element, so you can remove it manually:

```js
const el = Oura.alert({ description: 'Loading...' });
setTimeout(() => el.remove(), 3000);
```

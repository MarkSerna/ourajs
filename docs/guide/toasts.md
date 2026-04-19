# Toasts

Toasts are non-blocking, transient notifications that elegantly stack in the corner of the user's screen.

## Simple Toast

Standard toast invocation:

```javascript
import Oura from 'oura-ui';

Oura.success('Profile saved successfully');
Oura.error('Failed to upload file');
Oura.info('New message received');
```

<div style="display:flex; gap:10px;">
  <OuraDemo label="▶ Success" :fn="(Oura) => Oura.success('Profile saved!')" />
  <OuraDemo label="▶ Error" variant="outline" :fn="(Oura) => Oura.error('Failed to save')" />
</div>

## Progress Toast

You can display an animated progress bar indicating time left before dismissal. This is highly recommended for loading states.

```javascript
Oura.toast({
  title: 'Uploading 3 files...',
  type: 'progress',
  timer: 4500,
  icon: 'progress',
});
```

<OuraDemo label="▶ Try Progress Toast" :fn="(Oura) => Oura.toast({
  title: 'Uploading...',
  type: 'progress',
  timer: 4000,
  icon: 'progress'
})" />

## Toast Actions

Add interactive buttons directly to your toasts.

```javascript
Oura.toast({
  title: 'Message deleted',
  actions: [{ label: 'Undo', onClick: () => Oura.success('Restored!') }],
});
```

<OuraDemo label="▶ Toast with Actions" :fn="(Oura) => Oura.toast({
  title: 'Message deleted',
  actions: [
    { label: 'Undo', onClick: () => Oura.success('Restored!') }
  ]
})" />

## Updating a visible toast

`Oura.toast()` returns a **handle** (`OuraToastHandle`): a `Promise<boolean>` plus an `update()` method to change title, text, or a known icon while the toast is still open:

```js
const t = Oura.toast({ title: 'Uploading…', timer: 0 });
// later
t.update({ title: 'Almost done…' });
await t;
```

When the toast closes, document-level touch listeners used for swipe are removed automatically.

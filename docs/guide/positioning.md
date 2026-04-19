# Toast Positioning

Oura supports **6 anchor positions** for your toast notifications. Configure globally once and all toasts will appear there.

## Setting the Position

```javascript
import Oura from 'oura-ui';

Oura.configure({
  position: 'top-right', // default
});
```

## Available Positions

```
┌────────────┬────────────┬────────────┐
│  top-left  │ top-center │  top-right │
├────────────┼────────────┼────────────┤
│bottom-left │bottom-center│bottom-right│
└────────────┴────────────┴────────────┘
```

| Value           | Location                      |
| --------------- | ----------------------------- |
| `top-left`      | Top-left corner               |
| `top-center`    | Top, horizontally centered    |
| `top-right`     | Top-right corner _(default)_  |
| `bottom-left`   | Bottom-left corner            |
| `bottom-center` | Bottom, horizontally centered |
| `bottom-right`  | Bottom-right corner           |

## Live Example

```javascript
// Change position at runtime — affects subsequent toasts
Oura.configure({ position: 'bottom-center' });
Oura.success('Anchored to bottom-center!');
```

<OuraDemo label="▶ Fire a Toast" :fn="(Oura) => {
  Oura.configure({ position: 'bottom-center' });
  Oura.success('Anchored to bottom-center!');
}" />

## Stacking Behavior

When multiple toasts are fired quickly, Oura stacks them with a **3D deck effect** — the newest toast is always on top at full scale, while older toasts scale down behind it.

```javascript
// Fires 5 toasts rapidly to demonstrate the 3D stack
const msgs = ['Initializing...', 'Loading assets...', 'Connecting...', 'Syncing data...', 'Done!'];
msgs.forEach((msg, i) => {
  setTimeout(() => {
    Oura.toast({ title: msg, icon: i === 4 ? 'success' : 'info' });
  }, i * 150);
});
```

:::tip
Stacking works regardless of position. Toasts accumulate from the anchor point inward.
:::

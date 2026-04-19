# Drawers (Side Sheets)

Oura's **Drawer** is a side panel that slides in from any edge of the screen, perfect for settings panels, navigation, or rich content that doesn't need a full page.

## Basic Drawer

```javascript
import Oura from 'oura-ui';

Oura.drawer({
  title: 'User Preferences',
  side: 'right', // 'left' | 'right' | 'top' | 'bottom'
  html: '<p>Configure your app settings here.</p>',
  confirmButtonText: 'Save',
}).then((result) => {
  if (result.isConfirmed) {
    Oura.success('Settings saved!');
  }
});
```

<OuraDemo label="▶ Open Right Drawer" :fn="(Oura) => Oura.drawer({ title: 'Settings', side: 'right', html: 'Panel content' })" />

## Side Options

The `side` property accepts four values to control which edge the panel slides in from:

| Value    | Description                          |
| -------- | ------------------------------------ |
| `right`  | Slides in from the right _(default)_ |
| `left`   | Slides in from the left              |
| `top`    | Drops down from the top              |
| `bottom` | Rises from the bottom                |

## Custom Width

You can control the panel width via the `width` property (only applies to `left`/`right`):

```javascript
Oura.drawer({
  title: 'Wide Panel',
  side: 'right',
  width: '520px',
  html: '<p>Extra wide content area.</p>',
});
```

## Rich HTML Content

Drawers accept any HTML string, making them great for settings forms:

```javascript
Oura.drawer({
  title: 'Settings',
  side: 'right',
  width: '440px',
  html: `
    <div style="display:flex;flex-direction:column;gap:16px;">
      <label>
        <input type="checkbox" checked>
        Enable notifications
      </label>
      <label>
        <input type="checkbox">
        Beta features
      </label>
    </div>
  `,
  confirmButtonText: 'Save Settings',
});
```

:::tip
Drawers use the same glassmorphism styles as modals and automatically follow the active theme (light/dark).
:::

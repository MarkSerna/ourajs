# Oura.js

[![npm version](https://img.shields.io/npm/v/oura-js)](https://www.npmjs.com/package/oura-js)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/oura-js)](https://bundlephobia.com/package/oura-js)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6)](https://www.typescriptlang.org/)

> 🪟 The industry's most versatile glassmorphism notification & component library.

**Zero dependencies. 10 kB gzipped. Dark mode. i18n. Fully typed.**

---

## ✨ Features

| Component | Description |
|---|---|
| **Modals** | Glassmorphic dialog boxes with confirm/cancel/deny |
| **Toasts** | Stackable notifications with 3D depth effect |
| **Drawers** | Side panels (Sheet) from any edge |
| **Tooltips** | Contextual hints on hover/focus |
| **Popovers** | Floating panels anchored to elements |
| **Dropdowns** | Menus with icons, shortcuts & keyboard nav |
| **Context Menus** | Custom right-click menus |
| **Inline Alerts** | Static banners (success/warning/error/info) |
| **Skeletons** | Animated loading placeholders |
| **Hover Cards** | Preview cards on hover |

**Plus:** Toast actions, custom SVG icons, exit animations, 6-way positioning, system theme sync, and i18n (10 languages).

---

## 📦 Install

```bash
npm install oura-js
```

### CDN

```html
<script src="https://unpkg.com/oura-js/dist/oura.umd.cjs"></script>
```

---

## 🚀 Quick Start

```js
import Oura from 'oura-js';

// Configure
Oura.configure({
  theme: 'system',      // light-glass | dark-glass | system
  position: 'top-right', // 6 positions
  locale: 'en'
});

// Toast
Oura.success('Saved!', 'Your changes are live.');

// Toast with actions
Oura.toast({
  title: 'File deleted',
  icon: 'warning',
  actions: [
    { label: 'Undo', onClick: () => console.log('Undo!') }
  ]
});

// Confirm dialog
const result = await Oura.confirm('Delete?', 'This is permanent.');
if (result.isConfirmed) { /* ... */ }

// Drawer
Oura.drawer({
  title: 'Settings',
  side: 'right',
  html: '<p>Your content here</p>'
});

// Tooltip
Oura.tooltip('#my-btn', {
  content: 'Save your work',
  placement: 'top'
});

// Dropdown Menu
Oura.dropdown('#menu-btn', {
  items: [
    { label: 'Edit', icon: '✏️', shortcut: '⌘E', onClick: () => {} },
    { separator: true },
    { label: 'Delete', danger: true, onClick: () => {} }
  ]
});

// Inline Alert
Oura.alert({
  title: 'Heads up',
  description: 'New version available.',
  variant: 'info'
});
```

---

## 🎨 Theming

```js
// Light / Dark
Oura.configure({ theme: 'light-glass' });
Oura.configure({ theme: 'dark-glass' });

// Auto-detect OS preference
Oura.configure({ theme: 'system' });

// Custom accent color
Oura.configure({ accent: '#8b5cf6' });
```

### CSS Custom Properties

| Variable | Default | Description |
|---|---|---|
| `--oura-bg` | `rgba(255,255,255,0.45)` | Background |
| `--oura-text` | `#1a1a1a` | Text color |
| `--oura-border` | `rgba(255,255,255,0.6)` | Border |
| `--oura-accent` | `#007bff` | Accent color |
| `--oura-radius` | `16px` | Border radius |
| `--oura-font` | `system-ui` | Font family |

---

## 🌐 i18n

Built-in support for 10 languages: `en`, `es`, `fr`, `de`, `it`, `pt`, `zh`, `ja`, `ru`, `ar`.

```js
Oura.configure({ locale: 'es' });
// Buttons will show "Confirmar", "Cancelar", etc.
```

---

## TypeScript

Tipos públicos se reexportan junto al default:

```ts
import Oura from 'oura-js';
import type { OuraOptions, OuraConfig, OuraResult, OuraPromiseMessages } from 'oura-js';
```

`package.json` declara `exports.types` primero para que el IDE resuelva bien los `.d.ts`.

---

## Development

```bash
npm run lint              # ESLint (TypeScript)
npm test                  # Vitest
npm run test:coverage     # Vitest + V8 coverage (same as CI)
npm run build
```

Guidance on HTML, XSS, and SSR: see **Security & HTML** in the documentation site.

---

## 📖 API Reference

### Notifications

| Method | Description |
|---|---|
| `Oura.toast(options)` | Toast notification |
| `Oura.success(title, text?)` | Success toast shorthand |
| `Oura.error(title, text?)` | Error toast shorthand |
| `Oura.warning(title, text?)` | Warning toast shorthand |
| `Oura.info(title, text?)` | Info toast shorthand |
| `Oura.promise(promise, msgs)` | Promise-tracking toast |

### Dialogs

| Method | Description |
|---|---|
| `Oura.fire(options)` | Modal dialog |
| `Oura.confirm(title, text?)` | Confirm dialog |
| `Oura.prompt(options)` | Input prompt |
| `Oura.drawer(options)` | Side panel |

### Components

| Method | Returns | Description |
|---|---|---|
| `Oura.tooltip(target, opts)` | `cleanup()` | Tooltip |
| `Oura.popover(target, opts)` | `cleanup()` | Popover |
| `Oura.dropdown(target, opts)` | `cleanup()` | Dropdown menu |
| `Oura.contextMenu(target, items)` | `cleanup()` | Right-click menu |
| `Oura.hoverCard(target, opts)` | `cleanup()` | Hover preview card |
| `Oura.alert(opts)` | `HTMLElement` | Inline banner |
| `Oura.skeleton(opts)` | `HTMLElement` | Loading placeholder |

---

## 📄 License

MIT © [Oura Open Source](https://github.com/MarkSerna/ourajs)

# Getting Started

Oura.js is a modern, beautifully designed alternative to traditional notification libraries. Built purely in TypeScript for the glassmorphism era.

## Installation

Using NPM or Yarn:

```sh
npm install oura-ui
```

Or inject it directly in your HTML (CDN):

```html
<script type="module">
  import Oura from 'https://unpkg.com/oura-ui/dist/oura.js';

  Oura.success('Library loaded successfully!');
</script>
```

## Global Configuration

You can customize the base behavior at the start of your app:

```javascript
import Oura from 'oura-ui';

Oura.configure({
  theme: 'dark-glass', // or 'light-glass'
  accent: '#8b5cf6', // The main color ring and buttons
  locale: 'ja', // 10 built-in languages supported (en, es, fr, de, it, pt, zh, ja, ru, ar)
  customI18n: {
    // You can even invent your own languages!
    alien: { confirm: 'Zorg', cancel: 'Norg', submit: 'Bloop', continue: 'Glorp' },
  },
});
```

## Basic Usage

Oura relies extensively on Promises (`await`), meaning you can elegantly wait for the user response linearly.

```javascript
// Quick success notification
Oura.success('Great job!', 'Your settings are saved.');

// Advanced modal with awaits
const result = await Oura.confirm('Discard Draft?', 'This action is permanent.');
if (result.isConfirmed) {
  // Proceed with deletion...
}
```

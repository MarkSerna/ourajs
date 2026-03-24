# Security & HTML

Oura builds UI with the DOM API and often assigns strings with `innerHTML` (for example modal titles and body, tooltip content, popovers, hover cards, and toast markup).

## Trusted content only

Treat every string you pass as **HTML-capable** unless the API clearly uses plain text (for example button labels built with `textContent`, or `.update()` on toasts for title/text fields).

**Do not** pass unsanitized user input, URL parameters, or third-party CMS HTML directly into:

- `title`, `text`, `html` on modals, drawers, and `Oura.fire` / `Oura.confirm`
- `Oura.toast({ title, text, ... })` when the strings can contain markup
- `Oura.tooltip`, `Oura.popover`, `Oura.hoverCard`
- `Oura.alert` `title` and `description` in the default implementation

If you need rich text from untrusted sources, **sanitize** it first (for example with a vetted library) or render safe plain text only.

## Icons and custom SVG

Icon fields may inject SVG or HTML. Only use trusted icon sources or static assets you control.

## SSR and `window`

The library expects a browser environment for `document` and `window`. In SSR frameworks, load Oura only on the client (dynamic import, `onMounted`, or a client-only boundary) so the initial server render does not execute DOM code.

## Globals

When loaded in the browser, `window.Oura` is set to the default instance. Avoid collisions with other scripts that might expect a different global.

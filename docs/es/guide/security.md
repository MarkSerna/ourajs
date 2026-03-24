# Seguridad y HTML

Oura construye la interfaz con el DOM y, en varios sitios, asigna cadenas con `innerHTML` (por ejemplo títulos y cuerpo de modales, tooltips, popovers, hover cards y markup de toasts).

## Solo contenido de confianza

Asume que las cadenas que pasas pueden interpretarse como **HTML**, salvo cuando la API use texto plano (por ejemplo etiquetas de botones con `textContent`, o `.update()` en toasts para título/texto).

**No** pases sin sanitizar entrada de usuarios, parámetros de URL ni HTML de un CMS directamente a:

- `title`, `text`, `html` en modales, drawers y `Oura.fire` / `Oura.confirm`
- `Oura.toast({ title, text, ... })` si las cadenas pueden llevar markup
- `Oura.tooltip`, `Oura.popover`, `Oura.hoverCard`
- `title` y `description` de `Oura.alert` en la implementación por defecto

Si necesitas texto enriquecido de origen no confiable, **sanitízalo** antes (con una librería adecuada) o muestra solo texto plano seguro.

## Iconos y SVG personalizados

Los campos de icono pueden insertar SVG u HTML. Usa solo fuentes de iconos de confianza o recursos estáticos que controles.

## SSR y `window`

La librería espera un entorno de navegador (`document` / `window`). En frameworks con SSR, carga Oura solo en el cliente (import dinámico, `onMounted` o un límite “solo cliente”) para que el render en servidor no ejecute código DOM.

## Globales

En el navegador, `window.Oura` apunta a la instancia por defecto. Evita choques con otros scripts que definan un global distinto.

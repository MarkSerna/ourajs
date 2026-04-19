import { defineConfig } from 'vitepress';

/** Páginas con versión en /es/guide/; el resto enlaza a la guía en inglés. */
const ES_GUIDES = new Set(['getting-started', 'modals', 'toasts', 'security']);

function guideLink(slug: string, lang: string): string {
  if (lang === 'es' && ES_GUIDES.has(slug)) return `/es/guide/${slug}`;
  return `/guide/${slug}`;
}

function sidebar(lang: string) {
  const isEs = lang === 'es';
  const gl = (slug: string) => guideLink(slug, lang);
  /** Etiqueta ES + indicador (EN) o etiqueta EN pura */
  const t = (enLabel: string, esLabel: string) => (isEs ? `${esLabel} (EN)` : enLabel);

  return [
    {
      text: isEs ? 'Introducción' : 'Introduction',
      items: [{ text: isEs ? 'Primeros Pasos' : 'Getting Started', link: gl('getting-started') }],
    },
    {
      text: isEs ? 'Superposiciones' : 'Overlays',
      items: [
        { text: isEs ? 'Modales' : 'Modals', link: gl('modals') },
        { text: isEs ? 'Toasts' : 'Toasts', link: gl('toasts') },
        { text: t('Drawers', 'Paneles'), link: gl('drawers') },
        { text: t('Popovers', 'Popovers'), link: gl('popovers') },
        { text: t('Tooltips', 'Tooltips'), link: gl('tooltips') },
        { text: t('Hover Cards', 'Tarjetas'), link: gl('hover-cards') },
      ],
    },
    {
      text: isEs ? 'Menús' : 'Menus',
      items: [
        { text: t('Dropdown Menus', 'Menús desplegables'), link: gl('dropdowns') },
        { text: t('Context Menus', 'Menús contextuales'), link: gl('context-menus') },
      ],
    },
    {
      text: 'Feedback',
      items: [
        { text: t('Inline Alerts', 'Alertas'), link: gl('alerts') },
        { text: t('Skeletons', 'Skeletons'), link: gl('skeletons') },
      ],
    },
    {
      text: isEs ? 'Avanzado' : 'Advanced',
      items: [
        { text: t('Promises & Async', 'Promesas'), link: gl('promises') },
        { text: t('Positioning', 'Posicionamiento'), link: gl('positioning') },
        { text: t('Internationalization', 'Internacionalización'), link: gl('i18n') },
        { text: isEs ? 'Seguridad y HTML' : 'Security & HTML', link: gl('security') },
      ],
    },
  ];
}

export default defineConfig({
  title: 'Oura.js',
  description: 'A premium, lightweight, glassmorphism notification library.',
  base: '/oura-ui/',

  locales: {
    root: {
      label: 'English',
      lang: 'en-US',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/' },
          { text: 'Guide', link: '/guide/getting-started' },
        ],
        sidebar: sidebar('en'),
      },
    },
    es: {
      label: 'Español',
      lang: 'es',
      themeConfig: {
        nav: [
          { text: 'Inicio', link: '/es/' },
          { text: 'Guía', link: '/es/guide/getting-started' },
        ],
        sidebar: sidebar('es'),
      },
    },
  },

  themeConfig: {
    socialLinks: [{ icon: 'github', link: 'https://github.com/MarkSerna/oura-ui' }],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026-present Oura Open Source',
    },
  },
});

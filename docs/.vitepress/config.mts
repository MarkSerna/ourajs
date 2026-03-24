import { defineConfig } from 'vitepress'

function sidebar(lang: string) {
  const isEs = lang === 'es'
  const prefix = isEs ? '/es' : ''
  return [
    {
      text: isEs ? 'Introducción' : 'Introduction',
      items: [
        { text: isEs ? 'Primeros Pasos' : 'Getting Started', link: `${prefix}/guide/getting-started` }
      ]
    },
    {
      text: isEs ? 'Superposiciones' : 'Overlays',
      items: [
        { text: isEs ? 'Modales' : 'Modals', link: `${prefix}/guide/modals` },
        { text: isEs ? 'Toasts' : 'Toasts', link: `${prefix}/guide/toasts` },
        { text: isEs ? 'Paneles' : 'Drawers', link: `${prefix}/guide/drawers` },
        { text: 'Popovers', link: `${prefix}/guide/popovers` },
        { text: 'Tooltips', link: `${prefix}/guide/tooltips` },
        { text: isEs ? 'Tarjetas' : 'Hover Cards', link: `${prefix}/guide/hover-cards` },
      ]
    },
    {
      text: isEs ? 'Menús' : 'Menus',
      items: [
        { text: isEs ? 'Menús Desplegables' : 'Dropdown Menus', link: `${prefix}/guide/dropdowns` },
        { text: isEs ? 'Menús Contextuales' : 'Context Menus', link: `${prefix}/guide/context-menus` },
      ]
    },
    {
      text: 'Feedback',
      items: [
        { text: isEs ? 'Alertas' : 'Inline Alerts', link: `${prefix}/guide/alerts` },
        { text: 'Skeletons', link: `${prefix}/guide/skeletons` },
      ]
    },
    {
      text: isEs ? 'Avanzado' : 'Advanced',
      items: [
        { text: isEs ? 'Promesas' : 'Promises & Async', link: `${prefix}/guide/promises` },
        { text: isEs ? 'Posicionamiento' : 'Positioning', link: `${prefix}/guide/positioning` },
        { text: isEs ? 'Internacionalización' : 'Internationalization', link: `${prefix}/guide/i18n` },
        { text: isEs ? 'Seguridad y HTML' : 'Security & HTML', link: `${prefix}/guide/security` },
      ]
    }
  ]
}

export default defineConfig({
  title: "Oura.js",
  description: "A premium, lightweight, glassmorphism notification library.",
  base: '/ourajs/',

  locales: {
    root: {
      label: 'English',
      lang: 'en-US',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/' },
          { text: 'Guide', link: '/guide/getting-started' }
        ],
        sidebar: sidebar('en')
      }
    },
    es: {
      label: 'Español',
      lang: 'es',
      themeConfig: {
        nav: [
          { text: 'Inicio', link: '/es/' },
          { text: 'Guía', link: '/es/guide/getting-started' }
        ],
        sidebar: sidebar('es')
      }
    }
  },

  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/MarkSerna/ourajs' }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026-present Oura Open Source'
    }
  }
})

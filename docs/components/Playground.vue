<script setup>
import { onMounted, ref, shallowRef, computed, watch } from 'vue';
import { useData, withBase } from 'vitepress';

const { lang } = useData();

const Oura = shallowRef(null);
const currentTheme = ref('light-glass');
const activePos = ref('top-right');
const codeSnippet = ref('');
const isLangOpen = ref(false);

const toggleAppTheme = () => {
  const html = document.documentElement;
  html.classList.toggle('dark');
};

const getBase = (path) => withBase(path);

// ── Translations ──
const translations = {
  en: {
    hero_title: 'Oura.js Playground',
    hero_desc:
      'An interactive playground for the glassmorphism notification engine. Click any demo to fire it live.',
    section_pos: 'Toast Position',
    section_layouts: 'Layouts',
    section_async: 'Async',
    section_theme: 'Theme',
    btn_drawer: 'Side Drawer',
    btn_confirm: 'Confirm',
    btn_prompt: 'Prompt',
    btn_stack: '3D Stack',
    btn_promise: 'Promise',
    btn_async: 'Async SWAL',
    btn_light: '☀️ Light',
    btn_dark: '🌙 Dark',
    btn_system: '⚡ System',
    card_code: 'Live Code Preview',
    card_notifications: '🔔 Toast Notifications',
    card_features: '✨ Key Features',
    demo_success_label: 'Success',
    demo_error_label: 'Error',
    demo_warning_label: 'Warning',
    demo_info_label: 'Info',
    demo_progress_label: 'Progress',
    demo_modal_label: 'Custom Modal',
    feature_glass_title: 'Glassmorphism',
    feature_glass_desc: 'Premium translucent UI with backdrop-blur and soft shadows.',
    feature_theme_title: 'System Theme Sync',
    feature_theme_desc: 'Automatically follows the OS light/dark preference.',
    feature_pos_title: '6-Point Positioning',
    feature_pos_desc: 'Place toasts at any corner or center edge of the screen.',
    feature_i18n_title: 'i18n Ready',
    feature_i18n_desc: '10 built-in locales + custom language support.',
    feature_deps_title: 'Zero Dependencies',
    feature_deps_desc: 'Pure TypeScript, ~5kB gzipped. No dependencies.',
    feature_access_title: 'Accessible',
    feature_access_desc: 'Full WAI-ARIA, Escape key, Focus Trapping & reduced-motion support.',
    toast_pos_updated: 'Position Updated',
    toast_pos_text: 'Aligned to',
  },
  es: {
    hero_title: 'Oura.js Playground',
    hero_desc:
      'Un patio de juegos interactivo para el motor de notificaciones glassmorphism. Haz clic en cualquier demo para verla en vivo.',
    section_pos: 'Posición del Toast',
    section_layouts: 'Diseños',
    section_async: 'Asíncrono',
    section_theme: 'Tema',
    btn_drawer: 'Panel Lateral',
    btn_confirm: 'Confirmar',
    btn_prompt: 'Entrada',
    btn_stack: 'Pila 3D',
    btn_promise: 'Promesa',
    btn_async: 'SWAL Asíncrono',
    btn_light: '☀️ Claro',
    btn_dark: '🌙 Oscuro',
    btn_system: '⚡ Sistema',
    card_code: 'Vista Previa del Código',
    card_notifications: '🔔 Notificaciones Toast',
    card_features: '✨ Características Clave',
    demo_success_label: 'Éxito',
    demo_error_label: 'Error',
    demo_warning_label: 'Advertencia',
    demo_info_label: 'Información',
    demo_progress_label: 'Progreso',
    demo_modal_label: 'Modal Personalizado',
    feature_glass_title: 'Glassmorphism',
    feature_glass_desc: 'Interfaz translúcida premium con desenfoque de fondo y sombras suaves.',
    feature_theme_title: 'Sincronización de Tema',
    feature_theme_desc: 'Sigue automáticamente la preferencia del sistema operativo.',
    feature_pos_title: 'Posicionamiento de 6 Puntos',
    feature_pos_desc: 'Coloca toasts en cualquier esquina o centro de la pantalla.',
    feature_i18n_title: 'Listo para i18n',
    feature_i18n_desc: '10 locales integrados + soporte para idiomas personalizados.',
    feature_deps_title: 'Cero Dependencias',
    feature_deps_desc: 'TypeScript puro, ~5kB comprimido. Sin dependencias.',
    feature_access_title: 'Accesible',
    feature_access_desc: 'Soporte completo para WAI-ARIA, tecla Escape y bloqueo de foco.',
    toast_pos_updated: 'Posición Actualizada',
    toast_pos_text: 'Anclado en',
  },
};

const currentLang = computed(() => (lang.value.startsWith('es') ? 'es' : 'en'));
const t = (key) => translations[currentLang.value][key] || key;

onMounted(async () => {
  const module = await import('../../src/index.ts');
  Oura.value = module.default;
  updateCodeSnippet();
});

const updateCodeSnippet = () => {
  codeSnippet.value = `Oura.configure({ 
  position: '${activePos.value}',
  theme: '${currentTheme.value}' 
});`;
};

const setTheme = (theme) => {
  if (!Oura.value) return;
  currentTheme.value = theme;
  Oura.value.configure({ theme });
  updateCodeSnippet();
};

const setPos = (pos) => {
  if (!Oura.value) return;
  activePos.value = pos;
  Oura.value.configure({ position: pos });
  Oura.value.toast({
    title: t('toast_pos_updated'),
    text: `${t('toast_pos_text')} ${pos}`,
    icon: 'success',
  });
  updateCodeSnippet();
};

const triggerDrawer = () => {
  if (!Oura.value) return;
  Oura.value
    .drawer({
      title: 'User Preferences',
      side: 'right',
      html: `<div style="display:flex;flex-direction:column;gap:20px;">
      <p style="color:#64748b">Adjust your application preferences.</p>
      <label style="display:flex;align-items:center;gap:10px;cursor:pointer;">
        <input type="checkbox" checked> Enable Notifications
      </label>
      <label style="display:flex;align-items:center;gap:10px;cursor:pointer;">
        <input type="checkbox"> Beta Features
      </label>
    </div>`,
      confirmButtonText: 'Save Settings',
    })
    .then((r) => {
      if (r.isConfirmed) Oura.value.success('Settings Saved');
    });
};

const triggerConfirm = async () => {
  if (!Oura.value) return;
  const r = await Oura.value.confirm('Delete Workspace?', 'This action cannot be undone.');
  if (r.isConfirmed) Oura.value.success('Deleted!');
};

const triggerPrompt = async () => {
  if (!Oura.value) return;
  const r = await Oura.value.prompt('Enter your email', 'We will send a reset link.', 'email');
  if (r.isConfirmed && r.value) Oura.value.success('Sent!', `Email: ${r.value}`);
};

const triggerStack = () => {
  if (!Oura.value) return;
  ['Initializing...', 'Loading Assets...', 'Configuring...', 'Done!'].forEach((m, i) => {
    setTimeout(() => Oura.value.toast({ title: m, icon: i === 3 ? 'success' : 'info' }), i * 150);
  });
};

const triggerPromise = () => {
  if (!Oura.value) return;
  const p = new Promise((res, rej) =>
    setTimeout(() => (Math.random() > 0.3 ? res('Success!') : rej('Failed')), 2000)
  );
  Oura.value.promise(p, {
    loading: 'Processing...',
    success: (d) => `Result: ${d}`,
    error: (e) => `Error: ${e}`,
  });
};

const triggerAsync = async () => {
  if (!Oura.value) return;
  await Oura.value.prompt({
    title: 'Authentication',
    text: 'Type "unlock" to proceed',
    preConfirm: async (val) => {
      await new Promise((r) => setTimeout(r, 1000));
      if (val !== 'unlock') throw new Error('Invalid code');
    },
  });
};

const triggerDropdown = (e) => {
  if (!Oura.value) return;
  Oura.value.dropdown(e.currentTarget, {
    items: [
      { label: 'Edit Profile', icon: '✏️', onClick: () => Oura.value.info('Edit') },
      { label: 'Settings', icon: '⚙️', onClick: () => Oura.value.info('Settings') },
      { separator: true },
      { label: 'Logout', icon: '🚪', danger: true, onClick: () => Oura.value.warning('Logout') },
    ],
  });
};

const triggerAlert = () => {
  if (!Oura.value) return;
  Oura.value.alert({
    title: 'System Notice',
    description: 'New updates are available.',
    variant: 'info',
    container: '.pg-alerts-area',
  });
};

const triggerSkeleton = () => {
  if (!Oura.value) return;
  const area = document.querySelector('.pg-skeleton-area');
  area.innerHTML = '';
  Oura.value.skeleton({ variant: 'text', count: 2, container: '.pg-skeleton-area' });
  setTimeout(() => {
    area.innerHTML = '<p style="font-size:0.85rem;color:#64748b;">Loaded ✓</p>';
  }, 2000);
};

const positions = [
  { key: 'top-left', label: 'TL' },
  { key: 'top-center', label: 'TC' },
  { key: 'top-right', label: 'TR' },
  { key: 'bottom-left', label: 'BL' },
  { key: 'bottom-center', label: 'BC' },
  { key: 'bottom-right', label: 'BR' },
];
</script>

<template>
  <div class="pg-root" @click="isLangOpen = false">
    <!-- TOP BAR -->
    <div class="pg-top-bar">
      <a
        :href="
          getBase(currentLang === 'es' ? '/es/guide/getting-started' : '/guide/getting-started')
        "
        class="pg-btn pg-docs-btn"
      >
        📘 {{ currentLang === 'es' ? 'Documentación' : 'Documentation' }}
      </a>
      <div
        class="pg-custom-select-wrapper"
        :class="{ open: isLangOpen }"
        @click.stop="isLangOpen = !isLangOpen"
      >
        <div class="pg-custom-select-trigger">
          <img
            :src="
              currentLang === 'es'
                ? 'https://flagcdn.com/w20/es.png'
                : 'https://flagcdn.com/w20/gb.png'
            "
            alt="Flag"
          />
          {{ currentLang === 'es' ? 'Español' : 'English' }}
        </div>
        <div class="pg-custom-options">
          <a :href="getBase('/')" class="pg-custom-option" @click.stop>
            <img src="https://flagcdn.com/w20/gb.png" alt="" /> English
          </a>
          <a :href="getBase('/es/')" class="pg-custom-option" @click.stop>
            <img src="https://flagcdn.com/w20/es.png" alt="" /> Español
          </a>
        </div>
      </div>
      <button class="pg-icon-btn" @click.stop="toggleAppTheme" title="Toggle theme">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      </button>
    </div>

    <div class="pg-layout">
      <!-- SIDEBAR -->
      <aside class="pg-sidebar" @click.stop>
        <div class="pg-logo">
          <div class="pg-logo-icon"></div>
          Oura.js
        </div>
        <p class="pg-logo-sub">v1.3.0 "Glass Edition" · UI Engine</p>

        <div class="pg-section-title">{{ t('section_pos') }}</div>
        <div class="pg-pos-grid">
          <button
            v-for="p in positions"
            :key="p.key"
            class="pg-pos-btn"
            :class="{ active: activePos === p.key }"
            @click="setPos(p.key)"
          >
            {{ p.label }}
          </button>
        </div>

        <div class="pg-section-title">{{ t('section_layouts') }}</div>
        <div class="pg-grid-controls">
          <button class="pg-btn" @click="triggerDrawer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="15" y1="3" x2="15" y2="21" />
            </svg>
            <span>{{ t('btn_drawer') }}</span>
          </button>
          <button class="pg-btn" @click="triggerConfirm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span>{{ t('btn_confirm') }}</span>
          </button>
          <button class="pg-btn" @click="triggerPrompt">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>{{ t('btn_prompt') }}</span>
          </button>
          <button class="pg-btn" @click="triggerStack">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span>{{ t('btn_stack') }}</span>
          </button>
        </div>

        <div class="pg-section-title">{{ t('section_async') }}</div>
        <div class="pg-grid-controls">
          <button class="pg-btn" @click="triggerPromise">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            <span>{{ t('btn_promise') }}</span>
          </button>
          <button class="pg-btn" @click="triggerAsync">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{{ t('btn_async') }}</span>
          </button>
        </div>

        <div class="pg-section-title">{{ t('section_theme') }}</div>
        <div class="pg-theme-strip">
          <button class="pg-btn" @click="setTheme('light-glass')">{{ t('btn_light') }}</button>
          <button class="pg-btn" @click="setTheme('dark-glass')">{{ t('btn_dark') }}</button>
          <button class="pg-btn" @click="setTheme('system')">{{ t('btn_system') }}</button>
        </div>
      </aside>

      <!-- MAIN -->
      <main class="pg-main">
        <div class="pg-hero">
          <h1>{{ t('hero_title') }}</h1>
          <p>{{ t('hero_desc') }}</p>
        </div>

        <div class="pg-glass-card">
          <h2 class="pg-card-title">{{ t('card_code') }}</h2>
          <pre class="pg-code">{{ codeSnippet }}</pre>
        </div>

        <div class="pg-glass-card">
          <h2 class="pg-card-title">{{ t('card_notifications') }}</h2>
          <div class="pg-demo-grid">
            <div class="pg-demo-card" @click="Oura.success('Success!', 'Operation completed.')">
              <div class="pg-demo-icon">✅</div>
              <div class="pg-demo-label">{{ t('demo_success_label') }}</div>
              <div class="pg-demo-sub">Oura.success()</div>
            </div>
            <div class="pg-demo-card" @click="Oura.error('Error!', 'Something went wrong.')">
              <div class="pg-demo-icon">❌</div>
              <div class="pg-demo-label">{{ t('demo_error_label') }}</div>
              <div class="pg-demo-sub">Oura.error()</div>
            </div>
            <div class="pg-demo-card" @click="Oura.warning('Warning', 'Low disk space.')">
              <div class="pg-demo-icon">⚠️</div>
              <div class="pg-demo-label">{{ t('demo_warning_label') }}</div>
              <div class="pg-demo-sub">Oura.warning()</div>
            </div>
            <div class="pg-demo-card" @click="Oura.info('Info', 'Update available.')">
              <div class="pg-demo-icon">ℹ️</div>
              <div class="pg-demo-label">{{ t('demo_info_label') }}</div>
              <div class="pg-demo-sub">Oura.info()</div>
            </div>
            <div
              class="pg-demo-card"
              @click="
                Oura.toast({ title: 'Uploading', type: 'progress', timer: 3000, icon: 'progress' })
              "
            >
              <div class="pg-demo-icon">⏳</div>
              <div class="pg-demo-label">{{ t('demo_progress_label') }}</div>
              <div class="pg-demo-sub">type: 'progress'</div>
            </div>
            <div
              class="pg-demo-card"
              @click="Oura.fire({ title: 'Custom Fire', text: 'Dynamic Modal', icon: 'info' })"
            >
              <div class="pg-demo-icon">🔥</div>
              <div class="pg-demo-label">{{ t('demo_modal_label') }}</div>
              <div class="pg-demo-sub">Oura.fire()</div>
            </div>
          </div>
        </div>

        <div class="pg-glass-card">
          <h2 class="pg-card-title">{{ t('card_features') }}</h2>
          <div class="pg-features-grid">
            <div class="pg-feature-item">
              <div class="pg-feature-emoji">🧊</div>
              <div>
                <div class="pg-feature-title">{{ t('feature_glass_title') }}</div>
                <div class="pg-feature-desc">{{ t('feature_glass_desc') }}</div>
              </div>
            </div>
            <div class="pg-feature-item">
              <div class="pg-feature-emoji">🌗</div>
              <div>
                <div class="pg-feature-title">{{ t('feature_theme_title') }}</div>
                <div class="pg-feature-desc">{{ t('feature_theme_desc') }}</div>
              </div>
            </div>
            <div class="pg-feature-item">
              <div class="pg-feature-emoji">📐</div>
              <div>
                <div class="pg-feature-title">{{ t('feature_pos_title') }}</div>
                <div class="pg-feature-desc">{{ t('feature_pos_desc') }}</div>
              </div>
            </div>
            <div class="pg-feature-item">
              <div class="pg-feature-emoji">🌍</div>
              <div>
                <div class="pg-feature-title">{{ t('feature_i18n_title') }}</div>
                <div class="pg-feature-desc">{{ t('feature_i18n_desc') }}</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.pg-root {
  font-family: 'Inter', system-ui, sans-serif;
  background:
    radial-gradient(circle at 10% 20%, #eff6ff, transparent 40%),
    radial-gradient(circle at 90% 80%, #f5f3ff, transparent 40%), #f8fafc;
  min-height: 100vh;
  color: #1e293b;
  width: 100vw;
  overflow-x: hidden;
  transition:
    background 0.5s ease,
    color 0.5s ease;
}

html.dark .pg-root {
  background:
    radial-gradient(circle at 10% 20%, #1e1b4b, transparent 40%),
    radial-gradient(circle at 90% 80%, #0f172a, transparent 40%), #0f172a;
  color: #e2e8f0;
}

/* TOP BAR */
.pg-top-bar {
  position: fixed;
  top: 20px;
  right: 24px;
  z-index: 1000;
  display: flex;
  gap: 10px;
  align-items: center;
}

.pg-docs-btn {
  width: auto !important;
  margin: 0;
  border-radius: 20px !important;
  padding: 10px 18px !important;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  text-decoration: none;
}
.pg-docs-btn:hover {
  text-decoration: none;
}

.pg-custom-select-wrapper {
  position: relative;
  user-select: none;
}
.pg-custom-select-trigger {
  padding: 10px 18px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}
html.dark .pg-custom-select-trigger {
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(255, 255, 255, 0.12);
  color: #cbd5e1;
}
.pg-custom-select-trigger:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
}
html.dark .pg-custom-select-trigger:hover {
  background: rgba(255, 255, 255, 0.15);
}

.pg-custom-options {
  position: absolute;
  top: 115%;
  right: 0;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: none;
  flex-direction: column;
  min-width: 150px;
}
html.dark .pg-custom-options {
  background: rgba(15, 23, 42, 0.95);
  border-color: rgba(255, 255, 255, 0.1);
}
.pg-custom-select-wrapper.open .pg-custom-options {
  display: flex;
}
.pg-custom-option {
  padding: 10px 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  font-size: 0.9rem;
  text-decoration: none;
  color: inherit;
  transition: background 0.2s;
}
.pg-custom-option:hover {
  background: rgba(59, 130, 246, 0.1);
  text-decoration: none;
}
.pg-custom-select-trigger img,
.pg-custom-option img {
  width: 20px;
  border-radius: 3px;
}

.pg-icon-btn {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(16px);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  color: #475569;
}
html.dark .pg-icon-btn {
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(255, 255, 255, 0.12);
  color: #cbd5e1;
}
.pg-icon-btn:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
}
html.dark .pg-icon-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}
.pg-icon-btn svg {
  width: 18px;
  height: 18px;
}

.pg-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  min-height: 100vh;
}

/* Sidebar */
.pg-sidebar {
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(0, 0, 0, 0.05);
  padding: 30px;
  position: sticky;
  top: 0;
  height: 100vh;
  z-index: 10;
}
html.dark .pg-sidebar {
  background: rgba(15, 23, 42, 0.6);
  border-right-color: rgba(255, 255, 255, 0.08);
}

.pg-logo {
  font-size: 1.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
}
.pg-logo-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 8px;
}
.pg-logo-sub {
  font-size: 0.75rem;
  color: #64748b;
  margin-bottom: 30px;
}

.pg-section-title {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #94a3b8;
  margin: 20px 0 10px;
  font-weight: 700;
}

.pg-grid-controls {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.pg-btn {
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(0, 0, 0, 0.05);
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  color: #334155;
  font-size: 0.75rem;
  width: 100%;
}
html.dark .pg-btn {
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(255, 255, 255, 0.12);
  color: #cbd5e1;
}
.pg-btn:hover {
  background: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
html.dark .pg-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}
.pg-btn svg {
  width: 14px;
  height: 14px;
  opacity: 0.7;
}

.pg-pos-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}
.pg-pos-btn {
  padding: 8px;
  font-size: 0.6rem;
  border: 1px dashed #cbd5e1;
  background: transparent;
  cursor: pointer;
  border-radius: 6px;
  font-weight: 700;
  color: #64748b;
}
.pg-pos-btn.active {
  background: #3b82f6;
  color: white;
  border-style: solid;
}

.pg-theme-strip {
  display: flex;
  gap: 6px;
}
.pg-theme-strip .pg-btn {
  flex: 1;
  justify-content: center;
}

/* Main Content */
.pg-main {
  padding: 50px;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.pg-hero h1 {
  font-size: 2.2rem;
  margin: 0;
}
.pg-hero p {
  color: #64748b;
  margin-top: 5px;
}

.pg-glass-card {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02);
}
html.dark .pg-glass-card {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.08);
}
.pg-card-title {
  font-size: 0.9rem;
  margin-top: 0;
  margin-bottom: 20px;
}

.pg-code {
  background: #1e293b;
  color: #94a3b8;
  padding: 20px;
  border-radius: 12px;
  font-family: 'Fira Code', monospace;
  font-size: 0.8rem;
  margin: 0;
}

.pg-demo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}
.pg-demo-card {
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.8);
  padding: 15px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}
html.dark .pg-demo-card {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}
.pg-demo-card:hover {
  transform: translateY(-3px);
  background: white;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
}
html.dark .pg-demo-card:hover {
  background: rgba(255, 255, 255, 0.1);
}
.pg-demo-icon {
  font-size: 1.5rem;
  margin-bottom: 8px;
}
.pg-demo-label {
  font-weight: 700;
  font-size: 0.85rem;
}
.pg-demo-sub {
  font-size: 0.7rem;
  color: #94a3b8;
}

.pg-features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}
.pg-feature-item {
  display: flex;
  gap: 12px;
  background: rgba(255, 255, 255, 0.4);
  padding: 15px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.6);
}
html.dark .pg-feature-item {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.08);
}
.pg-feature-emoji {
  font-size: 1.2rem;
}
.pg-feature-title {
  font-weight: 700;
  font-size: 0.8rem;
}
.pg-feature-desc {
  font-size: 0.75rem;
  color: #64748b;
  line-height: 1.4;
}
</style>

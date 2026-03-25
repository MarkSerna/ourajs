<script setup>
import { onMounted, ref, shallowRef } from 'vue';

const Oura = shallowRef(null);
let currentTheme = ref('light-glass');

onMounted(async () => {
  const module = await import('../../src/index.ts');
  Oura.value = module.default;
});

// ── Theme ──
function setTheme(t) {
  if (!Oura.value) return;
  currentTheme.value = t;
  Oura.value.configure({ theme: t });
}

// ── Position ──
const activePos = ref('top-right');
function setPos(pos) {
  if (!Oura.value) return;
  activePos.value = pos;
  Oura.value.configure({ position: pos });
  Oura.value.toast({ title: 'Position Updated', text: `Aligned to ${pos}`, icon: 'success' });
}

// ── Demos ──
function triggerDrawer() {
  if (!Oura.value) return;
  Oura.value
    .drawer({
      title: 'User Preferences',
      html: `<div style="display:flex;flex-direction:column;gap:20px;">
      <p>Change your global application settings here.</p>
      <div style="display:flex;align-items:center;gap:10px;">
        <input type="checkbox" id="check1" checked> <label for="check1">Enable Notifications</label>
      </div>
      <div style="display:flex;align-items:center;gap:10px;">
        <input type="checkbox" id="check2"> <label for="check2">Beta Features</label>
      </div>
    </div>`,
      side: 'right',
      confirmButtonText: 'Save Settings',
      width: '450px',
    })
    .then((r) => {
      if (r.isConfirmed) Oura.value.success('Settings Saved');
    });
}

function triggerPromise() {
  if (!Oura.value) return;
  const p = new Promise((resolve, reject) => {
    setTimeout(
      () => (Math.random() > 0.3 ? resolve('v1.3.0 Payload') : reject('Timeout 404')),
      2000
    );
  });
  Oura.value.promise(p, {
    loading: 'Fetching Data...',
    success: (d) => `Received: ${d}`,
    error: (e) => `Error: ${e}`,
  });
}

async function triggerAsync() {
  if (!Oura.value) return;
  const res = await Oura.value.prompt({
    title: 'Authentication',
    text: 'Enter "unlock" to proceed',
    preConfirm: async (val) => {
      await new Promise((r) => setTimeout(r, 1000));
      if (val !== 'unlock') throw new Error('Invalid Code');
    },
  });
  if (res.isConfirmed) Oura.value.success('Access Granted');
}

function triggerStack() {
  if (!Oura.value) return;
  const msgs = [
    'System Initialized',
    'Checking Records',
    'Compiling Assets',
    'Deploying Grid',
    'Done!',
  ];
  msgs.forEach((m, i) => {
    setTimeout(() => {
      Oura.value.toast({ title: m, icon: i === 4 ? 'success' : 'info' });
    }, i * 150);
  });
}

function triggerDropdown(e) {
  if (!Oura.value) return;
  const btn = e.currentTarget;
  Oura.value.dropdown(btn, {
    placement: 'bottom-start',
    items: [
      {
        label: 'Edit Profile',
        icon: '✏️',
        shortcut: '⌘E',
        onClick: () => Oura.value.info('Edit clicked'),
      },
      { label: 'Settings', icon: '⚙️', onClick: () => Oura.value.info('Settings') },
      { separator: true },
      {
        label: 'Logout',
        icon: '🚪',
        danger: true,
        onClick: () => Oura.value.warning('Logged out'),
      },
    ],
  });
}

function triggerAlert() {
  if (!Oura.value) return;
  const variants = ['success', 'warning', 'error', 'info'];
  const v = variants[Math.floor(Math.random() * variants.length)];
  const msgs = {
    success: 'Changes saved!',
    warning: 'Disk almost full.',
    error: 'Connection lost.',
    info: 'New update available.',
  };
  Oura.value.alert({
    title: v.charAt(0).toUpperCase() + v.slice(1),
    description: msgs[v],
    variant: v,
    container: '.pg-alerts-area',
  });
}

function triggerSkeleton() {
  if (!Oura.value) return;
  const area = document.querySelector('.pg-skeleton-area');
  if (area) area.innerHTML = '';
  const el = Oura.value.skeleton({
    variant: 'text',
    count: 3,
    width: '100%',
    container: '.pg-skeleton-area',
  });
  setTimeout(() => {
    el.remove();
    if (area)
      area.innerHTML =
        '<p style="color:var(--oura-text-muted);font-size:0.85rem;">Content loaded ✓</p>';
  }, 2500);
}

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
  <div class="pg-root">
    <div class="pg-layout">
      <!-- SIDEBAR -->
      <aside class="pg-sidebar">
        <h1 class="pg-logo">
          <div class="pg-logo-icon"></div>
          Oura
        </h1>
        <p class="pg-logo-sub">
          <strong>v1.3.0 "Glass Edition"</strong><br />
          The industry's most versatile glassmorphism component library.
        </p>

        <div class="pg-section-title">Layout &amp; Position</div>
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

        <div class="pg-section-title">Next-Gen Components</div>
        <div class="pg-grid-controls">
          <button class="pg-btn" @click="triggerDrawer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="15" y1="3" x2="15" y2="21" />
            </svg>
            <span>Side Sheet</span>
          </button>
          <button class="pg-btn" @click="triggerPromise">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span>Promises</span>
          </button>
          <button class="pg-btn" @click="triggerAsync">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>Async Validate</span>
          </button>
          <button class="pg-btn" @click="triggerStack">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span>3D Stack</span>
          </button>
        </div>

        <div class="pg-section-title">New Components</div>
        <div class="pg-grid-controls">
          <button class="pg-btn" @click="triggerDropdown($event)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
            <span>Dropdown</span>
          </button>
          <button class="pg-btn" @click="triggerAlert">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path
                d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
              />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span>Alert</span>
          </button>
          <button class="pg-btn" @click="triggerSkeleton">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="3" y1="15" x2="21" y2="15" />
            </svg>
            <span>Skeleton</span>
          </button>
        </div>

        <div class="pg-section-title">Theme Control</div>
        <div class="pg-grid-controls">
          <button class="pg-btn" @click="setTheme('light-glass')">Light</button>
          <button class="pg-btn" @click="setTheme('dark-glass')">Dark</button>
          <button class="pg-btn" @click="setTheme('system')">System Sync</button>
        </div>
      </aside>

      <!-- MAIN -->
      <main class="pg-main">
        <div class="pg-glass-card">
          <h2 class="pg-card-title">Live Integration</h2>
          <pre class="pg-code">
Oura.configure({
  position: '{{ activePos }}',
  theme: 'system'
});

Oura.dropdown('#menu', {
  items: [
    { label: 'Edit', icon: '✏️' },
    { label: 'Delete', danger: true }
  ]
});</pre
          >
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px">
          <div class="pg-glass-card">
            <h3 style="margin-top: 0">Inline Alerts</h3>
            <div
              class="pg-alerts-area"
              style="display: flex; flex-direction: column; gap: 10px"
            ></div>
            <p v-if="!alertsShown" class="pg-engine-desc" style="margin: 0">
              Click "Alert" in the sidebar to see inline alerts here.
            </p>
          </div>
          <div class="pg-glass-card">
            <h3 style="margin-top: 0">Skeleton Loader</h3>
            <div class="pg-skeleton-area" style="min-height: 60px"></div>
            <p class="pg-engine-desc" style="margin: 0">
              Click "Skeleton" to preview loading states.
            </p>
          </div>
        </div>

        <div class="pg-glass-card">
          <h3 style="margin-top: 0">v1.3.0 Engine</h3>
          <p class="pg-engine-desc">
            - <strong>7 New Components</strong>: Tooltip, Popover, Dropdown, Context Menu, Alert,
            Skeleton, Hover Card.<br />
            - <strong>Universal Positioning</strong>: 6-way anchor system.<br />
            - <strong>Auto-Theme</strong>: Native OS light/dark detection.
          </p>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.pg-root {
  font-family:
    'Inter',
    system-ui,
    -apple-system,
    sans-serif;
  background:
    radial-gradient(circle at 10% 20%, #eff6ff, transparent 40%),
    radial-gradient(circle at 90% 80%, #f5f3ff, transparent 40%),
    radial-gradient(circle at 40% 60%, #e0f2fe, transparent 50%),
    radial-gradient(circle at 80% 20%, #fce7f3, transparent 40%), #f8fafc;
  min-height: 100vh;
  color: #1e293b;
  transition: all 0.5s ease;
}

/* Layout */
.pg-layout {
  display: grid;
  grid-template-columns: 350px 1fr;
  min-height: 100vh;
}

/* Sidebar */
.pg-sidebar {
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(30px);
  border-right: 1px solid rgba(255, 255, 255, 0.5);
  padding: 40px;
  overflow-y: auto;
  position: sticky;
  top: 0;
  height: 100vh;
  box-sizing: border-box;
}

.pg-logo {
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -0.05em;
  margin: 0 0 24px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.pg-logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
}
.pg-logo-sub {
  font-size: 0.9rem;
  color: #64748b;
  line-height: 1.6;
}

.pg-section-title {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #64748b;
  margin: 24px 0 12px;
  font-weight: 700;
}

.pg-grid-controls {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.pg-btn {
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.8);
  padding: 12px;
  border-radius: 14px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  color: #334155;
  font-size: 0.85rem;
  font-family: inherit;
}
.pg-btn:hover {
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
}
.pg-btn svg {
  width: 18px;
  height: 18px;
  opacity: 0.7;
}

/* Position Grid */
.pg-pos-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 20px;
}
.pg-pos-btn {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  border: 2px dashed rgba(0, 0, 0, 0.1);
  background: transparent;
  cursor: pointer;
  border-radius: 10px;
  transition: all 0.2s;
  font-family: inherit;
  font-weight: 600;
  color: #64748b;
}
.pg-pos-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}
.pg-pos-btn.active {
  background: rgba(59, 130, 246, 0.1);
  border-color: #3b82f6;
  color: #3b82f6;
  font-weight: bold;
}

/* Main */
.pg-main {
  padding: 60px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.pg-glass-card {
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.03);
}
.pg-card-title {
  margin: 0 0 12px;
  font-weight: 700;
}

.pg-code {
  background: #1e293b;
  border-radius: 16px;
  padding: 24px;
  color: #94a3b8;
  font-family: 'Fira Code', 'Courier New', monospace;
  font-size: 0.85rem;
  line-height: 1.6;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2);
  white-space: pre;
  overflow-x: auto;
  margin: 0;
}

.pg-engine-desc {
  font-size: 0.9rem;
  color: #64748b;
}
</style>

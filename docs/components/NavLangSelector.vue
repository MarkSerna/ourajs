<script setup>
import { onMounted, ref, shallowRef, watch, computed } from 'vue';
import { useRouter, useData } from 'vitepress';

const { lang, page } = useData();
const router = useRouter();
const Oura = shallowRef(null);
const langOpen = ref(false);

// Only show flags for locales configured in VitePress
const langs = [
  { code: 'en', label: 'English', flag: 'gb' },
  { code: 'es', label: 'Español', flag: 'es' },
];

const currentLang = computed(() => {
  // VitePress lang is e.g. 'en-US' or 'es', so check startsWith
  const code = (lang.value || 'en').startsWith('es') ? 'es' : 'en';
  return langs.find((l) => l.code === code) ?? langs[0];
});

onMounted(async () => {
  const module = await import('../../src/index.ts');
  Oura.value = module.default;
  if (Oura.value) Oura.value.configure({ locale: currentLang.value.code });
  document.addEventListener('click', () => {
    langOpen.value = false;
  });
});

watch(lang, (newLang) => {
  const code = newLang.startsWith('es') ? 'es' : 'en';
  if (Oura.value) Oura.value.configure({ locale: code });
});

function getTargetPath(targetCode) {
  // page.value.relativePath is something like:
  //   'guide/toasts.md'       => English (root)
  //   'es/guide/toasts.md'    => Spanish
  const rel = page.value.relativePath
    .replace(/\.md$/, '') // remove .md extension
    .replace(/\/index$/, ''); // remove trailing /index

  const base = '/ourajs/';

  if (targetCode === 'es') {
    // Going TO Spanish
    if (rel.startsWith('es/')) {
      // Already in Spanish, stay on current page
      return base + rel;
    }
    // Switch English → Spanish: prepend /es/
    return base + 'es/' + (rel === '' ? '' : rel);
  } else {
    // Going TO English
    if (rel.startsWith('es/')) {
      // Switch Spanish → English: strip leading es/
      const enRel = rel.replace(/^es\//, '');
      return base + enRel;
    }
    // Already English, stay on current page
    return base + rel;
  }
}

function selectLang(targetLang) {
  if (targetLang.code === currentLang.value.code) {
    langOpen.value = false;
    return;
  }
  langOpen.value = false;

  if (Oura.value) {
    Oura.value.configure({ locale: targetLang.code });
    Oura.value.toast({
      title: targetLang.code === 'es' ? 'Idioma actualizado ✓' : 'Language updated ✓',
      icon: 'success',
    });
  }

  const targetPath = getTargetPath(targetLang.code);
  router.go(targetPath);
}
</script>

<template>
  <div class="nav-lang-wrapper" @click.stop>
    <button class="nav-lang-trigger" @click="langOpen = !langOpen">
      <img :src="`https://flagcdn.com/w20/${currentLang.flag}.png`" :alt="currentLang.label" />
      <span class="nav-lang-label">{{ currentLang.label }}</span>
      <svg width="10" height="10" viewBox="0 0 10 10" class="chevron" :class="{ open: langOpen }">
        <path
          d="M1 3L5 7L9 3"
          stroke="currentColor"
          stroke-width="1.5"
          fill="none"
          stroke-linecap="round"
        />
      </svg>
    </button>
    <transition name="lang-dropdown">
      <div class="nav-lang-options" v-if="langOpen">
        <div
          class="nav-lang-option"
          v-for="l in langs"
          :key="l.code"
          :class="{ active: l.code === currentLang.code }"
          @click="selectLang(l)"
        >
          <img :src="`https://flagcdn.com/w20/${l.flag}.png`" :alt="l.label" />
          {{ l.label }}
          <svg
            v-if="l.code === currentLang.code"
            class="check"
            viewBox="0 0 16 16"
            width="14"
            height="14"
          >
            <path
              d="M2 8l4 4 8-8"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
            />
          </svg>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.nav-lang-wrapper {
  position: relative;
  user-select: none;
  margin-left: 8px;
}

.nav-lang-trigger {
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-soft);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--vp-c-text-1);
  font-family: inherit;
}

.nav-lang-trigger:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-elv);
}

.nav-lang-trigger img {
  width: 18px;
  border-radius: 2px;
}

.chevron {
  transition: transform 0.2s ease;
  opacity: 0.6;
}

.chevron.open {
  transform: rotate(180deg);
}

.nav-lang-options {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-width: 150px;
  z-index: 100;
}

.nav-lang-option {
  padding: 10px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  font-size: 0.85rem;
  transition: background 0.15s;
  color: var(--vp-c-text-1);
}

.nav-lang-option:hover {
  background: var(--vp-c-brand-soft);
}

.nav-lang-option.active {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.nav-lang-option img {
  width: 18px;
  border-radius: 2px;
}

.check {
  margin-left: auto;
  color: var(--vp-c-brand-1);
}

/* Dropdown animation */
.lang-dropdown-enter-active,
.lang-dropdown-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.lang-dropdown-enter-from,
.lang-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.97);
}
</style>

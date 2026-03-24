<script setup>
import { onMounted, shallowRef, watch } from 'vue'
import { useData } from 'vitepress'

const { lang } = useData()
const Oura = shallowRef(null)

function getLangCode(vitepressLang) {
  return (vitepressLang || 'en').startsWith('es') ? 'es' : 'en'
}

onMounted(async () => {
  const module = await import('../../src/index.ts')
  Oura.value = module.default
  if (Oura.value) {
    Oura.value.configure({ locale: getLangCode(lang.value) })
  }
})

watch(lang, (newLang) => {
  if (Oura.value) {
    Oura.value.configure({ locale: getLangCode(newLang) })
  }
})
</script>

<template>
  <!-- no UI: only syncs Oura locale with VitePress language -->
</template>

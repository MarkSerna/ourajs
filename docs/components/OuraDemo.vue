<script setup>
import { onMounted, shallowRef } from 'vue';

const props = defineProps({
  label: { type: String, default: 'Try it' },
  variant: { type: String, default: 'primary' }, // primary | outline
  fn: { type: Function, required: true },
});

const Oura = shallowRef(null);

onMounted(async () => {
  // In VitePress, we import from the source to ensure latest features
  const module = await import('../../src/index.ts');
  Oura.value = module.default;
});

const handleClick = (e) => {
  if (Oura.value) {
    props.fn(Oura.value, e.currentTarget);
  }
};
</script>

<template>
  <button class="oura-demo-btn" :class="variant" @click="handleClick">
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      width="16"
      height="16"
    >
      <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>
    <span>{{ label }}</span>
  </button>
</template>

<style scoped>
.oura-demo-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
  font-family: var(--vp-font-family-base);
  margin: 10px 0;
}

.oura-demo-btn.primary {
  background: var(--vp-c-brand);
  color: white;
}

.oura-demo-btn.primary:hover {
  background: var(--vp-c-brand-next);
  transform: translateY(-1px);
}

.oura-demo-btn.outline {
  background: transparent;
  border-color: var(--vp-c-divider);
  color: var(--vp-c-text-1);
}

.oura-demo-btn.outline:hover {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
}

.oura-demo-btn svg {
  flex-shrink: 0;
}
</style>

import { SkeletonOptions } from '../types';
import { OuraCore } from '../core/OuraCore';

export function skeleton(core: OuraCore, options: SkeletonOptions = {}): HTMLElement {
  const count = options.count || 1;
  const wrapper = document.createElement('div');
  wrapper.style.display = 'flex';
  wrapper.style.flexDirection = 'column';
  wrapper.style.gap = '12px';

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'oura-skeleton';
    if (options.variant === 'circular') el.classList.add('oura-skeleton-circular');
    else if (options.variant === 'text') el.classList.add('oura-skeleton-text');
    el.style.width = options.width || (options.variant === 'circular' ? '48px' : '100%');
    el.style.height =
      options.height ||
      (options.variant === 'circular' ? '48px' : options.variant === 'text' ? '16px' : '80px');
    wrapper.appendChild(el);
  }

  const container =
    typeof options.container === 'string'
      ? document.querySelector(options.container)
      : options.container;
  (container || document.body).appendChild(wrapper);
  return wrapper;
}

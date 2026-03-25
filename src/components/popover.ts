import { PopoverOptions } from '../types';
import { OuraCore } from '../core/OuraCore';

export function popover(core: OuraCore, target: string | HTMLElement, options: PopoverOptions): () => void {
  if (typeof document === 'undefined') return () => {};
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return () => {};

  const popoverEl = document.createElement('div');
  popoverEl.className = 'oura-popover';
  core._applyThemeToElement(popoverEl);
  popoverEl.id = `popover-${Date.now().toString(36)}`;
  let html = '';
  if (options.title) html += `<div class="oura-popover-header">${options.title}</div>`;
  html += `<div class="oura-popover-body">${options.html}</div>`;
  html += `<button class="oura-popover-close" aria-label="Close">&times;</button>`;
  popoverEl.innerHTML = html;
  document.body.appendChild(popoverEl);

  let open = false;
  const placement = options.placement || 'bottom';

  const position = () => {
    const rect = el.getBoundingClientRect();
    const pRect = popoverEl.getBoundingClientRect();
    let top: number;
    let left: number;
    if (placement === 'bottom') {
      top = rect.bottom + 8;
      left = rect.left + rect.width / 2 - pRect.width / 2;
    } else if (placement === 'top') {
      top = rect.top - pRect.height - 8;
      left = rect.left + rect.width / 2 - pRect.width / 2;
    } else if (placement === 'left') {
      top = rect.top + rect.height / 2 - pRect.height / 2;
      left = rect.left - pRect.width - 8;
    } else {
      top = rect.top + rect.height / 2 - pRect.height / 2;
      left = rect.right + 8;
    }
    popoverEl.style.top = `${Math.max(8, top)}px`;
    popoverEl.style.left = `${Math.max(8, left)}px`;
  };

  const toggle = (e: Event) => {
    e.stopPropagation();
    open = !open;
    if (open) {
      position();
      requestAnimationFrame(() => popoverEl.classList.add('oura-show'));
    } else {
      popoverEl.classList.remove('oura-show');
    }
  };

  const outsideClick = (e: Event) => {
    if (
      open &&
      options.closeOnClickOutside !== false &&
      !popoverEl.contains(e.target as Node) &&
      !el.contains(e.target as Node)
    ) {
      open = false;
      popoverEl.classList.remove('oura-show');
    }
  };

  el.addEventListener('click', toggle);
  document.addEventListener('click', outsideClick);
  popoverEl.querySelector('.oura-popover-close')?.addEventListener('click', () => {
    open = false;
    popoverEl.classList.remove('oura-show');
  });

  return () => {
    el.removeEventListener('click', toggle);
    document.removeEventListener('click', outsideClick);
    popoverEl.remove();
  };
}

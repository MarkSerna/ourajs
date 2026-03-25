import { HoverCardOptions } from '../types';
import { OuraCore } from '../core/OuraCore';

export function hoverCard(core: OuraCore, target: string | HTMLElement, options: HoverCardOptions): () => void {
  if (typeof document === 'undefined') return () => {};
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return () => {};

  const card = document.createElement('div');
  card.className = 'oura-hover-card';
  core._applyThemeToElement(card);
  card.innerHTML = options.html;
  document.body.appendChild(card);

  const openDelay = options.openDelay ?? 300;
  const closeDelay = options.closeDelay ?? 200;
  const placement = options.placement || 'bottom';
  let openTimer: ReturnType<typeof setTimeout>;
  let closeTimer: ReturnType<typeof setTimeout>;

  const position = () => {
    const rect = el.getBoundingClientRect();
    const cRect = card.getBoundingClientRect();
    const left = rect.left + rect.width / 2 - cRect.width / 2;
    let top: number;
    if (placement === 'bottom') top = rect.bottom + 10;
    else top = rect.top - cRect.height - 10;
    card.style.top = `${Math.max(8, top)}px`;
    card.style.left = `${Math.max(8, left)}px`;
  };

  const show = () => {
    clearTimeout(closeTimer);
    openTimer = setTimeout(() => {
      position();
      card.classList.add('oura-show');
    }, openDelay);
  };
  const hide = () => {
    clearTimeout(openTimer);
    closeTimer = setTimeout(() => {
      card.classList.remove('oura-show');
    }, closeDelay);
  };

  el.addEventListener('mouseenter', show);
  el.addEventListener('mouseleave', hide);
  card.addEventListener('mouseenter', () => clearTimeout(closeTimer));
  card.addEventListener('mouseleave', hide);

  return () => {
    el.removeEventListener('mouseenter', show);
    el.removeEventListener('mouseleave', hide);
    card.remove();
  };
}

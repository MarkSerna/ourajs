import { TooltipOptions } from '../types';
import { OuraCore } from '../core/OuraCore';

export function tooltip(core: OuraCore, target: string | HTMLElement, options: TooltipOptions): () => void {
  if (typeof document === 'undefined') return () => {};
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return () => {};

  const tooltipEl = document.createElement('div');
  tooltipEl.className = 'oura-tooltip';
  core._applyThemeToElement(tooltipEl);
  tooltipEl.innerHTML = typeof options === 'string' ? options : options.content;
  document.body.appendChild(tooltipEl);

  const placement = typeof options === 'string' ? 'top' : (options.placement || 'top');
  const delay = typeof options === 'string' ? 200 : (options.delay ?? 200);
  let timeout: ReturnType<typeof setTimeout>;

  const show = () => {
    timeout = setTimeout(() => {
      const rect = el.getBoundingClientRect();
      const tRect = tooltipEl.getBoundingClientRect();
      let top: number;
      let left: number;
      if (placement === 'top') {
        top = rect.top - tRect.height - 8;
        left = rect.left + rect.width / 2 - tRect.width / 2;
      } else if (placement === 'bottom') {
        top = rect.bottom + 8;
        left = rect.left + rect.width / 2 - tRect.width / 2;
      } else if (placement === 'left') {
        top = rect.top + rect.height / 2 - tRect.height / 2;
        left = rect.left - tRect.width - 8;
      } else {
        top = rect.top + rect.height / 2 - tRect.height / 2;
        left = rect.right + 8;
      }
      tooltipEl.style.top = `${top}px`;
      tooltipEl.style.left = `${left}px`;
      tooltipEl.classList.add('oura-show');
    }, delay);
  };
  const hide = () => {
    clearTimeout(timeout);
    tooltipEl.classList.remove('oura-show');
  };

  el.addEventListener('mouseenter', show);
  el.addEventListener('mouseleave', hide);
  el.addEventListener('focus', show);
  el.addEventListener('blur', hide);

  return () => {
    el.removeEventListener('mouseenter', show);
    el.removeEventListener('mouseleave', hide);
    el.removeEventListener('focus', show);
    el.removeEventListener('blur', hide);
    tooltipEl.remove();
  };
}

import { DropdownOptions } from '../types';
import { OuraCore } from '../core/OuraCore';

export function dropdown(core: OuraCore, target: string | HTMLElement, options: DropdownOptions): () => void {
  if (typeof document === 'undefined') return () => {};
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return () => {};

  const menu = document.createElement('div');
  menu.className = 'oura-dropdown';
  core._applyThemeToElement(menu);
  menu.id = `dropdown-${Date.now().toString(36)}`;
  menu.setAttribute('role', 'menu');

  options.items.forEach((item) => {
    if (item.separator) {
      const sep = document.createElement('div');
      sep.className = 'oura-dropdown-separator';
      menu.appendChild(sep);
      return;
    }
    const btn = document.createElement('button');
    btn.className = 'oura-dropdown-item';
    btn.setAttribute('role', 'menuitem');
    if (item.danger) btn.classList.add('oura-danger');
    if (item.disabled) btn.classList.add('oura-disabled');

    let inner = '';
    if (item.icon) inner += `<span class="oura-dropdown-item-icon">${item.icon}</span>`;
    inner += `<span>${item.label}</span>`;
    if (item.shortcut) inner += `<span class="oura-dropdown-shortcut">${item.shortcut}</span>`;
    btn.innerHTML = inner;

    btn.addEventListener('click', () => {
      menu.classList.remove('oura-show');
      if (item.onClick) item.onClick();
    });
    menu.appendChild(btn);
  });

  document.body.appendChild(menu);
  let open = false;
  const placement = options.placement || 'bottom-start';

  const toggle = (e: Event) => {
    e.stopPropagation();
    open = !open;
    if (open) {
      const rect = el.getBoundingClientRect();
      if (placement === 'bottom-start') {
        menu.style.top = `${rect.bottom + 4}px`;
        menu.style.left = `${rect.left}px`;
      } else if (placement === 'bottom-end') {
        menu.style.top = `${rect.bottom + 4}px`;
        menu.style.right = `${window.innerWidth - rect.right}px`;
      } else if (placement === 'top-start') {
        menu.style.bottom = `${window.innerHeight - rect.top + 4}px`;
        menu.style.left = `${rect.left}px`;
      } else {
        menu.style.bottom = `${window.innerHeight - rect.top + 4}px`;
        menu.style.right = `${window.innerWidth - rect.right}px`;
      }
      requestAnimationFrame(() => menu.classList.add('oura-show'));
    } else {
      menu.classList.remove('oura-show');
    }
  };

  const outsideClick = () => {
    if (open) {
      open = false;
      menu.classList.remove('oura-show');
    }
  };

  const handleKeyboard = (e: KeyboardEvent) => {
    if (!open) return;
    const items = Array.from(
      menu.querySelectorAll<HTMLElement>('.oura-dropdown-item:not(.oura-disabled)')
    );
    if (!items.length) return;
    const current = items.indexOf(document.activeElement as HTMLElement);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      items[(current + 1) % items.length].focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      items[(current - 1 + items.length) % items.length].focus();
    } else if (e.key === 'Enter' && current >= 0) {
      e.preventDefault();
      (items[current] as HTMLButtonElement).click();
    } else if (e.key === 'Escape') {
      open = false;
      menu.classList.remove('oura-show');
      el.focus();
    }
  };

  el.addEventListener('click', toggle);
  document.addEventListener('click', outsideClick);
  document.addEventListener('keydown', handleKeyboard);

  return () => {
    el.removeEventListener('click', toggle);
    document.removeEventListener('click', outsideClick);
    document.removeEventListener('keydown', handleKeyboard);
    menu.remove();
  };
}

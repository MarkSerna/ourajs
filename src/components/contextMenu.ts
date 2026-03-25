import { DropdownItem } from '../types';
import { OuraCore } from '../core/OuraCore';

export function contextMenu(core: OuraCore, target: string | HTMLElement, items: DropdownItem[]): () => void {
  if (typeof document === 'undefined') return () => {};
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return () => {};

  const menu = document.createElement('div');
  menu.className = 'oura-context-menu';
  core._applyThemeToElement(menu);
  menu.id = `context-${Date.now().toString(36)}`;
  menu.setAttribute('role', 'menu');

  items.forEach((item) => {
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

  const onContext = (e: MouseEvent) => {
    e.preventDefault();
    menu.style.top = `${e.clientY}px`;
    menu.style.left = `${e.clientX}px`;
    requestAnimationFrame(() => {
      menu.classList.add('oura-show');
      const firstItem = menu.querySelector<HTMLElement>(
        '.oura-dropdown-item:not(.oura-disabled)'
      );
      if (firstItem) firstItem.focus();
    });
  };

  const close = () => menu.classList.remove('oura-show');

  const handleKeyboard = (e: KeyboardEvent) => {
    if (!menu.classList.contains('oura-show')) return;
    const itemElements = Array.from(
      menu.querySelectorAll<HTMLElement>('.oura-dropdown-item:not(.oura-disabled)')
    );
    if (!itemElements.length) return;
    const current = itemElements.indexOf(document.activeElement as HTMLElement);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      itemElements[(current + 1) % itemElements.length].focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      itemElements[(current - 1 + itemElements.length) % itemElements.length].focus();
    } else if (e.key === 'Enter' && current >= 0) {
      e.preventDefault();
      (itemElements[current] as HTMLButtonElement).click();
    } else if (e.key === 'Escape') {
      close();
    }
  };

  el.addEventListener('contextmenu', onContext);
  document.addEventListener('click', close);
  document.addEventListener('keydown', handleKeyboard);
  document.addEventListener('contextmenu', (e) => {
    if (!el.contains(e.target as Node)) close();
  });

  return () => {
    el.removeEventListener('contextmenu', onContext);
    document.removeEventListener('click', close);
    document.removeEventListener('keydown', handleKeyboard);
    menu.remove();
  };
}

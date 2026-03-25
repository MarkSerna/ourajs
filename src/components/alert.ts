import { AlertOptions } from '../types';
import { ICONS } from '../icons';
import { OuraCore } from '../core/OuraCore';

export function alert(core: OuraCore, options: AlertOptions): HTMLElement {
  const alertEl = document.createElement('div');
  alertEl.className = `oura-alert oura-alert-${options.variant || 'info'}`;
  core._applyThemeToElement(alertEl);
  const variant = options.variant || 'default';
  if (variant !== 'default') alertEl.classList.add(`oura-alert-${variant}`);
  alertEl.setAttribute('role', 'alert');

  const iconMap: Record<string, string> = {
    success: ICONS.success,
    error: ICONS.error,
    warning: ICONS.warning,
    info: ICONS.info,
  };

  let inner = '';
  if (iconMap[variant]) inner += `<div class="oura-alert-icon">${iconMap[variant]}</div>`;
  inner += `<div class="oura-alert-content">`;
  if (options.title) inner += `<div class="oura-alert-title">${options.title}</div>`;
  inner += `<div class="oura-alert-desc">${options.description}</div></div>`;
  alertEl.innerHTML = inner;

  if (options.dismissible !== false) {
    const dismissBtn = document.createElement('button');
    dismissBtn.type = 'button';
    dismissBtn.className = 'oura-alert-dismiss';
    dismissBtn.setAttribute('aria-label', options.dismissLabel ?? core.getI18n('dismiss'));
    dismissBtn.innerHTML = '&times;';
    dismissBtn.addEventListener('click', () => {
      alertEl.style.opacity = '0';
      alertEl.style.transform = 'translateY(-8px)';
      setTimeout(() => alertEl.remove(), 300);
    });
    alertEl.appendChild(dismissBtn);
  }

  const container =
    typeof options.container === 'string'
      ? document.querySelector(options.container)
      : options.container;
  (container || document.body).appendChild(alertEl);
  return alertEl;
}

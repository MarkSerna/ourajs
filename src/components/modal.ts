import { OuraOptions, OuraResult, ButtonConfig } from '../types';
import { ICONS, MAIN_ICONS } from '../icons';
import { OuraCore, ModalInstance } from '../core/OuraCore';

export function _buildModal(
  core: OuraCore & { activeModals: ModalInstance[] },
  options: OuraOptions,
  buttonsConfig: ButtonConfig[],
  isDrawer: boolean = false
): Promise<OuraResult> {
  return new Promise((resolve) => {
    if (typeof document === 'undefined')
      return resolve({ isConfirmed: false, isDismissed: true, isDenied: false });

    core._lockScroll();

    const previousActiveElement =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const overlay = document.createElement('div');
    overlay.className = 'oura-overlay';
    core._applyThemeToElement(overlay);

    const modal = document.createElement('div');
    const side = options.side || 'right';
    modal.className = isDrawer ? `oura-drawer oura-drawer-${side}` : 'oura-modal';
    if (isDrawer && options.width) modal.style.width = options.width;

    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('tabindex', '-1');

    const uniqueId = `oura-${Date.now().toString(36)}`;

    const contentContainer = isDrawer ? document.createElement('div') : modal;
    if (isDrawer) {
      contentContainer.className = 'oura-drawer-content';
      modal.appendChild(contentContainer);
    }

    if (options.imageUrl) {
      const img = document.createElement('img');
      img.src = options.imageUrl;
      img.alt = options.imageAlt || '';
      img.className = 'oura-image';
      if (options.imageWidth) img.style.width = options.imageWidth;
      contentContainer.appendChild(img);
    }

    if (options.icon && MAIN_ICONS[options.icon]) {
      const iconEl = document.createElement('div');
      iconEl.className = 'oura-icon';
      iconEl.innerHTML = MAIN_ICONS[options.icon];
      contentContainer.appendChild(iconEl);
    } else if (options.icon && ICONS[options.icon]) {
      const iconEl = document.createElement('div');
      iconEl.className = 'oura-icon';
      iconEl.innerHTML = `<div class="oura-main-icon-glass">${ICONS[options.icon]}</div>`;
      contentContainer.appendChild(iconEl);
    } else if (options.icon) {
      const iconEl = document.createElement('div');
      iconEl.className = 'oura-icon';
      iconEl.innerHTML = `<div class="oura-main-icon-glass">${options.icon}</div>`;
      contentContainer.appendChild(iconEl);
    }

    if (options.title) {
      const titleEl = document.createElement('h2');
      titleEl.id = `title-${uniqueId}`;
      titleEl.className = 'oura-title';
      titleEl.innerHTML = options.title;
      contentContainer.appendChild(titleEl);
      modal.setAttribute('aria-labelledby', titleEl.id);
    }

    if (options.text || options.html) {
      const textEl = document.createElement('div');
      textEl.id = `desc-${uniqueId}`;
      textEl.className = 'oura-text';

      if (options.html instanceof HTMLElement) {
        textEl.appendChild(options.html);
      } else {
        textEl.innerHTML = (options.html as string) || options.text || '';
      }

      contentContainer.appendChild(textEl);
      modal.setAttribute('aria-describedby', textEl.id);
    }

    let inputEl: HTMLInputElement | null = null;
    let getInputValue = (): any => (inputEl ? inputEl.value : undefined);

    if (options.input === 'select') {
      const selectEl = document.createElement('select');
      selectEl.className = 'oura-input oura-select';
      const opts = options.inputOptions || {};
      if (Array.isArray(opts)) {
        opts.forEach((opt) => {
          const o = document.createElement('option');
          o.value = opt;
          o.textContent = opt;
          selectEl.appendChild(o);
        });
      } else {
        Object.entries(opts).forEach(([val, label]) => {
          const o = document.createElement('option');
          o.value = val;
          o.textContent = label;
          selectEl.appendChild(o);
        });
      }
      if (options.inputValue) selectEl.value = options.inputValue as string;
      contentContainer.appendChild(selectEl);
      getInputValue = () => selectEl.value;
    } else if (options.input === 'radio' || options.input === 'checkbox') {
      const group = document.createElement('div');
      group.className = options.input === 'radio' ? 'oura-radio-group' : 'oura-checkbox-group';
      const opts = options.inputOptions || {};
      const entries = Array.isArray(opts) ? opts.map((o) => [o, o]) : Object.entries(opts);

      entries.forEach(([val, label]) => {
        const l = document.createElement('label');
        l.className = 'oura-choice-label';
        const i = document.createElement('input');
        i.type = options.input as string;
        i.name = uniqueId;
        i.value = val;
        i.className = 'oura-choice-input';
        if (options.input === 'checkbox' && Array.isArray(options.inputValue)) {
          if (options.inputValue.includes(val)) i.checked = true;
        } else if (options.inputValue === val) {
          i.checked = true;
        }
        l.appendChild(i);
        l.appendChild(document.createTextNode(label));
        group.appendChild(l);
      });
      contentContainer.appendChild(group);
      getInputValue = () => {
        if (options.input === 'radio') {
          const checked = group.querySelector('input:checked') as HTMLInputElement;
          return checked ? checked.value : undefined;
        } else {
          const checked = group.querySelectorAll('input:checked');
          return Array.from(checked).map((c) => (c as HTMLInputElement).value);
        }
      };
    } else if (options.input === 'range') {
      const container = document.createElement('div');
      container.className = 'oura-range-container';
      const valDisp = document.createElement('span');
      valDisp.className = 'oura-range-value';
      const range = document.createElement('input');
      range.type = 'range';
      range.className = 'oura-range-input';
      if (options.inputAttributes) {
        Object.entries(options.inputAttributes).forEach(([k, v]) => range.setAttribute(k, v));
      }
      range.value = (options.inputValue as string) || '50';
      valDisp.textContent = range.value;
      range.addEventListener('input', () => {
        valDisp.textContent = range.value;
      });
      container.appendChild(valDisp);
      container.appendChild(range);
      contentContainer.appendChild(container);
      getInputValue = () => range.value;
    } else if (options.input) {
      inputEl = document.createElement('input');
      inputEl.type =
        options.input === 'number'
          ? 'number'
          : options.input === 'password'
            ? 'password'
            : options.input === 'email'
              ? 'email'
              : 'text';
      inputEl.className = 'oura-input';
      if (options.inputPlaceholder) inputEl.placeholder = options.inputPlaceholder;
      if (options.inputValue) inputEl.value = options.inputValue as string;

      inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          close({
            isConfirmed: true,
            isDismissed: false,
            isDenied: false,
            value: getInputValue(),
          });
        }
      });

      contentContainer.appendChild(inputEl);
    }

    const actions = document.createElement('div');
    actions.className = 'oura-actions';
    const buttonNodes: HTMLButtonElement[] = [];

    buttonsConfig.forEach((btnConfig) => {
      const btn = document.createElement('button');
      btn.className = `oura-btn ${btnConfig.className || ''}`.trim();
      btn.textContent = btnConfig.text;
      btn.addEventListener('click', () => {
        const result: OuraResult = { ...btnConfig.value };
        if (result.isConfirmed) {
          result.value = getInputValue();
        }
        close(result, btn);
      });
      actions.appendChild(btn);
      buttonNodes.push(btn);
    });

    contentContainer.appendChild(actions);

    if (options.footer) {
      const footer = document.createElement('div');
      footer.className = 'oura-footer';
      if (options.footer instanceof HTMLElement) {
        footer.appendChild(options.footer);
      } else {
        footer.innerHTML = options.footer;
      }
      contentContainer.appendChild(footer);
    }

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    const allowOutsideClick = options.allowOutsideClick !== false;
    if (allowOutsideClick) {
      overlay.addEventListener('mousedown', (e) => {
        if (e.target === overlay) close({ isConfirmed: false, isDismissed: true, isDenied: false });
      });
    }

    const trap = core._trapFocus(modal);
    modal.addEventListener('keydown', trap as EventListener);
    if (core.activeModals.length === 0) document.addEventListener('keydown', core.handleEsc);

    let cleanupDrawerTouch: (() => void) | null = null;
    if (isDrawer) {
      let startX = 0;
      let startY = 0;
      let currentDelta = 0;
      let isDragging = false;
      const side = options.side || 'right';
      const touchMoveOpts: AddEventListenerOptions = { passive: true };

      modal.addEventListener(
        'touchstart',
        (e) => {
          startX = e.touches[0].clientX;
          startY = e.touches[0].clientY;
          isDragging = true;
          modal.style.transition = 'none';
        },
        { passive: true }
      );

      const onDrawerTouchMove = (e: Event) => {
        if (!isDragging) return;
        const te = e as TouchEvent;
        const curX = te.touches[0].clientX;
        const curY = te.touches[0].clientY;

        if (side === 'right') currentDelta = Math.max(0, curX - startX);
        else if (side === 'left') currentDelta = Math.min(0, curX - startX);
        else if (side === 'top') currentDelta = Math.min(0, curY - startY);
        else if (side === 'bottom') currentDelta = Math.max(0, curY - startY);

        if (side === 'right' || side === 'left') {
          modal.style.transform = `translateX(${currentDelta}px)`;
        } else {
          modal.style.transform = `translateY(${currentDelta}px)`;
        }

        const dim = side === 'right' || side === 'left' ? modal.offsetWidth : modal.offsetHeight;
        const opacity = 1 - Math.abs(currentDelta) / dim;
        overlay.style.opacity = Math.max(0, opacity).toString();
      };

      const onDrawerTouchEnd = () => {
        if (!isDragging) return;
        isDragging = false;
        modal.style.transition = '';
        const dim = side === 'right' || side === 'left' ? modal.offsetWidth : modal.offsetHeight;
        if (Math.abs(currentDelta) > dim / 3) {
          close({ isConfirmed: false, isDismissed: true, isDenied: false });
        } else {
          modal.style.transform = '';
          overlay.style.opacity = '';
        }
      };

      document.addEventListener('touchmove', onDrawerTouchMove, touchMoveOpts);
      document.addEventListener('touchend', onDrawerTouchEnd);

      cleanupDrawerTouch = () => {
        document.removeEventListener('touchmove', onDrawerTouchMove, touchMoveOpts);
        document.removeEventListener('touchend', onDrawerTouchEnd);
      };
    }

    const modalInstance: ModalInstance = { overlay, modal, close: () => {} };

    const close = async (result: OuraResult, buttonNode?: HTMLButtonElement) => {
      if (result.isConfirmed && options.preConfirm) {
        if (buttonNode) {
          buttonNode.classList.add('oura-btn-loading');
          buttonNode.disabled = true;
        }
        try {
          const preConfirmValue = await options.preConfirm(result.value);
          if (preConfirmValue !== undefined) result.value = preConfirmValue as string;
        } catch (error: unknown) {
          if (buttonNode) {
            buttonNode.classList.remove('oura-btn-loading');
            buttonNode.disabled = false;
          }
          let valMsg = modal.querySelector('.oura-validation-message') as HTMLElement;
          if (!valMsg) {
            valMsg = document.createElement('div');
            valMsg.className = 'oura-validation-message';
            if (inputEl) inputEl.parentNode?.insertBefore(valMsg, inputEl);
            else contentContainer.insertBefore(valMsg, actions);
          }
          valMsg.textContent = error instanceof Error ? error.message : String(error);
          valMsg.classList.remove('oura-show');
          void valMsg.offsetWidth;
          valMsg.classList.add('oura-show');
          return;
        }
      }

      overlay.classList.remove('oura-show');
      modal.classList.remove('oura-show');
      modal.classList.add('oura-closing');
      overlay.classList.add('oura-closing');

      setTimeout(() => {
        cleanupDrawerTouch?.();
        overlay.remove();
        core.activeModals = core.activeModals.filter((m) => m !== modalInstance);
        if (core.activeModals.length === 0) {
          document.removeEventListener('keydown', core.handleEsc);
          core._unlockScroll();
        }
        if (previousActiveElement?.isConnected) {
          previousActiveElement.focus({ preventScroll: true });
        }
        resolve(result);
      }, 300);
    };

    modalInstance.close = close;
    core.activeModals.push(modalInstance);

    void modal.offsetWidth;
    overlay.classList.add('oura-show');
    modal.classList.add('oura-show');

    if (inputEl) {
      inputEl.focus();
    } else if (buttonNodes.length > 0) {
      buttonNodes[buttonNodes.length - 1].focus();
    }
  });
}

export function fire(core: OuraCore, ...args: unknown[]): Promise<OuraResult> {
  const config = core._parseArgs(args, 'success');
  return _buildModal(core as OuraCore & { activeModals: ModalInstance[] }, config, [
    {
      text: config.confirmButtonText || core.getI18n('continue'),
      value: { isConfirmed: true, isDismissed: false, isDenied: false },
    },
  ]);
}

export function confirmModal(core: OuraCore, ...args: unknown[]): Promise<OuraResult> {
  const config: OuraOptions = {
    title: 'Are you sure?',
    text: 'This action cannot be undone.',
    ...core._parseArgs(args, 'warning'),
  };

  const buttons: ButtonConfig[] = [];
  buttons.push({
    text: config.cancelButtonText || core.getI18n('cancel'),
    value: { isConfirmed: false, isDismissed: true, isDenied: false },
    className: 'oura-btn-cancel',
  });

  if (config.showDenyButton) {
    buttons.push({
      text: config.denyButtonText || core.getI18n('deny'),
      value: { isConfirmed: false, isDismissed: false, isDenied: true },
      className: 'oura-btn-deny',
    });
  }

  buttons.push({
    text: config.confirmButtonText || core.getI18n('confirm'),
    value: { isConfirmed: true, isDismissed: false, isDenied: false },
  });

  return _buildModal(core as OuraCore & { activeModals: ModalInstance[] }, config, buttons);
}

export function promptModal(
  core: OuraCore,
  titleOrOptions: string | OuraOptions,
  text?: string,
  inputType: OuraOptions['input'] = 'text'
): Promise<OuraResult> {
  const config: OuraOptions =
    typeof titleOrOptions === 'string'
      ? { title: titleOrOptions, text, input: inputType }
      : { ...titleOrOptions, input: titleOrOptions.input ?? 'text' };

  const buttons: ButtonConfig[] = [];
  buttons.push({
    text: config.cancelButtonText || core.getI18n('cancel'),
    value: { isConfirmed: false, isDismissed: true, isDenied: false },
    className: 'oura-btn-cancel',
  });

  if (config.showDenyButton) {
    buttons.push({
      text: config.denyButtonText || core.getI18n('deny'),
      value: { isConfirmed: false, isDismissed: false, isDenied: true },
      className: 'oura-btn-deny',
    });
  }

  buttons.push({
    text: config.confirmButtonText || core.getI18n('submit'),
    value: { isConfirmed: true, isDismissed: false, isDenied: false },
  });

  return _buildModal(core as OuraCore & { activeModals: ModalInstance[] }, { ...config }, buttons);
}

export function drawerModal(core: OuraCore, options: OuraOptions): Promise<OuraResult> {
  return _buildModal(
    core as OuraCore & { activeModals: ModalInstance[] },
    options,
    [
      {
        text: options.confirmButtonText || core.getI18n('continue'),
        value: { isConfirmed: true, isDismissed: false, isDenied: false },
      },
    ],
    true
  );
}

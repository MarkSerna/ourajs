import {
  OuraOptions,
  OuraConfig,
  OuraResult,
  ButtonConfig,
  TooltipOptions,
  PopoverOptions,
  DropdownOptions,
  DropdownItem,
  AlertOptions,
  SkeletonOptions,
  HoverCardOptions,
  OuraI18nStrings,
  OuraPromiseMessages,
  OuraToastHandle,
} from './types';
import { ICONS, MAIN_ICONS } from './icons';
import { injectStyles } from './styles';

interface ModalInstance {
  overlay: HTMLDivElement;
  modal: HTMLDivElement;
  close: (result: OuraResult) => void;
}

class OuraNotification {
  private static instance: OuraNotification;
  private activeModals: ModalInstance[] = [];
  private originalOverflow: string = '';
  private originalPaddingRight: string = '';

  private locale: string = 'en';
  private i18n: Record<string, OuraI18nStrings> = {
    en: {
      confirm: 'Confirm',
      cancel: 'Cancel',
      submit: 'Submit',
      continue: 'Continue',
      deny: 'Deny',
      dismiss: 'Dismiss',
    },
    es: {
      confirm: 'Confirmar',
      cancel: 'Cancelar',
      submit: 'Enviar',
      continue: 'Continuar',
      deny: 'Denegar',
      dismiss: 'Cerrar',
    },
    fr: {
      confirm: 'Confirmer',
      cancel: 'Annuler',
      submit: 'Soumettre',
      continue: 'Continuer',
      deny: 'Refuser',
      dismiss: 'Fermer',
    },
    de: {
      confirm: 'Bestätigen',
      cancel: 'Abbrechen',
      submit: 'Einreichen',
      continue: 'Weiter',
      deny: 'Ablehnen',
      dismiss: 'Schließen',
    },
    it: {
      confirm: 'Conferma',
      cancel: 'Annulla',
      submit: 'Invia',
      continue: 'Continua',
      deny: 'Rifiuta',
      dismiss: 'Chiudi',
    },
    pt: {
      confirm: 'Confirmar',
      cancel: 'Cancelar',
      submit: 'Enviar',
      continue: 'Continuar',
      deny: 'Recusar',
      dismiss: 'Fechar',
    },
    zh: {
      confirm: '确认',
      cancel: '取消',
      submit: '提交',
      continue: '继续',
      deny: '拒绝',
      dismiss: '关闭',
    },
    ja: {
      confirm: '確認',
      cancel: 'キャンセル',
      submit: '送信',
      continue: '続行',
      deny: '拒否',
      dismiss: '閉じる',
    },
    ru: {
      confirm: 'Подтвердить',
      cancel: 'Отмена',
      submit: 'Отправить',
      continue: 'Продолжить',
      deny: 'Отказать',
      dismiss: 'Закрыть',
    },
    ar: {
      confirm: 'تأكيد',
      cancel: 'إلغاء',
      submit: 'إرسال',
      continue: 'متابعة',
      deny: 'رفض',
      dismiss: 'إغلاق',
    },
  };

  private theme: 'light-glass' | 'dark-glass' | 'system' = 'system';
  private mq: MediaQueryList | null = null;

  private _getEffectiveTheme(): 'light-glass' | 'dark-glass' {
    if (typeof window === 'undefined') return 'light-glass';
    if (this.theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark-glass'
        : 'light-glass';
    }
    return this.theme as 'light-glass' | 'dark-glass';
  }

  private _applyThemeToElement(el: HTMLElement) {
    const effectiveTheme = this._getEffectiveTheme();
    if (effectiveTheme === 'dark-glass') el.classList.add('oura-dark-glass');
    else el.classList.remove('oura-dark-glass');
  }

  private getI18n(key: keyof OuraI18nStrings): string {
    const lang = this.i18n[this.locale] || this.i18n['en'];
    const fromLang = lang[key];
    if (fromLang != null && fromLang !== '') return fromLang;
    const fromEn = this.i18n['en'][key];
    if (fromEn != null && fromEn !== '') return fromEn;
    const fallback: Record<keyof OuraI18nStrings, string> = {
      confirm: 'Confirm',
      cancel: 'Cancel',
      submit: 'Submit',
      continue: 'Continue',
      deny: 'Deny',
      dismiss: 'Dismiss',
    };
    return fallback[key];
  }

  constructor() {
    if (OuraNotification.instance) return OuraNotification.instance;
    OuraNotification.instance = this;
    this.handleEsc = this.handleEsc.bind(this);

    if (typeof document !== 'undefined') {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => injectStyles());
      } else {
        injectStyles();
      }
    }
  }

  public configure(options: OuraConfig = {}): void {
    if (typeof document === 'undefined') return;

    if (options.locale) this.locale = options.locale;
    if (options.customI18n) {
      this.i18n = { ...this.i18n, ...options.customI18n };
    }

    if (options.accent) {
      document.documentElement.style.setProperty('--oura-accent', options.accent);
    }

    if (options.theme) {
      this.theme = options.theme;
    }

    const container = document.getElementById('oura-toast-container');
    if (container) {
      if (options.position) {
        container.className = 'oura-toast-container';
        container.classList.add(`oura-pos-${options.position}`);
      }
      // Apply theme to toast container
      this._applyThemeToElement(container);
    }

    // Update active modals/overlays immediately
    this.activeModals.forEach((m) => this._applyThemeToElement(m.overlay));

    // Handle system theme changes reactively
    if (typeof window !== 'undefined') {
      if (this.mq) this.mq.onchange = null;
      if (this.theme === 'system') {
        this.mq = window.matchMedia('(prefers-color-scheme: dark)');
        this.mq.onchange = () => {
          const c = document.getElementById('oura-toast-container');
          if (c) this._applyThemeToElement(c);
          // Also update active modals/overlays
          this.activeModals.forEach((m) => this._applyThemeToElement(m.overlay));
        };
      }
    }
  }

  private _lockScroll(): void {
    if (typeof document === 'undefined' || typeof window === 'undefined') return;
    if (this.activeModals.length === 0) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      this.originalOverflow = document.body.style.overflow;
      this.originalPaddingRight = document.body.style.paddingRight;

      document.body.style.overflow = 'hidden';
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }
    }
  }

  private _unlockScroll(): void {
    if (typeof document === 'undefined') return;
    if (this.activeModals.length === 0) {
      document.body.style.overflow = this.originalOverflow;
      document.body.style.paddingRight = this.originalPaddingRight;
    }
  }

  private _trapFocus(modal: HTMLElement) {
    const focusable = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return () => {};

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    return (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
  }

  private handleEsc(e: KeyboardEvent): void {
    if (e.key === 'Escape' && this.activeModals.length > 0) {
      const topModal = this.activeModals[this.activeModals.length - 1];
      topModal.close({ isConfirmed: false, isDismissed: true, isDenied: false });
    }
  }

  public close(result?: OuraResult): void {
    if (this.activeModals.length > 0) {
      const topModal = this.activeModals[this.activeModals.length - 1];
      topModal.close(result || { isConfirmed: false, isDismissed: true, isDenied: false });
    }
  }

  private _buildModal(
    options: OuraOptions,
    buttonsConfig: ButtonConfig[],
    isDrawer: boolean = false
  ): Promise<OuraResult> {
    return new Promise((resolve) => {
      if (typeof document === 'undefined')
        return resolve({ isConfirmed: false, isDismissed: true, isDenied: false });

      this._lockScroll();

      const previousActiveElement =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;

      const overlay = document.createElement('div');
      overlay.className = 'oura-overlay';
      this._applyThemeToElement(overlay);

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
        // Custom SVG/HTML icon support
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
        group.className =
          options.input === 'radio' ? 'oura-radio-group' : 'oura-checkbox-group';
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
          Object.entries(options.inputAttributes).forEach(([k, v]) =>
            range.setAttribute(k, v)
          );
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
          if (e.target === overlay)
            close({ isConfirmed: false, isDismissed: true, isDenied: false });
        });
      }

      const trap = this._trapFocus(modal);
      modal.addEventListener('keydown', trap as EventListener);
      if (this.activeModals.length === 0) document.addEventListener('keydown', this.handleEsc);

      // Drawer Swipe Logic
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
            return; // Halt close
          }
        }

        overlay.classList.remove('oura-show');
        modal.classList.remove('oura-show');
        modal.classList.add('oura-closing');
        overlay.classList.add('oura-closing');

        setTimeout(() => {
          cleanupDrawerTouch?.();
          overlay.remove();
          this.activeModals = this.activeModals.filter((m) => m !== modalInstance);
          if (this.activeModals.length === 0) {
            document.removeEventListener('keydown', this.handleEsc);
            this._unlockScroll();
          }
          if (previousActiveElement?.isConnected) {
            previousActiveElement.focus({ preventScroll: true });
          }
          resolve(result);
        }, 300);
      };

      modalInstance.close = close;
      this.activeModals.push(modalInstance);

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

  private _parseArgs(args: unknown[], defaultIcon?: OuraOptions['icon']): OuraOptions {
    if (typeof args[0] === 'string' || typeof args[1] === 'string') {
      return {
        title: (args[0] as string) || '',
        text: (args[1] as string) || '',
        icon: (args[2] as OuraOptions['icon']) || defaultIcon,
      };
    }
    const opts = args[0];
    if (opts && typeof opts === 'object' && !Array.isArray(opts)) {
      return { icon: defaultIcon, ...(opts as OuraOptions) };
    }
    return { icon: defaultIcon };
  }

  public fire(options?: OuraOptions): Promise<OuraResult>;
  public fire(title: string, text?: string, icon?: OuraOptions['icon']): Promise<OuraResult>;
  public fire(...args: unknown[]): Promise<OuraResult> {
    const config = this._parseArgs(args, 'success');
    return this._buildModal(config, [
      {
        text: config.confirmButtonText || this.getI18n('continue'),
        value: { isConfirmed: true, isDismissed: false, isDenied: false },
      },
    ]);
  }

  public confirm(options?: OuraOptions): Promise<OuraResult>;
  public confirm(title: string, text?: string, icon?: OuraOptions['icon']): Promise<OuraResult>;
  public confirm(...args: unknown[]): Promise<OuraResult> {
    const config: OuraOptions = {
      title: 'Are you sure?',
      text: 'This action cannot be undone.',
      ...this._parseArgs(args, 'warning'),
    };

    const buttons: ButtonConfig[] = [];
    buttons.push({
      text: config.cancelButtonText || this.getI18n('cancel'),
      value: { isConfirmed: false, isDismissed: true, isDenied: false },
      className: 'oura-btn-cancel',
    });

    if (config.showDenyButton) {
      buttons.push({
        text: config.denyButtonText || this.getI18n('deny'),
        value: { isConfirmed: false, isDismissed: false, isDenied: true },
        className: 'oura-btn-deny',
      });
    }

    buttons.push({
      text: config.confirmButtonText || this.getI18n('confirm'),
      value: { isConfirmed: true, isDismissed: false, isDenied: false },
    });

    return this._buildModal(config, buttons);
  }

  public prompt(
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
      text: config.cancelButtonText || this.getI18n('cancel'),
      value: { isConfirmed: false, isDismissed: true, isDenied: false },
      className: 'oura-btn-cancel',
    });

    if (config.showDenyButton) {
      buttons.push({
        text: config.denyButtonText || this.getI18n('deny'),
        value: { isConfirmed: false, isDismissed: false, isDenied: true },
        className: 'oura-btn-deny',
      });
    }

    buttons.push({
      text: config.confirmButtonText || this.getI18n('submit'),
      value: { isConfirmed: true, isDismissed: false, isDenied: false },
    });

    return this._buildModal({ ...config }, buttons);
  }

  public drawer(options: OuraOptions): Promise<OuraResult> {
    return this._buildModal(
      options,
      [
        {
          text: options.confirmButtonText || this.getI18n('continue'),
          value: { isConfirmed: true, isDismissed: false, isDenied: false },
        },
      ],
      true
    );
  }

  /**
   * Chains multiple dialogs sequentially.
   * @param steps Array of OuraOptions
   * @returns Array of OuraResults
   */
  public async queue(steps: OuraOptions[]): Promise<OuraResult[]> {
    const results: OuraResult[] = [];
    for (const step of steps) {
      const result = await this.fire(step);
      results.push(result);
      // Optional: stop queue if dismissed? SweetAlert usually continues unless logic says otherwise.
      // We'll follow the most flexible path: just chain them.
    }
    return results;
  }

  private recalculateToastStack() {
    if (typeof document === 'undefined') return;
    const container = document.getElementById('oura-toast-container');
    if (!container) return;

    const toasts = Array.from(container.children) as HTMLElement[];
    // Stacking logic: newest is at index 0 (top visually if flex, or first in DOM)
    // With column-reverse, physical order is already handled.
    // For 3D deck, we want to scale back those "further" in the list.

    toasts.forEach((toast, idx) => {
      const isBottom = container.className.includes('bottom');
      // If bottom, the first in DOM (index 0) is at the bottom.
      // We want to scale those "underneath".
      // The latest toast is always at scale 1.

      const depth = toasts.length - 1 - idx; // Last element has depth 0
      const yOffset = depth * (isBottom ? 14 : -14);
      const scale = 1 - depth * 0.05;
      const zIndex = 100 - depth;

      toast.style.setProperty('--y-offset', yOffset.toString());
      toast.style.setProperty('--scale', scale.toString());
      toast.style.setProperty('--z-index', zIndex.toString());
    });
  }

  public toast(options?: OuraOptions): OuraToastHandle;
  public toast(title: string, text?: string, icon?: OuraOptions['icon']): OuraToastHandle;
  public toast(...args: unknown[]): OuraToastHandle {
    let updateToast: (newOpts: Partial<OuraOptions>) => void = () => {};
    const promise = new Promise<boolean>((resolve) => {
      if (typeof document === 'undefined') return resolve(false);

      const parsed = this._parseArgs(args);
      const config: OuraOptions = { timer: 3000, type: parsed.type || 'toast', ...parsed };
      const container = document.getElementById('oura-toast-container');
      if (!container) return resolve(false);

      const toast = document.createElement('div');
      toast.className = 'oura-toast oura-init';
      toast.setAttribute('role', 'status');

      let iconHtml = '';
      if (config.icon && ICONS[config.icon]) {
        iconHtml = ICONS[config.icon];
      } else if (config.icon) {
        // Custom SVG/HTML icon
        iconHtml = config.icon;
      }

      let actionsHtml = '';
      if (config.actions && config.actions.length > 0) {
        actionsHtml = `<div class="oura-toast-actions">${config.actions
          .map(
            (a, i) => `<button class="oura-toast-action" data-action-idx="${i}">${a.label}</button>`
          )
          .join('')}</div>`;
      }

      toast.innerHTML = `
                <div class="oura-toast-body">
                    ${iconHtml ? `<div class="oura-toast-icon">${iconHtml}</div>` : ''}
                    <div class="oura-toast-content">
                        ${config.title ? `<div class="oura-toast-title">${config.title}</div>` : ''}
                        ${config.text ? `<div class="oura-toast-text">${config.text}</div>` : ''}
                    </div>
                </div>
                ${actionsHtml}
            `;

      // Bind action handlers
      if (config.actions) {
        toast.querySelectorAll('.oura-toast-action').forEach((btn) => {
          const idx = parseInt(btn.getAttribute('data-action-idx') || '0');
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            config.actions![idx].onClick();
            close();
          });
        });
      }

      if (config.type === 'progress') {
        const progCont = document.createElement('div');
        progCont.className = 'oura-progress-container';
        const progFill = document.createElement('div');
        progFill.className = 'oura-progress-fill';
        progFill.style.transitionDuration = `${config.timer}ms`;
        progCont.appendChild(progFill);
        toast.appendChild(progCont);

        requestAnimationFrame(() => {
          setTimeout(() => {
            progFill.style.width = '100%';
          }, 50);
        });
      }

      container.appendChild(toast);
      this.recalculateToastStack();

      let timeoutId: ReturnType<typeof setTimeout> | undefined;
      let startTime = Date.now();
      let remainingTime = config.timer || 0;
      let isPaused = false;

      let cleanupToastDocumentTouch: (() => void) | null = null;

      const close = () => {
        if (toast.classList.contains('oura-closing')) return;
        cleanupToastDocumentTouch?.();
        cleanupToastDocumentTouch = null;
        toast.classList.add('oura-closing');
        toast.classList.remove('oura-show');
        setTimeout(() => {
          toast.remove();
          this.recalculateToastStack();
          resolve(true);
        }, 400);
      };

      const pauseTimer = () => {
        if (!config.timer || config.timer <= 0 || isPaused) return;
        isPaused = true;
        if (timeoutId !== undefined) clearTimeout(timeoutId);
        remainingTime -= Date.now() - startTime;
        if (remainingTime < 100) remainingTime = 100;
      };

      const resumeTimer = () => {
        if (!config.timer || config.timer <= 0 || !isPaused) return;
        isPaused = false;
        startTime = Date.now();
        timeoutId = setTimeout(close, remainingTime);
      };

      // Swipe Logic
      let startX = 0;
      let currentX = 0;
      let isDragging = false;

      const touchMoveOpts: AddEventListenerOptions = { passive: true };

      toast.addEventListener(
        'touchstart',
        (e) => {
          startX = e.touches[0].clientX;
          isDragging = true;
          toast.style.transition = 'none';
          pauseTimer();
        },
        { passive: true }
      );

      const onToastTouchMove = (e: Event) => {
        if (!isDragging) return;
        const te = e as TouchEvent;
        currentX = te.touches[0].clientX - startX;
        const opacity = 1 - Math.abs(currentX) / 200;
        toast.style.transform = `translateX(${currentX}px) scale(var(--scale, 1)) translateY(calc(var(--y-offset, 0) * 1px))`;
        toast.style.opacity = Math.max(0, opacity).toString();
      };

      const onToastTouchEnd = () => {
        if (!isDragging) return;
        isDragging = false;
        toast.style.transition = '';
        if (Math.abs(currentX) > 100) {
          close();
        } else {
          toast.style.transform = '';
          toast.style.opacity = '';
          resumeTimer();
        }
      };

      document.addEventListener('touchmove', onToastTouchMove, touchMoveOpts);
      document.addEventListener('touchend', onToastTouchEnd);

      cleanupToastDocumentTouch = () => {
        document.removeEventListener('touchmove', onToastTouchMove, touchMoveOpts);
        document.removeEventListener('touchend', onToastTouchEnd);
      };

      toast.addEventListener('mouseenter', pauseTimer);
      toast.addEventListener('mouseleave', resumeTimer);
      toast.addEventListener('click', close);

      if (config.timer && config.timer > 0) {
        timeoutId = setTimeout(close, config.timer);
      }

      requestAnimationFrame(() => {
        toast.classList.remove('oura-init');
        toast.classList.add('oura-show');
      });

      updateToast = (newOpts: Partial<OuraOptions>) => {
        if (newOpts.title) {
          const titleEl = toast.querySelector('.oura-toast-title');
          if (titleEl) titleEl.textContent = newOpts.title;
        }
        if (newOpts.text) {
          const textEl = toast.querySelector('.oura-toast-text');
          if (textEl) textEl.textContent = newOpts.text;
        }
        if (newOpts.icon && ICONS[newOpts.icon]) {
          const iconEl = toast.querySelector('.oura-toast-icon');
          if (iconEl) iconEl.innerHTML = ICONS[newOpts.icon];
        }
      };
    });
    return Object.assign(promise, { update: updateToast }) as OuraToastHandle;
  }

  public promise<T>(
    promise: Promise<T> | (() => Promise<T>),
    msgs: OuraPromiseMessages<T>
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      if (typeof document === 'undefined') return reject();

      const container = document.getElementById('oura-toast-container');
      if (!container) return reject();

      const toast = document.createElement('div');
      toast.className = 'oura-toast oura-init';
      toast.innerHTML = `
                <div class="oura-toast-body">
                    <div class="oura-toast-icon"><div class="oura-btn-loading" style="width:16px; height:16px; margin:0; border-color: rgba(0,0,0,0.2); border-top-color: currentColor;" ></div></div>
                    <div class="oura-toast-content">
                        <div class="oura-toast-title">${msgs.loading}</div>
                    </div>
                </div>
            `;
      container.appendChild(toast);
      this.recalculateToastStack();

      requestAnimationFrame(() => {
        toast.classList.remove('oura-init');
        toast.classList.add('oura-show');
      });

      const finalize = (type: 'success' | 'error', text: string) => {
        const iconHtml = ICONS[type] || '';
        toast.innerHTML = `
                    <div class="oura-toast-body">
                        <div class="oura-toast-icon">${iconHtml}</div>
                        <div class="oura-toast-content">
                            <div class="oura-toast-title">${text}</div>
                        </div>
                    </div>
                `;
        setTimeout(() => {
          toast.classList.remove('oura-show');
          setTimeout(() => {
            toast.remove();
            this.recalculateToastStack();
          }, 400);
        }, 3000); // Auto close after 3s
      };

      const p = typeof promise === 'function' ? promise() : promise;
      p.then((data) => {
        finalize('success', typeof msgs.success === 'function' ? msgs.success(data) : msgs.success);
        resolve(data);
      }).catch((err) => {
        finalize('error', typeof msgs.error === 'function' ? msgs.error(err) : msgs.error);
        reject(err);
      });
    });
  }

  public success(title: string, text?: string): OuraToastHandle {
    return this.toast({ title, text, icon: 'success' });
  }
  public info(title: string, text?: string): OuraToastHandle {
    return this.toast({ title, text, icon: 'info' });
  }
  public warning(title: string, text?: string): OuraToastHandle {
    return this.toast({ title, text, icon: 'warning' });
  }
  public error(title: string, text?: string): OuraToastHandle {
    return this.toast({ title, text, icon: 'error' });
  }

  // ── Tooltip ──
  public tooltip(target: string | HTMLElement, options: TooltipOptions): () => void {
    if (typeof document === 'undefined') return () => {};
    const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
    if (!el) return () => {};

    const tooltip = document.createElement('div');
    tooltip.className = 'oura-tooltip';
    this._applyThemeToElement(tooltip);
    tooltip.innerHTML = typeof options === 'string' ? options : options.content;
    document.body.appendChild(tooltip);

    const placement = options.placement || 'top';
    const delay = options.delay ?? 200;
    let timeout: ReturnType<typeof setTimeout>;

    const show = () => {
      timeout = setTimeout(() => {
        const rect = el.getBoundingClientRect();
        const tRect = tooltip.getBoundingClientRect();
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
        tooltip.style.top = `${top}px`;
        tooltip.style.left = `${left}px`;
        tooltip.classList.add('oura-show');
      }, delay);
    };
    const hide = () => {
      clearTimeout(timeout);
      tooltip.classList.remove('oura-show');
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
      tooltip.remove();
    };
  }

  // ── Popover ──
  public popover(target: string | HTMLElement, options: PopoverOptions): () => void {
    if (typeof document === 'undefined') return () => {};
    const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
    if (!el) return () => {};

    const popover = document.createElement('div');
    popover.className = 'oura-popover';
    this._applyThemeToElement(popover);
    popover.id = `popover-${Date.now().toString(36)}`;
    let html = '';
    if (options.title) html += `<div class="oura-popover-header">${options.title}</div>`;
    html += `<div class="oura-popover-body">${options.html}</div>`;
    html += `<button class="oura-popover-close" aria-label="Close">&times;</button>`;
    popover.innerHTML = html;
    document.body.appendChild(popover);

    let open = false;
    const placement = options.placement || 'bottom';

    const position = () => {
      const rect = el.getBoundingClientRect();
      const pRect = popover.getBoundingClientRect();
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
      popover.style.top = `${Math.max(8, top)}px`;
      popover.style.left = `${Math.max(8, left)}px`;
    };

    const toggle = (e: Event) => {
      e.stopPropagation();
      open = !open;
      if (open) {
        position();
        requestAnimationFrame(() => popover.classList.add('oura-show'));
      } else {
        popover.classList.remove('oura-show');
      }
    };

    const outsideClick = (e: Event) => {
      if (
        open &&
        options.closeOnClickOutside !== false &&
        !popover.contains(e.target as Node) &&
        !el.contains(e.target as Node)
      ) {
        open = false;
        popover.classList.remove('oura-show');
      }
    };

    el.addEventListener('click', toggle);
    document.addEventListener('click', outsideClick);
    popover.querySelector('.oura-popover-close')?.addEventListener('click', () => {
      open = false;
      popover.classList.remove('oura-show');
    });

    return () => {
      el.removeEventListener('click', toggle);
      document.removeEventListener('click', outsideClick);
      popover.remove();
    };
  }

  // ── Dropdown Menu ──
  public dropdown(target: string | HTMLElement, options: DropdownOptions): () => void {
    if (typeof document === 'undefined') return () => {};
    const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
    if (!el) return () => {};

    const menu = document.createElement('div');
    menu.className = 'oura-dropdown';
    this._applyThemeToElement(menu);
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

  // ── Context Menu ──
  public contextMenu(target: string | HTMLElement, items: DropdownItem[]): () => void {
    if (typeof document === 'undefined') return () => {};
    const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
    if (!el) return () => {};

    const menu = document.createElement('div');
    menu.className = 'oura-context-menu';
    this._applyThemeToElement(menu);
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

  // ── Inline Alert ──
  public alert(options: AlertOptions): HTMLElement {
    const alert = document.createElement('div');
    alert.className = `oura-alert oura-alert-${options.variant || 'info'}`;
    this._applyThemeToElement(alert);
    const variant = options.variant || 'default';
    if (variant !== 'default') alert.classList.add(`oura-alert-${variant}`);
    alert.setAttribute('role', 'alert');

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
    alert.innerHTML = inner;

    if (options.dismissible !== false) {
      const dismissBtn = document.createElement('button');
      dismissBtn.type = 'button';
      dismissBtn.className = 'oura-alert-dismiss';
      dismissBtn.setAttribute('aria-label', options.dismissLabel ?? this.getI18n('dismiss'));
      dismissBtn.innerHTML = '&times;';
      dismissBtn.addEventListener('click', () => {
        alert.style.opacity = '0';
        alert.style.transform = 'translateY(-8px)';
        setTimeout(() => alert.remove(), 300);
      });
      alert.appendChild(dismissBtn);
    }

    const container =
      typeof options.container === 'string'
        ? document.querySelector(options.container)
        : options.container;
    (container || document.body).appendChild(alert);
    return alert;
  }

  // ── Skeleton ──
  public skeleton(options: SkeletonOptions = {}): HTMLElement {
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

  // ── Hover Card ──
  public hoverCard(target: string | HTMLElement, options: HoverCardOptions): () => void {
    if (typeof document === 'undefined') return () => {};
    const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
    if (!el) return () => {};

    const card = document.createElement('div');
    card.className = 'oura-hover-card';
    this._applyThemeToElement(card);
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
}

const Oura = new OuraNotification();

declare global {
  interface Window {
    Oura?: typeof Oura;
  }
}

export type {
  AlertOptions,
  OuraConfig,
  OuraI18nStrings,
  OuraOptions,
  OuraPromiseMessages,
  OuraResult,
  OuraToastHandle,
  ButtonConfig,
  DropdownItem,
  DropdownOptions,
  HoverCardOptions,
  PopoverOptions,
  SkeletonOptions,
  ToastAction,
  TooltipOptions,
} from './types';

export default Oura;

if (typeof window !== 'undefined') {
  window.Oura = Oura;
}

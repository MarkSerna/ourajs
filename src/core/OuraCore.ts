import { OuraConfig, OuraI18nStrings, OuraResult, OuraOptions } from '../types';
import { injectStyles } from '../styles';

export interface ModalInstance {
  overlay: HTMLDivElement;
  modal: HTMLDivElement;
  close: (result: OuraResult) => void;
}

export class OuraCore {
  protected activeModals: ModalInstance[] = [];
  protected originalOverflow: string = '';
  protected originalPaddingRight: string = '';

  public locale: string = 'en';
  public i18n: Record<string, OuraI18nStrings> = {
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

  public theme: 'light-glass' | 'dark-glass' | 'system' = 'system';
  public mq: MediaQueryList | null = null;

  public _getEffectiveTheme(): 'light-glass' | 'dark-glass' {
    if (typeof window === 'undefined') return 'light-glass';
    if (this.theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark-glass'
        : 'light-glass';
    }
    return this.theme as 'light-glass' | 'dark-glass';
  }

  public _applyThemeToElement(el: HTMLElement) {
    const effectiveTheme = this._getEffectiveTheme();
    if (effectiveTheme === 'dark-glass') el.classList.add('oura-dark-glass');
    else el.classList.remove('oura-dark-glass');
  }

  public getI18n(key: keyof OuraI18nStrings): string {
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
      this._applyThemeToElement(container);
    }

    this.activeModals.forEach((m) => this._applyThemeToElement(m.overlay));

    if (typeof window !== 'undefined') {
      if (this.mq) this.mq.onchange = null;
      if (this.theme === 'system') {
        this.mq = window.matchMedia('(prefers-color-scheme: dark)');
        this.mq.onchange = () => {
          const c = document.getElementById('oura-toast-container');
          if (c) this._applyThemeToElement(c);
          this.activeModals.forEach((m) => this._applyThemeToElement(m.overlay));
        };
      }
    }
  }

  public _lockScroll(): void {
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

  public _unlockScroll(): void {
    if (typeof document === 'undefined') return;
    if (this.activeModals.length === 0) {
      document.body.style.overflow = this.originalOverflow;
      document.body.style.paddingRight = this.originalPaddingRight;
    }
  }

  public _trapFocus(modal: HTMLElement) {
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

  public handleEsc(e: KeyboardEvent): void {
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

  public _parseArgs(args: unknown[], defaultIcon?: OuraOptions['icon']): OuraOptions {
    if (typeof args[0] === 'string' || typeof args[1] === 'string') {
      return {
        title: (args[0] as string) || '',
        text: (args[1] as string) || '',
        icon: (args[2] as OuraOptions['icon']) || defaultIcon,
      };
    }
    const opts = args[0] as OuraOptions | undefined;
    if (opts && typeof opts === 'object' && !Array.isArray(opts)) {
      return { icon: defaultIcon, ...opts };
    }
    return { icon: defaultIcon };
  }
}

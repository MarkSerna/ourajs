export interface OuraOptions {
    title?: string;
    text?: string;
    html?: string | HTMLElement;
    icon?: 'success' | 'error' | 'warning' | 'info' | 'progress' | (string & {});
    confirmButtonText?: string;
    cancelButtonText?: string;
    showDenyButton?: boolean;
    denyButtonText?: string;
    preConfirm?: (inputValue?: string) => Promise<unknown> | unknown;
    allowOutsideClick?: boolean;
    timer?: number;
    type?: 'toast' | 'progress';
    
    // Prompt specific
    input?: 'text' | 'password' | 'email' | 'number';
    inputPlaceholder?: string;
    inputValue?: string;
    
    // Drawer/Layout specific
    side?: 'left' | 'right' | 'top' | 'bottom';
    width?: string;

    // Toast actions
    actions?: ToastAction[];
}

export interface ToastAction {
    label: string;
    onClick: () => void;
}

/** Promesa del toast con `update()` para cambiar título/texto/icono mientras está visible */
export type OuraToastHandle = Promise<boolean> & {
    update: (newOpts: Partial<OuraOptions>) => void;
};

/** Cadenas que puede sobrescribir `customI18n` por idioma */
export interface OuraI18nStrings {
    confirm?: string;
    cancel?: string;
    submit?: string;
    continue?: string;
    deny?: string;
    /** Etiqueta del botón para cerrar alertas inline */
    dismiss?: string;
}

export interface OuraConfig {
    theme?: 'light-glass' | 'dark-glass' | 'system';
    accent?: string;
    locale?: string;
    position?: 'top-left' | 'top-right' | 'top-center' | 'bottom-left' | 'bottom-right' | 'bottom-center';
    customI18n?: Record<string, OuraI18nStrings>;
}

export interface OuraResult {
    isConfirmed: boolean;
    isDismissed: boolean;
    isDenied: boolean;
    value?: string;
}

export interface ButtonConfig {
    text: string;
    value: OuraResult;
    className?: string;
}

// ── New Component Types ──

export interface TooltipOptions {
    content: string;
    placement?: 'top' | 'bottom' | 'left' | 'right';
    delay?: number;
}

export interface PopoverOptions {
    title?: string;
    html: string;
    placement?: 'top' | 'bottom' | 'left' | 'right';
    closeOnClickOutside?: boolean;
}

export interface DropdownItem {
    label: string;
    icon?: string;
    shortcut?: string;
    separator?: boolean;
    disabled?: boolean;
    danger?: boolean;
    onClick?: () => void;
}

export interface DropdownOptions {
    items: DropdownItem[];
    placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
}

export interface AlertOptions {
    title?: string;
    description: string;
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
    dismissible?: boolean;
    /** Si se define, sustituye la etiqueta i18n del botón cerrar (p. ej. `aria-label`) */
    dismissLabel?: string;
    container?: string | HTMLElement;
}

export interface SkeletonOptions {
    width?: string;
    height?: string;
    variant?: 'text' | 'circular' | 'rectangular';
    count?: number;
    container?: string | HTMLElement;
}

export interface HoverCardOptions {
    html: string;
    placement?: 'top' | 'bottom';
    openDelay?: number;
    closeDelay?: number;
}

/** Mensajes mostrados por `Oura.promise()` en el toast seguimiento */
export interface OuraPromiseMessages<T = unknown> {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((err: unknown) => string);
}

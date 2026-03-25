import {
  OuraOptions, OuraConfig, OuraResult, ButtonConfig, TooltipOptions,
  PopoverOptions, DropdownOptions, DropdownItem, AlertOptions,
  SkeletonOptions, HoverCardOptions, OuraI18nStrings,
  OuraPromiseMessages, OuraToastHandle
} from './types';
import { OuraCore } from './core/OuraCore';

import { fire, confirmModal, promptModal, drawerModal } from './components/modal';
import { toast, promiseToast, success, info, warning, error } from './components/toast';
import { tooltip } from './components/tooltip';
import { popover } from './components/popover';
import { dropdown } from './components/dropdown';
import { contextMenu } from './components/contextMenu';
import { alert } from './components/alert';
import { skeleton } from './components/skeleton';
import { hoverCard } from './components/hoverCard';

class OuraNotification extends OuraCore {
  private static apiInstance: OuraNotification;
  constructor() {
    super();
    if (OuraNotification.apiInstance) return OuraNotification.apiInstance;
    OuraNotification.apiInstance = this;
  }

  public fire(options?: OuraOptions): Promise<OuraResult>;
  public fire(title: string, text?: string, icon?: OuraOptions['icon']): Promise<OuraResult>;
  public fire(...args: any[]): Promise<OuraResult> { return fire(this, ...args); }

  public confirm(options?: OuraOptions): Promise<OuraResult>;
  public confirm(title: string, text?: string, icon?: OuraOptions['icon']): Promise<OuraResult>;
  public confirm(...args: any[]): Promise<OuraResult> { return confirmModal(this, ...args); }

  public prompt(titleOrOptions: string | OuraOptions, text?: string, inputType?: OuraOptions['input']): Promise<OuraResult> { return promptModal(this, titleOrOptions, text, inputType as any); }
  public drawer(options: OuraOptions): Promise<OuraResult> { return drawerModal(this, options); }

  public toast(options?: OuraOptions): OuraToastHandle;
  public toast(title: string, text?: string, icon?: OuraOptions['icon']): OuraToastHandle;
  public toast(...args: any[]): OuraToastHandle { return toast(this, ...args); }

  public promise<T>(p: Promise<T> | (() => Promise<T>), msgs: OuraPromiseMessages<T>): Promise<T> { return promiseToast(this, p, msgs); }
  
  public success(title: string, text?: string): OuraToastHandle { return success(this, title, text); }
  public info(title: string, text?: string): OuraToastHandle { return info(this, title, text); }
  public warning(title: string, text?: string): OuraToastHandle { return warning(this, title, text); }
  public error(title: string, text?: string): OuraToastHandle { return error(this, title, text); }

  public tooltip(target: string | HTMLElement, options: TooltipOptions): () => void { return tooltip(this, target, options); }
  public popover(target: string | HTMLElement, options: PopoverOptions): () => void { return popover(this, target, options); }
  public dropdown(target: string | HTMLElement, options: DropdownOptions): () => void { return dropdown(this, target, options); }
  public contextMenu(target: string | HTMLElement, items: DropdownItem[]): () => void { return contextMenu(this, target, items); }
  public hoverCard(target: string | HTMLElement, options: HoverCardOptions): () => void { return hoverCard(this, target, options); }
  public alert(options: AlertOptions): HTMLElement { return alert(this, options); }
  public skeleton(options?: SkeletonOptions): HTMLElement { return skeleton(this, options); }
}

const Oura = new OuraNotification();

declare global {
  interface Window {
    Oura?: typeof Oura;
  }
}

export type {
  AlertOptions, OuraConfig, OuraI18nStrings, OuraOptions,
  OuraPromiseMessages, OuraResult, OuraToastHandle, ButtonConfig,
  DropdownItem, DropdownOptions, HoverCardOptions, PopoverOptions,
  SkeletonOptions, TooltipOptions
} from './types';

export default Oura;

if (typeof window !== 'undefined') {
  window.Oura = Oura;
}

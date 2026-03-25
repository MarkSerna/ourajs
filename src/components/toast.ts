import { OuraOptions, OuraPromiseMessages, OuraToastHandle } from '../types';
import { ICONS } from '../icons';
import { OuraCore } from '../core/OuraCore';

export function recalculateToastStack(core: OuraCore) {
  if (typeof document === 'undefined') return;
  const container = document.getElementById('oura-toast-container');
  if (!container) return;

  const toasts = Array.from(container.children) as HTMLElement[];

  toasts.forEach((toastEl, idx) => {
    const isBottom = container.className.includes('bottom');
    const depth = toasts.length - 1 - idx; // Last element has depth 0
    const yOffset = depth * (isBottom ? 14 : -14);
    const scale = 1 - depth * 0.05;
    const zIndex = 100 - depth;

    toastEl.style.setProperty('--y-offset', yOffset.toString());
    toastEl.style.setProperty('--scale', scale.toString());
    toastEl.style.setProperty('--z-index', zIndex.toString());
  });
}

export function toast(core: OuraCore, ...args: any[]): OuraToastHandle {
  let updateToast: (newOpts: Partial<OuraOptions>) => void = () => {};
  const promise = new Promise<boolean>((resolve) => {
    if (typeof document === 'undefined') return resolve(false);

    const parsed = core._parseArgs(args);
    const config: OuraOptions = { timer: 3000, type: parsed.type || 'toast', ...parsed };
    const container = document.getElementById('oura-toast-container');
    if (!container) return resolve(false);

    const toastEl = document.createElement('div');
    toastEl.className = 'oura-toast oura-init';
    toastEl.setAttribute('role', 'status');

    let iconHtml = '';
    if (config.icon && ICONS[config.icon]) {
      iconHtml = ICONS[config.icon];
    } else if (config.icon) {
      iconHtml = config.icon;
    }

    let actionsHtml = '';
    if (config.actions && config.actions.length > 0) {
      actionsHtml = `<div class="oura-toast-actions">${config.actions
        .map((a, i) => `<button class="oura-toast-action" data-action-idx="${i}">${a.label}</button>`)
        .join('')}</div>`;
    }

    toastEl.innerHTML = `
      <div class="oura-toast-body">
          ${iconHtml ? `<div class="oura-toast-icon">${iconHtml}</div>` : ''}
          <div class="oura-toast-content">
              ${config.title ? `<div class="oura-toast-title">${config.title}</div>` : ''}
              ${config.text ? `<div class="oura-toast-text">${config.text}</div>` : ''}
          </div>
      </div>
      ${actionsHtml}
    `;

    if (config.actions) {
      toastEl.querySelectorAll('.oura-toast-action').forEach((btn) => {
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
      toastEl.appendChild(progCont);

      requestAnimationFrame(() => {
        setTimeout(() => {
          progFill.style.width = '100%';
        }, 50);
      });
    }

    container.appendChild(toastEl);
    recalculateToastStack(core);

    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let startTime = Date.now();
    let remainingTime = config.timer || 0;
    let isPaused = false;

    let cleanupToastDocumentTouch: (() => void) | null = null;

    const close = () => {
      if (toastEl.classList.contains('oura-closing')) return;
      cleanupToastDocumentTouch?.();
      cleanupToastDocumentTouch = null;
      toastEl.classList.add('oura-closing');
      toastEl.classList.remove('oura-show');
      setTimeout(() => {
        toastEl.remove();
        recalculateToastStack(core);
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

    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    const touchMoveOpts: AddEventListenerOptions = { passive: true };

    toastEl.addEventListener(
      'touchstart',
      (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        toastEl.style.transition = 'none';
        pauseTimer();
      },
      { passive: true }
    );

    const onToastTouchMove = (e: Event) => {
      if (!isDragging) return;
      const te = e as TouchEvent;
      currentX = te.touches[0].clientX - startX;
      const opacity = 1 - Math.abs(currentX) / 200;
      toastEl.style.transform = `translateX(${currentX}px) scale(var(--scale, 1)) translateY(calc(var(--y-offset, 0) * 1px))`;
      toastEl.style.opacity = Math.max(0, opacity).toString();
    };

    const onToastTouchEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      toastEl.style.transition = '';
      if (Math.abs(currentX) > 100) {
        close();
      } else {
        toastEl.style.transform = '';
        toastEl.style.opacity = '';
        resumeTimer();
      }
    };

    document.addEventListener('touchmove', onToastTouchMove, touchMoveOpts);
    document.addEventListener('touchend', onToastTouchEnd);

    cleanupToastDocumentTouch = () => {
      document.removeEventListener('touchmove', onToastTouchMove, touchMoveOpts);
      document.removeEventListener('touchend', onToastTouchEnd);
    };

    toastEl.addEventListener('mouseenter', pauseTimer);
    toastEl.addEventListener('mouseleave', resumeTimer);
    toastEl.addEventListener('click', close);

    if (config.timer && config.timer > 0) {
      timeoutId = setTimeout(close, config.timer);
    }

    requestAnimationFrame(() => {
      toastEl.classList.remove('oura-init');
      toastEl.classList.add('oura-show');
    });

    updateToast = (newOpts: Partial<OuraOptions>) => {
      if (newOpts.title) {
        const titleEl = toastEl.querySelector('.oura-toast-title');
        if (titleEl) titleEl.textContent = newOpts.title;
      }
      if (newOpts.text) {
        const textEl = toastEl.querySelector('.oura-toast-text');
        if (textEl) textEl.textContent = newOpts.text;
      }
      if (newOpts.icon && ICONS[newOpts.icon]) {
        const iconEl = toastEl.querySelector('.oura-toast-icon');
        if (iconEl) iconEl.innerHTML = ICONS[newOpts.icon];
      }
    };
  });
  return Object.assign(promise, { update: updateToast }) as OuraToastHandle;
}

export function promiseToast<T>(
  core: OuraCore,
  promise: Promise<T> | (() => Promise<T>),
  msgs: OuraPromiseMessages<T>
): Promise<T> {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined') return reject();

    const container = document.getElementById('oura-toast-container');
    if (!container) return reject();

    const toastEl = document.createElement('div');
    toastEl.className = 'oura-toast oura-init';
    toastEl.innerHTML = `
      <div class="oura-toast-body">
          <div class="oura-toast-icon">
            <div class="oura-btn-loading" style="width:16px; height:16px; margin:0; border-color: rgba(0,0,0,0.2); border-top-color: currentColor;"></div>
          </div>
          <div class="oura-toast-content">
              <div class="oura-toast-title">${msgs.loading}</div>
          </div>
      </div>
    `;
    container.appendChild(toastEl);
    recalculateToastStack(core);

    requestAnimationFrame(() => {
      toastEl.classList.remove('oura-init');
      toastEl.classList.add('oura-show');
    });

    const finalize = (type: 'success' | 'error', text: string) => {
      const iconHtml = ICONS[type] || '';
      toastEl.innerHTML = `
        <div class="oura-toast-body">
            <div class="oura-toast-icon">${iconHtml}</div>
            <div class="oura-toast-content">
                <div class="oura-toast-title">${text}</div>
            </div>
        </div>
      `;
      setTimeout(() => {
        toastEl.classList.remove('oura-show');
        setTimeout(() => {
          toastEl.remove();
          recalculateToastStack(core);
        }, 400);
      }, 3000);
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

export function success(core: OuraCore, title: string, text?: string): OuraToastHandle {
  return toast(core, { title, text, icon: 'success' });
}
export function info(core: OuraCore, title: string, text?: string): OuraToastHandle {
  return toast(core, { title, text, icon: 'info' });
}
export function warning(core: OuraCore, title: string, text?: string): OuraToastHandle {
  return toast(core, { title, text, icon: 'warning' });
}
export function error(core: OuraCore, title: string, text?: string): OuraToastHandle {
  return toast(core, { title, text, icon: 'error' });
}

import { beforeEach, vi } from 'vitest';

let prefersColorSchemeDark = false;

/** Para tests que simulen `prefers-color-scheme: dark` con `theme: 'system'` */
export function setPrefersColorSchemeDark(value: boolean): void {
  prefersColorSchemeDark = value;
}

beforeEach(() => {
  prefersColorSchemeDark = false;
});

/**
 * JSDOM no implementa matchMedia; Oura lo usa para `theme: 'system'`.
 */
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  configurable: true,
  value: vi.fn((query: string) => {
    const mql = {
      media: query,
      onchange: null as ((this: MediaQueryList, ev: MediaQueryListEvent) => void) | null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };
    Object.defineProperty(mql, 'matches', {
      get: () => (query === '(prefers-color-scheme: dark)' ? prefersColorSchemeDark : false),
      configurable: true,
    });
    return mql as MediaQueryList;
  }),
});

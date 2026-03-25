import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.d.ts', 'src/types.ts'],
      thresholds: {
        statements: 50,
        branches: 40,
        functions: 40,
        lines: 55,
      },
    },
  },
});

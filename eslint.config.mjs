import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      'dist/**',
      'docs/.vitepress/dist/**',
      'docs/.vitepress/cache/**',
      'docs/components/**',
      'docs/.vitepress/theme/**',
      'node_modules/**',
    ],
  },
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ['test/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.vitest,
      },
    },
  },
  {
    files: ['vite.config.ts', 'vitest.config.ts', 'docs/.vitepress/config.mts'],
    languageOptions: {
      globals: globals.node,
    },
  },
  eslintConfigPrettier
);

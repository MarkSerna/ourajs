# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- ESLint (flat config), Prettier, Vitest coverage with optional thresholds.
- CI: lint, build, tests with coverage, docs build.
- TypeScript re-exports (`OuraOptions`, `OuraToastHandle`, `OuraPromiseMessages`, etc.).
- i18n key `dismiss` for inline alert close buttons; `OuraI18nStrings`.
- `OuraToastHandle` with `update()`; cleanup of document touch listeners for toasts and drawers.
- Documentation: Security & HTML guide; toast `update()` usage.
- Spanish docs fallback: locale `es` links to English guides when no translation exists.

### Changed

- `package.json` `exports` lists `types` first for better IDE resolution.
- `preConfirm` and promise error callbacks use `unknown` where appropriate.

### Fixed

- Focus restoration after closing modals/drawers.
- JSDOM `matchMedia` mock for tests.

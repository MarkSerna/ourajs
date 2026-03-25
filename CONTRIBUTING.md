# Contributing

Thanks for your interest in improving Oura.js.

## Setup

```bash
git clone https://github.com/MarkSerna/ourajs.git
cd ourajs
npm ci
```

## Checks before a PR

Run the same checks as CI:

```bash
npm run lint
npm run format:check   # optional; requires Prettier
npm run build
npm run test:coverage
npm run docs:build
```

## Code style

- **ESLint** enforces TypeScript and JavaScript rules (`eslint.config.mjs`).
- **Prettier** formats Markdown, JSON, YAML, and optionally TS (`.prettierrc.json`). Use `npm run format` to write files.

## Pull requests

- Keep changes focused on one topic when possible.
- Add or update tests for behavior changes.
- Update `CHANGELOG.md` under `[Unreleased]` when the change is user-visible.

## Reporting issues

Use [GitHub Issues](https://github.com/MarkSerna/ourajs/issues) with a minimal reproduction when reporting bugs.

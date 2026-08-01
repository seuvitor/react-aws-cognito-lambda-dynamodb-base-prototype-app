# AGENTS.md

## Project overview

A **React library** (not an app) that provides reusable hooks and providers for
prototyping serverless React apps backed by **AWS Cognito, Lambda and DynamoDB**.
It is published to npm and consumed by other frontend projects. Package name:
`react-aws-cognito-lambda-dynamodb-base-prototype-app`.

- Ships **ESM only**, built with Vite 8 (Rolldown) library mode. Type
  declarations are emitted by TypeScript 7's native `tsc`
  (`emitDeclarationOnly` via [tsconfig.build.json](tsconfig.build.json)) as a
  per-file `.d.ts` tree under `dist/`, with `dist/index.d.ts` as the entry.
- React 19 + `react-router` 8 (uses `HashRouter`).
- AWS SDK v3, `react`, `react-dom`, `react-router` are **peer dependencies**
  (marked `external` in the Vite build — never bundle them).
- The `demo/` folder is a standalone example app that imports the library from
  source (`../../src`); it is not part of the published package.

## Setup & commands

This project uses **bun** as its package manager and task runner.

- Install deps: `bun install`
- Build library (JS bundle + `.d.ts`): `bun run build`
  (runs `tsc -b && vite build && tsc -p tsconfig.build.json`)
- Run the demo app: `bun run start` → serves on `http://localhost:5000`
- Lint: `bun run lint` (oxlint) · auto-fix: `bun run lint:fix`
- Format: `bun run format` (oxfmt) · check-only: `bun run format:check`

Always run `bun run lint` and `bun run format:check` before finishing a change.
There is currently **no test suite** — do not invent test commands.

## Architecture

Public API is re-exported from [src/index.ts](src/index.ts). Key pieces:

- `makeAppConfig` ([src/core/makeAppConfig.ts](src/core/makeAppConfig.ts)) —
  builds the `AppConfig` (Cognito URLs, redirect, messages) consumers pass in.
- `BaseAppScope` ([src/BaseAppScope.tsx](src/BaseAppScope.tsx)) — top-level
  wrapper: mounts `InfrastructureProvider`, handles the auth-code redirect, and
  renders routes inside a `HashRouter`.
- `InfrastructureProvider` ([src/InfrastructureProvider.tsx](src/InfrastructureProvider.tsx)) —
  nests context providers in this order (outer→inner): Message → Spinner →
  AppConfig → User → DDB → Lambda. **Provider order matters**: DDB/Lambda depend
  on User; User depends on AppConfig.
- Hooks: `useUser`, `useDDB`, `useLambda`, `useMessage`, `useSpinner`,
  `useAppConfig`, `useAppBarState`, `useAppDrawerState`.
- `src/core/` holds **framework-agnostic** logic (auth token flows, config).
  Note: some functions carry a `SemDispatch` suffix ("sem dispatch" = Portuguese
  for "without dispatch") — keep naming consistent when editing.

### Auth flow notes

- Login uses a Cognito Identity Pool; supports anonymous login and OAuth
  authorization-code redirect.
- The refresh token is stored in `sessionStorage` under
  `appRefreshTokenStorageKey`.
- Tokens auto-refresh on a 25-minute interval (`REFRESH_TOKEN_INTERVAL` in
  [src/UserContext.tsx](src/UserContext.tsx)).
- `useAppConfig` throws if used outside `AppConfigProvider`.

## Code style

- Formatting is **oxfmt** and linting is **oxlint**, both with **default config**
  (no config files). Output is Prettier-style: **2-space indentation** and
  **double quotes**. Run `bun run format` to apply. `dist/` and `*.tsbuildinfo`
  are gitignored, so the Oxc tools skip them.
- TypeScript strict; prefer `type` aliases over `interface` (existing convention).
- Export hooks as `default` plus named provider exports (see existing contexts).
- Do not add new runtime dependencies; anything AWS/React-related belongs in
  `peerDependencies`, and must also be added to `rollupOptions.external` in
  [vite.config.ts](vite.config.ts).
- The React plugin is `@vitejs/plugin-react` v6, which on Vite 8 uses **Oxc**
  (no Babel) for JSX and Fast Refresh.

## MCP server tips

Two MCP servers are configured in [.vscode/mcp.json](.vscode/mcp.json):

- **context7** — use it to fetch up-to-date docs for AWS SDK v3, React 19, and
  `react-router` 8 before writing API code, since these libraries change
  often and training data may be stale.
- **chrome-devtools** — use it to run/inspect the demo app on
  `http://localhost:5000` (console, network, screenshots) when validating UI or
  debugging auth redirects.

## When changing the public API

- Update the exports in [src/index.ts](src/index.ts) and keep the demo
  ([demo/src](demo/src)) working as the reference usage example.
- Keep the README's usage instructions in sync if the consumer-facing API changes.

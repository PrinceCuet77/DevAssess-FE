# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Developer Assessment Platform frontend — a marketplace where evaluators publish paid technical assessments, developers buy and take them, and admins oversee the marketplace. Built with Next.js App Router (v16, React 19) and TypeScript. The codebase is an early scaffold: most pages/components currently exist as placeholder stubs (e.g. `LoginPage`, `LoginForm` just render a div), so expect to build out real implementations rather than find existing patterns to copy everywhere.

## Commands

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — run ESLint (flat config via `eslint.config.mjs`)

There is no test runner configured in this repo yet.

## Architecture

**Routing**: Next.js App Router with route groups splitting the app into three areas:
- `src/app/(public)/(marketing)/` — public marketing pages (home, about-us), with its own `layout.tsx`
- `src/app/(public)/(authentication)/` — login, register, account-verify pages
- `src/app/(dashboard)/` — authenticated app area, with its own `layout.tsx`

Route groups (parenthesized dirs) don't affect the URL path — they exist purely to scope layouts per section.

**Providers**: `src/providers/index.tsx` is the single client-side provider composition root, mounted in the root `layout.tsx`. Currently wraps just `QueryProvider` (`src/providers/query.provider.tsx`), which sets up a TanStack Query `QueryClient` using the server/browser singleton pattern (`environmentManager.isServer()` decides whether to create a fresh client per request or reuse a module-level browser client). Add new global client providers here rather than in the root layout directly.

**Data fetching**: `src/lib/apiClient.ts` exports an `ofetch` instance configured with `baseURL: process.env.NEXT_PUBLIC_API_BASE_URL` and `credentials: 'include'` (cookie-based auth against the backend API). Use this client for all HTTP calls instead of raw `fetch`. Combine with TanStack Query for data fetching/caching, `@tanstack/react-form` for forms, and `zod` for schema validation.

**UI components**: Uses shadcn (`components.json`, style `base-nova`, base color `mist`) built on `@base-ui/react` primitives, styled with Tailwind v4 and `class-variance-authority` for variants. Path aliases from `components.json`: `@/components`, `@/components/ui`, `@/lib`, `@/hooks`, with `cn` from the `cn` package (re-exported via `src/lib/utils.ts`) for class merging — not the typical clsx/tailwind-merge combo. Icons come from `lucide-react`. `src/app/globals.css` defines the full design token set (colors in OKLCH, radii, sidebar/chart tokens) for light/dark themes — extend tokens there rather than hardcoding colors in components.

**Path alias**: `@/*` maps to `src/*` (see `tsconfig.json`).

**React Compiler**: enabled via `babel-plugin-react-compiler` and `reactCompiler: true` in `next.config.ts` — avoid manual `useMemo`/`useCallback` micro-optimizations that fight the compiler.

**Env vars**: `NEXT_PUBLIC_API_BASE_URL` (backend API origin) and `NEXT_PUBLIC_GOOGLE_CLIENT_ID` (see `.env.example`). All client-exposed env vars must be prefixed `NEXT_PUBLIC_`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

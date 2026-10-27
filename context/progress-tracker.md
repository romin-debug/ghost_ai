# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Phase 1: Design system

## Current Goal

- Design system unit complete. Waiting on the next feature spec.

## Completed

- 01 Design system: shadcn/ui installed and configured (`components.json`, `lib/utils.ts`, `app/globals.css`). Added Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea in `components/ui/` (unmodified CLI output). `lucide-react` installed. `cn()` exported from `lib/utils.ts`. Dark-only theme: the ui-context palette is defined in `globals.css`, shadcn variables point to it, and `<html>` has the `dark` class. Verified that all components import and prerender (temporary route, since removed), `cn()` merges conflicting classes correctly, and no light palette remains in the compiled CSS. `tsc`, `eslint`, and `next build` pass.

## In Progress

- None.

## Next Up

- Add the next planned feature unit here.

## Open Questions

- None.

## Architecture Decisions

- shadcn/ui uses the CLI default `base-nova` style, built on Base UI (`@base-ui/react`), not Radix. Icons: `lucide-react`.
- Class merging uses shadcn's `cn` package (`lib/utils.ts` re-exports it) instead of `clsx` + `tailwind-merge`.
- `shadcn` is a runtime dependency because `globals.css` imports `shadcn/tailwind.css`, along with `tw-animate-css`.
- Theme is dark only. The `globals.css` `:root` holds the ui-context palette, shadcn's variables map onto it, and there is no light or `.dark` variant block. App token utilities are documented in `ui-context.md`.

## Session Notes

- `shadcn init` generated `--font-sans: var(--font-sans)` in `globals.css`, which refers to itself. It was fixed to `var(--font-geist-sans)`, and `--font-mono: var(--font-geist-mono)` was added, to match the `next/font` variables in `app/layout.tsx`.

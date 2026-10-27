# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Phase 2: Editor chrome

## Current Goal

- Editor chrome unit complete. Waiting on the next feature spec.

## Completed

- 01 Design system: shadcn/ui installed and configured (`components.json`, `lib/utils.ts`, `app/globals.css`). Added Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea in `components/ui/` (unmodified CLI output). `lucide-react` installed. `cn()` exported from `lib/utils.ts`. Dark-only theme: the ui-context palette is defined in `globals.css`, shadcn variables point to it, and `<html>` has the `dark` class. Verified that all components import and prerender (temporary route, since removed), `cn()` merges conflicting classes correctly, and no light palette remains in the compiled CSS. `tsc`, `eslint`, and `next build` pass.
- 02 Editor chrome (`context/feature-specs/02-editor-chrome.md`):
  - [x] `components/editor/editor-navbar.tsx`: `h-14` top bar with left/center/right sections, `bg-surface` with a `border-surface-border` bottom border. The left section has a ghost icon toggle that switches between `PanelLeftClose` and `PanelLeftOpen` and sets `aria-label` and `aria-expanded`. Center and right sections are empty. Props: `isSidebarOpen`, `onToggleSidebar`.
  - [x] `components/editor/project-sidebar.tsx`: `absolute` floating panel (`w-72`, `rounded-2xl`, `bg-surface/90` with backdrop blur) that slides in from the left using a transform transition. When closed it moves off-screen and is `inert`. Header with `Projects` title and close button, shadcn `Tabs` (My Projects / Shared) each with an icon and text empty state, and a full-width `New Project` button with a `Plus` icon at the bottom. Props: `isOpen`, `onClose`. The `New Project` button has no handler yet because project creation is not specced.
  - [x] Dialog pattern, `components/editor/editor-dialog.tsx`: `EditorDialog` wraps shadcn `Dialog` with token styling (`rounded-3xl`, `bg-elevated/95`, `ring-surface-border`, backdrop blur, `p-6`). Props: `open`, `onOpenChange`, `title`, optional `description`, optional `footer` (action buttons in the footer bar), and `children` for the body. No real dialogs built yet.
  - [x] Verified on a temporary route (since removed) that wired the navbar, sidebar, and dialog together. Both open and closed states prerender with the correct icon, ARIA attributes, `inert`, and transform. All custom token and opacity utilities appear in the compiled CSS. `tsc`, `eslint` (0 errors), and `next build` pass.

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
- Editor chrome components (`components/editor/*`) are controlled and stateless, with no `"use client"` directive. They take callback props, so they must be rendered from a client component that owns the sidebar and dialog state. The future editor shell will be that component.
- `ProjectSidebar` is positioned `absolute`. Render it inside the relatively positioned canvas area below the navbar so it overlays the canvas without covering the navbar toggle.
- App-specific dialog styling lives in `EditorDialog`, not in `components/ui/dialog.tsx`. `EditorDialog` disables the built-in close button and renders its own, because the built-in one is placed for the default radius and Base UI's `render` merge replaces its `data-slot`, so it can't be targeted from outside.

## Session Notes

- `shadcn init` generated `--font-sans: var(--font-sans)` in `globals.css`, which refers to itself. It was fixed to `var(--font-geist-sans)`, and `--font-mono: var(--font-geist-mono)` was added, to match the `next/font` variables in `app/layout.tsx`.

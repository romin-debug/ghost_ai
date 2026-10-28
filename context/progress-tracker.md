# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Phase 4: Project dialogs & editor home

## Current Goal

- Project dialogs unit complete. Waiting on the next feature spec.

## Completed

- 01 Design system: shadcn/ui installed and configured (`components.json`, `lib/utils.ts`, `app/globals.css`). Added Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea in `components/ui/` (unmodified CLI output). `lucide-react` installed. `cn()` exported from `lib/utils.ts`. Dark-only theme: the ui-context palette is defined in `globals.css`, shadcn variables point to it, and `<html>` has the `dark` class. Verified that all components import and prerender (temporary route, since removed), `cn()` merges conflicting classes correctly, and no light palette remains in the compiled CSS. `tsc`, `eslint`, and `next build` pass.
- 02 Editor chrome (`context/feature-specs/02-editor-chrome.md`):
  - [x] `components/editor/editor-navbar.tsx`: `h-14` top bar with left/center/right sections, `bg-surface` with a `border-surface-border` bottom border. The left section has a ghost icon toggle that switches between `PanelLeftClose` and `PanelLeftOpen` and sets `aria-label` and `aria-expanded`. Center and right sections are empty. Props: `isSidebarOpen`, `onToggleSidebar`.
  - [x] `components/editor/project-sidebar.tsx`: `absolute` floating panel (`w-72`, `rounded-2xl`, `bg-surface/90` with backdrop blur) that slides in from the left using a transform transition. When closed it moves off-screen and is `inert`. Header with `Projects` title and close button, shadcn `Tabs` (My Projects / Shared) each with an icon and text empty state, and a full-width `New Project` button with a `Plus` icon at the bottom. Props: `isOpen`, `onClose`. The `New Project` button has no handler yet because project creation is not specced.
  - [x] Dialog pattern, `components/editor/editor-dialog.tsx`: `EditorDialog` wraps shadcn `Dialog` with token styling (`rounded-3xl`, `bg-elevated/95`, `ring-surface-border`, backdrop blur, `p-6`). Props: `open`, `onOpenChange`, `title`, optional `description`, optional `footer` (action buttons in the footer bar), and `children` for the body. No real dialogs built yet.
  - [x] Verified on a temporary route (since removed) that wired the navbar, sidebar, and dialog together. Both open and closed states prerender with the correct icon, ARIA attributes, `inert`, and transform. All custom token and opacity utilities appear in the compiled CSS. `tsc`, `eslint` (0 errors), and `next build` pass.
- 03 Auth (`context/feature-specs/03-auth.md`):
  - [x] `@clerk/ui` installed (`@clerk/nextjs` was already present).
  - [x] `ClerkProvider` in `app/layout.tsx` wraps all app content inside `<body>` (Clerk v7 placement, keeps `<html>` static for Cache Components). It uses `authAppearance` from `lib/auth-appearance.ts`: Clerk's `dark` theme from `@clerk/ui/themes` as the base, with every color, font, and radius variable set to a `var(--…)` from `globals.css`. No hardcoded colors. Base `fontSize` is `0.875rem` to match the app's `text-sm` body size (Clerk's default is `0.8125rem`). The brand panel follows the type scale documented in `ui-context.md`. Verified against the dev server's compiled CSS: `html`, `.font-sans`, `.font-heading`, and Clerk's `--clerk-font-family` all resolve to Geist, and the Geist `woff2` files are served.
  - [x] `proxy.ts` at the project root: `clerkMiddleware` calls `auth.protect()` on every route except paths matching `NEXT_PUBLIC_CLERK_SIGN_IN_URL` / `NEXT_PUBLIC_CLERK_SIGN_UP_URL` (exact match or sub-path, so multi-step flows like `/sign-in/factor-one` stay public). Standard Clerk matcher, including `/(api|trpc)(.*)`.
  - [x] Auth pages in the `app/(auth)` route group: `sign-in/[[...sign-in]]` and `sign-up/[[...sign-up]]` render Clerk's `<SignIn />` / `<SignUp />` inside `<Suspense>`. The shared `(auth)/layout.tsx` is a 50/50 two-panel layout. On the left, `components/auth/auth-brand-panel.tsx` (`hidden lg:flex lg:w-1/2`, `bg-surface` with a right border to set it off from the `bg-base` form side) has the logo at the top, a headline + lead paragraph and three features in the middle, and a copyright line at the bottom. On the right, the Clerk form is centered. Small screens show the form only. No gradients or cards.
  - [x] Brand panel redesigned to match a user-provided reference screenshot. At the user's direction, this departs from the spec's "text-only feature list": each feature now has a small brand-tinted Lucide icon tile (`Sparkles`, `Share2`, `FileText`) with a title and a one-line description. The copyright year is hardcoded (`© 2026`) because `new Date()` in a prerendered Server Component breaks Cache Components builds.
  - [x] `/` (`app/page.tsx`): reads `auth()` behind `<Suspense>`. Authenticated users go to `/editor`, unauthenticated users go to sign-in via `redirectToSignIn()`.
  - [x] `/editor` (`app/editor/page.tsx`): calls `auth.protect()` behind `<Suspense>` and renders `components/editor/editor-shell.tsx`, a minimal client shell that owns sidebar state and renders `EditorNavbar` + `ProjectSidebar` over an empty canvas area. It was added so the `/` redirect target exists. No canvas yet.
  - [x] `EditorNavbar` right section renders Clerk's default `<UserButton />` (profile settings and sign-out, unmodified).
  - [x] Verified: `next build`, `tsc`, and `eslint` pass. Against `next start`, signed-out non-document requests to `/`, `/editor`, an unknown page, and `/api/test` all return 307 to `/sign-in?redirect_url=…`. `/sign-in`, `/sign-up`, `/sign-in/factor-one`, and `/sign-up/verify-email-address` return 200. The rendered sign-in page contains the brand panel. A grep of the new files found no hex/rgb/raw palette classes or gradients. The signed-in flow (`/` → `/editor`, `UserButton`) and the visual appearance of the Clerk form have not been checked in a browser yet.
- 04 Project dialogs & editor home (`context/feature-specs/04-project-dialogs.md`):
  - [x] `components/editor/editor-home.tsx`: centered in the canvas area with no card. It shows the heading `Create a project or open an existing one`, the description `Start a new architecture workspace, or choose a project from the sidebar.`, and a `New Project` button with a `Plus` icon that opens the Create dialog.
  - [x] Dialogs built on `EditorDialog`, each a submit-in-footer form (`type="submit"` with a `form` attribute, so Enter submits):
    - `create-project-dialog.tsx`: name input plus a live slug preview (`slugify()` from `lib/slug.ts`), recomputed on every keystroke. Submit is disabled while the slug is empty.
    - `rename-project-dialog.tsx`: input prefilled with the name. The description shows the current name. The input is focused on open through a new optional `initialFocus` prop on `EditorDialog` (Base UI otherwise focuses the popup itself when a dialog is opened by touch). Submit is disabled when the name is empty or unchanged.
    - `delete-project-dialog.tsx`: confirmation only, no input. The confirm button uses `variant="destructive"`.
  - [x] `hooks/use-project-dialogs.ts` manages dialog state (`activeDialog` plus `targetProject`, which is kept after close so content doesn't blank out during the exit animation), form state (`name`, derived `slug`), and loading state (`isSubmitting`, which disables inputs and buttons and blocks close). Create, rename, and delete change an in-memory copy of `lib/mock-projects.ts` only. Changes reset on reload. No API calls or persistence.
  - [x] `ProjectSidebar` lists projects in tabs: My Projects shows `role: "owner"` and Shared shows `role: "collaborator"`. Owned items have Rename (`Pencil`) and Delete (`Trash2`) icon buttons with per-project `aria-label`s. They are always visible on touch and revealed on hover or focus with a fine pointer (`pointer-fine:`). Shared items get no handlers, so they have no actions. The sidebar `New Project` button opens the Create dialog. Below `md`, a `bg-base/60` scrim covers the canvas area behind the open sidebar, and tapping it closes the sidebar. Navbar and toggle behavior are unchanged.
  - [x] Wiring in `editor-shell.tsx`: editor home and sidebar `New Project` open Create, sidebar rename opens Rename, and sidebar delete opens Delete.
  - [x] Verified: `tsc`, `eslint` (0 errors; the one warning is in a vendored `.agents/skills` template), and `next build` pass. `slugify` checked against sample names (`"My API v2"` → `my-api-v2`, accents stripped, symbol-only names → empty). A temporary prerendered route (since removed) rendered the home copy and Rename/Delete buttons for the owned mock projects. New utilities (`pointer-fine:*`, `bg-base/60`, `md:hidden`, `hover:text-error`) appear in the compiled CSS. Dialog interactions (typing, Enter submit, focus, scrim tap) have not been checked in a browser yet.

## In Progress

- None.

## Next Up

- Add the next planned feature unit here.

## Open Questions

- The auth spec referenced "existing" sign-in/sign-up env vars, but `.env.local` only had the publishable and secret keys. Clerk's standard `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in` and `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up` were added to `.env.local`. They must also be set in any deployment environment.
- Project slugs: the slug is generated at creation and not changed on rename, because the rename dialog has no slug preview. Slug uniqueness and opening a project from the sidebar (there is no project route yet) are not specced. Sidebar items are plain text for now.
- Root `metadata` in `app/layout.tsx` is still the create-next-app placeholder ("Create Next App"). App title and description are not specced yet.

## Architecture Decisions

- shadcn/ui uses the CLI default `base-nova` style, built on Base UI (`@base-ui/react`), not Radix. Icons: `lucide-react`.
- Class merging uses shadcn's `cn` package (`lib/utils.ts` re-exports it) instead of `clsx` + `tailwind-merge`.
- `shadcn` is a runtime dependency because `globals.css` imports `shadcn/tailwind.css`, along with `tw-animate-css`.
- Theme is dark only. The `globals.css` `:root` holds the ui-context palette, shadcn's variables map onto it, and there is no light or `.dark` variant block. App token utilities are documented in `ui-context.md`.
- Editor chrome components (`components/editor/*`) are controlled and stateless, with no `"use client"` directive. They take callback props, so they must be rendered from a client component that owns the sidebar and dialog state. `components/editor/editor-shell.tsx` is that component.
- `ProjectSidebar` is positioned `absolute`. Render it inside the relatively positioned canvas area below the navbar so it overlays the canvas without covering the navbar toggle.
- Route protection is default-deny in `proxy.ts` without `createRouteMatcher`, which is deprecated in `@clerk/nextjs` 7. Public routes are derived only from the Clerk sign-in/sign-up URL env vars. Following Clerk v7 guidance, each protected page also checks auth itself (`auth.protect()` / `auth()`), and future Route Handlers and Server Actions must do the same.
- `cacheComponents` is on, so any `auth()` / `auth.protect()` read and the catch-all `<SignIn />` / `<SignUp />` pages sit inside `<Suspense>`. Otherwise `next build` fails on request data outside a boundary.
- Clerk appearance lives in `lib/auth-appearance.ts`. Clerk accepts `var(--…)` values for its color variables (it derives shades with `color-mix`), so the app palette is referenced directly instead of copied.
- App-specific dialog styling lives in `EditorDialog`, not in `components/ui/dialog.tsx`. `EditorDialog` disables the built-in close button and renders its own, because the built-in one is placed for the default radius and Base UI's `render` merge replaces its `data-slot`, so it can't be targeted from outside.
- Client hooks live in `hooks/` (the shadcn `@/hooks` alias) and shared domain types in `types/` (`types/project.ts`). Mock data lives in `lib/mock-projects.ts` until persistence is added.
- Project ownership is modeled on the client as `Project.role` (`"owner" | "collaborator"`), the current user's relationship to the project. Owner-only UI (rename and delete actions) keys off this field. Server-side ownership checks are still required once mutations hit the API.

## Session Notes

- `shadcn init` generated `--font-sans: var(--font-sans)` in `globals.css`, which refers to itself. It was fixed to `var(--font-geist-sans)`, and `--font-mono: var(--font-geist-mono)` was added, to match the `next/font` variables in `app/layout.tsx`.

# UI Context

## Theme

Dark only. No light mode. The visual language is a dark technical workspace — near-black backgrounds, layered surfaces, and vivid accent colors for interactive elements.

All colors are defined as CSS custom properties in `globals.css` and mapped to Tailwind tokens via `@theme inline`. Components must use these tokens — no hardcoded hex values or raw Tailwind color classes like `zinc-*`.

| Role             | CSS Variable           | Hex / Value               |
| ---------------- | ---------------------- | ------------------------- |
| Page background  | `--bg-base`            | `#080809`                 |
| Surface          | `--bg-surface`         | `#111114`                 |
| Elevated surface | `--bg-elevated`        | `#18181c`                 |
| Subtle surface   | `--bg-subtle`          | `#1e1e23`                 |
| Default border   | `--border-default`     | `#2a2a30`                 |
| Subtle border    | `--border-subtle`      | `#3a3a42`                 |
| Primary text     | `--text-primary`       | `#f0f0f4`                 |
| Secondary text   | `--text-secondary`     | `#c0c0cc`                 |
| Muted text       | `--text-muted`         | `#808090`                 |
| Faint text       | `--text-faint`         | `#505060`                 |
| Brand accent     | `--accent-primary`     | `#00c8d4` (cyan)          |
| Brand dim        | `--accent-primary-dim` | `rgba(0, 200, 212, 0.12)` |
| AI accent        | `--accent-ai`          | `#6457f9` (indigo-purple) |
| AI text          | `--accent-ai-text`     | `#8b82ff`                 |
| Error            | `--state-error`        | `#ff4d4f`                 |
| Success          | `--state-success`      | `#34d399`                 |
| Warning          | `--state-warning`      | `#fbbf24`                 |

Tailwind utility names map to these variables. Use `bg-base`, `bg-surface`, `text-copy-primary`, `text-copy-muted`, `border-surface-border`, `text-brand`, `bg-accent-dim`, etc.

| Utility suffix                                                 | Variable                                    | Available as                                     |
| -------------------------------------------------------------- | ------------------------------------------- | ------------------------------------------------ |
| `base`, `surface`, `elevated`, `subtle`, `accent-dim`          | `--bg-*`, `--accent-primary-dim`            | `bg-*` only (so `base` doesn't clash with `text-base`) |
| `surface-border`, `surface-border-subtle`                      | `--border-default`, `--border-subtle`       | any color utility (`border-*`, `ring-*`, …)      |
| `copy-primary`, `copy-secondary`, `copy-muted`, `copy-faint`   | `--text-*`                                  | any color utility                                |
| `brand`, `ai`, `ai-text`                                       | `--accent-primary`, `--accent-ai`, `--accent-ai-text` | any color utility                      |
| `error`, `success`, `warning`                                  | `--state-*`                                 | any color utility                                |

shadcn/ui's variables (`--background`, `--card`, `--primary`, `--border`, etc.) are mapped onto this palette in `globals.css`, so the generated `components/ui/*` files pick up the theme without being edited. The `<html>` element always has the `dark` class so shadcn's `dark:` variants apply.

## Typography

| Role      | Font       | CSS Variable        |
| --------- | ---------- | ------------------- |
| UI text   | Geist Sans | `--font-geist-sans` |
| Code/mono | Geist Mono | `--font-geist-mono` |

Both fonts are loaded via `next/font/google` and applied as CSS variables on the `<html>` element. The base `body` uses Geist Sans with `antialiased`.

Type scale follows the shadcn defaults inside the app: body and UI text is `text-sm`, titles are `font-heading text-base font-medium`, and `font-medium` is used for emphasis. The display exceptions are the auth brand panel headline (`font-heading text-4xl font-semibold tracking-tight`, with a `text-lg` lead paragraph) and the workspace canvas placeholder heading (`font-heading text-2xl font-medium tracking-tight`). Small uppercase eyebrow labels use `text-xs font-medium tracking-[0.2em] uppercase text-copy-faint`. Clerk components use the same family and a `0.875rem` base size (matching `text-sm`) via `lib/auth-appearance.ts`.

## Border Radius

Radius increases with surface depth — smaller for inner elements, larger for outer containers.

| Context           | Class         |
| ----------------- | ------------- |
| Inline / small UI | `rounded-xl`  |
| Cards / panels    | `rounded-2xl` |
| Modal / overlay   | `rounded-3xl` |

## Canvas

### Node Color Palette

8 defined color pairs. Each pair specifies a dark node fill and a vivid contrasting text color tuned for readability on the dark canvas. Defined in `types/canvas.ts` as `NODE_COLORS`.

| Node fill | Text color | Character              |
| --------- | ---------- | ---------------------- |
| `#1F1F1F` | `#EDEDED`  | Neutral dark (default) |
| `#10233D` | `#52A8FF`  | Blue                   |
| `#2E1938` | `#BF7AF0`  | Purple                 |
| `#331B00` | `#FF990A`  | Orange                 |
| `#3C1618` | `#FF6166`  | Red                    |
| `#3A1726` | `#F75F8F`  | Pink                   |
| `#0F2E18` | `#62C073`  | Green                  |
| `#062822` | `#0AC7B4`  | Teal                   |

Default node color: `#1F1F1F` with `#EDEDED` text.

### Edge Style

Smooth-step path with an arrow marker. Default edge color: `#f8fafc`. Stroke width is thin — edges are visually secondary to nodes.

### Node Shapes

6 supported shapes, defined in `types/canvas.ts` as `NODE_SHAPES`. Complex shapes (diamond, hexagon, cylinder) are rendered as inline SVGs rather than CSS borders.

- `rectangle` — default general-purpose node
- `diamond` — decision / gateway
- `circle` — event / endpoint
- `pill` — service / process
- `cylinder` — database / storage
- `hexagon` — external system / boundary

### Connection Handles

Small white circular handles, hidden by default, revealed on node hover. Appear at all four sides of a node.

### Canvas Background

React Flow `<Background>` component. Canvas sits on the base background color.

## Component Library

shadcn/ui on top of Tailwind. No custom design system. Components live in `components/ui/`. Use the `shadcn` CLI to add new components rather than writing them from scratch.

## Layout Patterns

- Editor workspace: full-viewport layout — project sidebar on the left, center canvas, slide-over AI sidebar on the right. The canvas is a bordered `rounded-2xl` panel inset `3` from the navbar and edges. From `lg`, it shrinks to make room for whichever sidebars are open, so the three panels sit side by side with a `3` gap. Below `lg`, the sidebars float over the canvas. The navbar shows the project name with a `Workspace` subtitle next to the sidebar toggle. Its right side has `Share` and an `AI` toggle, which is filled brand while the AI sidebar is open.
- Active list items (e.g. the current room in the project sidebar): `border-brand/25 bg-accent-dim`, `text-copy-primary`, and a small `bg-brand` dot. Project sidebar items link to `/editor/{id}`. The link fills the row beside the action buttons.
- Sidebars: floating overlay with dark semi-transparent background and subtle border.
- Modals and dialogs: centered overlay, `rounded-3xl`, dark background with backdrop blur.
- Share dialog (`sm:max-w-lg`, no footer):
  - A full-width divider sits below the header.
  - Owners see two `rounded-2xl border-surface-border bg-surface/60` cards: a `Workspace link` card with an outline `Copy link` button that shows `Copied!` for 2 seconds, and an invite card with an email input (inline `Mail` icon, `h-10 rounded-xl`) and a brand `Invite` button.
  - Below them is `People with access` with an `N total` count, then one card row per person: an `lg` shadcn `Avatar` (Clerk image, `User` icon fallback on `bg-ai/20`), the name (the email if there's no Clerk name), a role pill, the email below, and a red `Trash2` remove button (owner viewing, collaborator rows only).
  - Role pills are `rounded-full border text-[0.625rem] tracking-[0.2em] uppercase`: owner `border-brand/30 bg-accent-dim text-brand`, collaborator `border-surface-border text-copy-muted`.
  - Collaborators see only the people list.
- Navbar: top bar with dark background and bottom border.

## Icons

Lucide React. Stroke-based icons only — no filled variants. Icon sizes: `h-4 w-4` for inline, `h-5 w-5` for buttons, `h-8 w-8` for feature icons in empty states.

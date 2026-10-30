import { Compass } from "lucide-react"

/**
 * Stands in for the collaborative canvas, which is not built yet. Fills its
 * container as a bordered panel.
 */
export function CanvasPlaceholder() {
  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden rounded-2xl border border-surface-border bg-surface px-6 text-center">
      {/* Faint grid with a brand glow at the top and an AI glow bottom right. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_right,var(--border-default)_1px,transparent_1px),linear-gradient(to_bottom,var(--border-default)_1px,transparent_1px)] bg-size-[64px_64px] opacity-30"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--accent-primary-dim),transparent_55%),radial-gradient(circle_at_bottom_right,color-mix(in_oklab,var(--accent-ai)_12%,transparent),transparent_40%)]"
      />

      <div className="relative flex max-w-xl flex-col items-center gap-4">
        <div className="flex size-16 items-center justify-center rounded-2xl border border-surface-border bg-elevated">
          <Compass className="size-8 text-brand" />
        </div>
        <p className="text-xs font-medium tracking-[0.2em] text-copy-faint uppercase">
          Workspace shell
        </p>
        <h2 className="font-heading text-2xl font-medium tracking-tight text-balance text-copy-primary">
          Canvas and collaboration tooling land here next.
        </h2>
        <p className="max-w-lg text-sm leading-relaxed text-copy-muted">
          This room is ready for the shared architecture canvas, durable AI
          workflows, and real-time presence. For now, the shell is wired with
          project context and navigation only.
        </p>
      </div>
    </div>
  )
}

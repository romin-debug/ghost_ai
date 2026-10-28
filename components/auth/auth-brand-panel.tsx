import { FileText, Ghost, Share2, Sparkles, type LucideIcon } from "lucide-react"

interface Feature {
  icon: LucideIcon
  title: string
  description: string
}

const FEATURES: Feature[] = [
  {
    icon: Sparkles,
    title: "AI Architecture Generation",
    description:
      "Describe your system, AI maps it to nodes and edges on a live canvas.",
  },
  {
    icon: Share2,
    title: "Real-time Collaboration",
    description:
      "Live cursors, presence indicators, and shared node editing across your team.",
  },
  {
    icon: FileText,
    title: "Instant Spec Generation",
    description:
      "Export a complete Markdown technical spec directly from the canvas graph.",
  },
]

export function AuthBrandPanel() {
  return (
    <aside className="hidden shrink-0 flex-col justify-between border-r border-surface-border bg-surface p-12 lg:flex lg:w-1/2">
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-xl bg-brand text-primary-foreground">
          <Ghost className="size-5" />
        </div>
        <span className="font-heading text-lg font-medium text-copy-primary">
          Ghost AI
        </span>
      </div>

      <div className="max-w-xl">
        <h1 className="max-w-md font-heading text-4xl leading-tight font-semibold tracking-tight text-copy-primary">
          Design systems at the speed of thought.
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-copy-muted">
          Describe your architecture in plain English. Ghost AI maps it to a
          shared canvas your whole team can refine in real time.
        </p>
        <ul className="mt-12 space-y-8">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <li key={title} className="flex gap-5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-surface-border bg-accent-dim text-brand">
                <Icon className="size-4" />
              </div>
              <div>
                <p className="text-base font-medium text-copy-primary">
                  {title}
                </p>
                <p className="mt-1 text-sm text-copy-muted">{description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-sm text-copy-faint">
        © 2026 Ghost AI. All rights reserved.
      </p>
    </aside>
  )
}

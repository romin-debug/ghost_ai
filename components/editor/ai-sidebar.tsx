import { Bot, Sparkles } from "lucide-react"

import { cn } from "@/lib/utils"

interface AiSidebarProps {
  isOpen: boolean
}

/**
 * Placeholder for the AI chat, toggled from the navbar. Floating overlay on the
 * right — render inside the relatively positioned canvas area, like
 * `ProjectSidebar`.
 */
export function AiSidebar({ isOpen }: AiSidebarProps) {
  return (
    <aside
      aria-label="AI Copilot"
      inert={!isOpen}
      className={cn(
        "absolute inset-y-3 right-3 z-40 flex w-80 flex-col rounded-2xl border border-surface-border bg-surface/90 backdrop-blur-md transition-transform duration-200 ease-out",
        isOpen ? "translate-x-0" : "translate-x-[calc(100%+0.75rem)]"
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-surface-border px-5 py-4">
        <div className="flex flex-col">
          <h2 className="text-sm font-medium text-copy-primary">AI Copilot</h2>
          <p className="text-xs text-copy-muted">Placeholder panel</p>
        </div>
        <Sparkles className="size-5 text-ai-text" />
      </div>

      <div className="flex min-h-0 flex-1 flex-col justify-between gap-4 p-4">
        <div className="flex gap-3 rounded-2xl border border-surface-border bg-elevated/60 p-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-ai/15">
            <Bot className="size-5 text-ai-text" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-medium text-copy-primary">
              Chat surface pending
            </h3>
            <p className="text-xs leading-relaxed text-copy-muted">
              The toggle is wired. Messaging and generation are intentionally
              out of scope here.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 rounded-2xl border border-dashed border-surface-border p-4">
          <p className="text-xs font-medium tracking-[0.2em] text-copy-faint uppercase">
            Future hooks
          </p>
          <p className="text-sm leading-relaxed text-copy-muted">
            Prompt composer, run status, and architecture guidance will attach
            to this sidebar.
          </p>
        </div>
      </div>
    </aside>
  )
}

import type { ReactNode } from "react"
import { UserButton } from "@clerk/nextjs"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"

import { Button } from "@/components/ui/button"

interface EditorNavbarProps {
  isSidebarOpen: boolean
  onToggleSidebar: () => void
  /** The open workspace's project name, shown next to the sidebar toggle. */
  projectName?: string
  /** Extra controls, rendered before the user button. */
  actions?: ReactNode
}

export function EditorNavbar({
  isSidebarOpen,
  onToggleSidebar,
  projectName,
  actions,
}: EditorNavbarProps) {
  const SidebarIcon = isSidebarOpen ? PanelLeftClose : PanelLeftOpen

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-surface-border bg-surface px-3">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          aria-expanded={isSidebarOpen}
          onClick={onToggleSidebar}
        >
          <SidebarIcon className="size-5" />
        </Button>
        {projectName && (
          <div className="flex min-w-0 flex-col">
            <h1 className="truncate text-sm font-medium text-copy-primary">
              {projectName}
            </h1>
            <p className="text-xs text-copy-muted">Workspace</p>
          </div>
        )}
      </div>
      <div className="flex shrink-0 items-center justify-end gap-2">
        {actions}
        <UserButton />
      </div>
    </header>
  )
}

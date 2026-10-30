import { Share2, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"

interface WorkspaceActionsProps {
  onShare: () => void
  isAiSidebarOpen: boolean
  onToggleAiSidebar: () => void
}

/** Workspace navbar controls. */
export function WorkspaceActions({
  onShare,
  isAiSidebarOpen,
  onToggleAiSidebar,
}: WorkspaceActionsProps) {
  return (
    <>
      <Button variant="outline" onClick={onShare}>
        <Share2 className="size-4" data-icon="inline-start" />
        Share
      </Button>
      <Button
        variant={isAiSidebarOpen ? "default" : "outline"}
        aria-expanded={isAiSidebarOpen}
        onClick={onToggleAiSidebar}
      >
        <Sparkles className="size-4" data-icon="inline-start" />
        AI
      </Button>
    </>
  )
}

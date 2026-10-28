import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

interface EditorHomeProps {
  onCreateProject: () => void
}

/** Empty state shown in the canvas area when no project is open. */
export function EditorHome({ onCreateProject }: EditorHomeProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex max-w-sm flex-col gap-2">
        <h1 className="font-heading text-base font-medium text-copy-primary">
          Create a project or open an existing one
        </h1>
        <p className="text-sm text-copy-muted">
          Start a new architecture workspace, or choose a project from the
          sidebar.
        </p>
      </div>
      <Button size="lg" onClick={onCreateProject}>
        <Plus className="size-4" data-icon="inline-start" />
        New Project
      </Button>
    </div>
  )
}

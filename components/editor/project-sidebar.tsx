import type { LucideIcon } from "lucide-react"
import { FolderOpen, Plus, Users, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface ProjectSidebarProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * Floating overlay — render inside the relatively positioned canvas area so it
 * sits over the canvas without pushing content.
 */
export function ProjectSidebar({ isOpen, onClose }: ProjectSidebarProps) {
  return (
    <aside
      aria-label="Projects"
      inert={!isOpen}
      className={cn(
        "absolute inset-y-3 left-3 z-40 flex w-72 flex-col rounded-2xl border border-surface-border bg-surface/90 backdrop-blur-md transition-transform duration-200 ease-out",
        isOpen ? "translate-x-0" : "-translate-x-[calc(100%+0.75rem)]"
      )}
    >
      <div className="flex items-center justify-between border-b border-surface-border px-4 py-3">
        <h2 className="text-sm font-medium text-copy-primary">Projects</h2>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Close sidebar"
          onClick={onClose}
        >
          <X className="size-5" />
        </Button>
      </div>

      <Tabs defaultValue="my-projects" className="min-h-0 flex-1 p-3">
        <TabsList className="w-full">
          <TabsTrigger value="my-projects">My Projects</TabsTrigger>
          <TabsTrigger value="shared">Shared</TabsTrigger>
        </TabsList>
        <TabsContent value="my-projects">
          <EmptyState icon={FolderOpen} message="No projects yet" />
        </TabsContent>
        <TabsContent value="shared">
          <EmptyState icon={Users} message="No shared projects yet" />
        </TabsContent>
      </Tabs>

      <div className="border-t border-surface-border p-3">
        <Button size="lg" className="w-full">
          <Plus className="size-4" data-icon="inline-start" />
          New Project
        </Button>
      </div>
    </aside>
  )
}

interface EmptyStateProps {
  icon: LucideIcon
  message: string
}

function EmptyState({ icon: Icon, message }: EmptyStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 py-12 text-center">
      <Icon className="size-8 text-copy-faint" />
      <p className="text-sm text-copy-muted">{message}</p>
    </div>
  )
}

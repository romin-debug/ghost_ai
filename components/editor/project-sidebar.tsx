import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { FolderOpen, Pencil, Plus, Trash2, Users, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { EditorProjects, Project } from "@/types/project"

interface ProjectSidebarProps extends EditorProjects {
  isOpen: boolean
  onClose: () => void
  /** The open workspace's project ID, highlighted in the lists. */
  activeProjectId?: string
  onCreateProject: () => void
  onRenameProject: (project: Project) => void
  onDeleteProject: (project: Project) => void
}

/**
 * Floating overlay — render inside the relatively positioned canvas area so it
 * sits over the canvas without pushing content.
 */
export function ProjectSidebar({
  isOpen,
  onClose,
  ownedProjects,
  sharedProjects,
  activeProjectId,
  onCreateProject,
  onRenameProject,
  onDeleteProject,
}: ProjectSidebarProps) {
  // Open on the tab that contains the current room so its highlight is visible.
  const defaultTab = sharedProjects.some(
    (project) => project.id === activeProjectId
  )
    ? "shared"
    : "my-projects"

  return (
    <>
      {/* Mobile only: dims the canvas and closes the sidebar on tap. */}
      <div
        aria-hidden
        onClick={onClose}
        className={cn(
          "absolute inset-0 z-30 bg-base/60 transition-opacity duration-200 md:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />
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

        <Tabs defaultValue={defaultTab} className="min-h-0 flex-1 p-3">
          <TabsList className="w-full">
            <TabsTrigger value="my-projects">My Projects</TabsTrigger>
            <TabsTrigger value="shared">Shared</TabsTrigger>
          </TabsList>
          <TabsContent value="my-projects" className="min-h-0">
            {ownedProjects.length > 0 ? (
              <ProjectList
                projects={ownedProjects}
                activeProjectId={activeProjectId}
                onRenameProject={onRenameProject}
                onDeleteProject={onDeleteProject}
              />
            ) : (
              <EmptyState icon={FolderOpen} message="No projects yet" />
            )}
          </TabsContent>
          <TabsContent value="shared" className="min-h-0">
            {sharedProjects.length > 0 ? (
              <ProjectList
                projects={sharedProjects}
                activeProjectId={activeProjectId}
              />
            ) : (
              <EmptyState icon={Users} message="No shared projects yet" />
            )}
          </TabsContent>
        </Tabs>

        <div className="border-t border-surface-border p-3">
          <Button size="lg" className="w-full" onClick={onCreateProject}>
            <Plus className="size-4" data-icon="inline-start" />
            New Project
          </Button>
        </div>
      </aside>
    </>
  )
}

interface ProjectListProps {
  projects: Project[]
  activeProjectId?: string
  /** Omit both handlers to hide item actions, as for shared projects. */
  onRenameProject?: (project: Project) => void
  onDeleteProject?: (project: Project) => void
}

function ProjectList({
  projects,
  activeProjectId,
  onRenameProject,
  onDeleteProject,
}: ProjectListProps) {
  return (
    <ScrollArea className="h-full">
      <ul className="flex flex-col gap-0.5">
        {projects.map((project) => {
          const isActive = project.id === activeProjectId

          return (
            <li
              key={project.id}
              className={cn(
                "group flex h-10 items-center gap-1 rounded-xl border border-transparent pr-1 hover:bg-subtle",
                isActive && "border-brand/25 bg-accent-dim hover:bg-accent-dim"
              )}
            >
              {/* Sibling of the action buttons, which can't nest inside a link. */}
              <Link
                href={`/editor/${encodeURIComponent(project.id)}`}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex h-full min-w-0 flex-1 items-center gap-2 rounded-xl pl-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  isActive
                    ? "text-copy-primary"
                    : "text-copy-secondary hover:text-copy-primary"
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "size-1.5 shrink-0 rounded-full",
                    isActive ? "bg-brand" : "bg-transparent"
                  )}
                />
                <span className="truncate">{project.name}</span>
              </Link>
              {/* Always visible on touch; revealed on hover or focus with a mouse. */}
              <div className="flex shrink-0 items-center pointer-fine:opacity-0 pointer-fine:group-focus-within:opacity-100 pointer-fine:group-hover:opacity-100">
                {onRenameProject && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Rename ${project.name}`}
                    onClick={() => onRenameProject(project)}
                  >
                    <Pencil className="size-4" />
                  </Button>
                )}
                {onDeleteProject && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Delete ${project.name}`}
                    className="hover:text-error"
                    onClick={() => onDeleteProject(project)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </ScrollArea>
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

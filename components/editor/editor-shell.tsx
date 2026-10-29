"use client"

import { useState } from "react"

import { CreateProjectDialog } from "@/components/editor/create-project-dialog"
import { DeleteProjectDialog } from "@/components/editor/delete-project-dialog"
import { EditorHome } from "@/components/editor/editor-home"
import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { RenameProjectDialog } from "@/components/editor/rename-project-dialog"
import { useProjectActions } from "@/hooks/use-project-actions"
import type { EditorProjects } from "@/types/project"

interface EditorShellProps extends EditorProjects {
  /** The open workspace's project ID. Omit on the editor home. */
  activeProjectId?: string
}

export function EditorShell({
  ownedProjects,
  sharedProjects,
  activeProjectId,
}: EditorShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const dialogs = useProjectActions({ activeProjectId })

  function handleOpenChange(open: boolean) {
    if (!open) dialogs.closeDialog()
  }

  return (
    <div className="flex h-screen flex-col bg-base">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
      />
      <main className="relative flex-1 overflow-hidden">
        {/* The workspace canvas is not built yet, so a workspace renders empty. */}
        {!activeProjectId && (
          <EditorHome onCreateProject={dialogs.openCreateDialog} />
        )}
        <ProjectSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          ownedProjects={ownedProjects}
          sharedProjects={sharedProjects}
          onCreateProject={dialogs.openCreateDialog}
          onRenameProject={dialogs.openRenameDialog}
          onDeleteProject={dialogs.openDeleteDialog}
        />
      </main>

      <CreateProjectDialog
        open={dialogs.activeDialog === "create"}
        onOpenChange={handleOpenChange}
        name={dialogs.name}
        onNameChange={dialogs.setName}
        roomId={dialogs.roomId}
        canSubmit={dialogs.canCreate}
        isSubmitting={dialogs.isSubmitting}
        error={dialogs.error}
        onSubmit={dialogs.createProject}
      />
      <RenameProjectDialog
        open={dialogs.activeDialog === "rename"}
        onOpenChange={handleOpenChange}
        currentName={dialogs.targetProject?.name ?? ""}
        name={dialogs.name}
        onNameChange={dialogs.setName}
        canSubmit={dialogs.canRename}
        isSubmitting={dialogs.isSubmitting}
        error={dialogs.error}
        onSubmit={dialogs.renameProject}
      />
      <DeleteProjectDialog
        open={dialogs.activeDialog === "delete"}
        onOpenChange={handleOpenChange}
        projectName={dialogs.targetProject?.name ?? ""}
        isSubmitting={dialogs.isSubmitting}
        error={dialogs.error}
        onConfirm={dialogs.deleteProject}
      />
    </div>
  )
}

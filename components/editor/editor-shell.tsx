"use client"

import { useState } from "react"

import { CreateProjectDialog } from "@/components/editor/create-project-dialog"
import { DeleteProjectDialog } from "@/components/editor/delete-project-dialog"
import { EditorHome } from "@/components/editor/editor-home"
import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { RenameProjectDialog } from "@/components/editor/rename-project-dialog"
import { useProjectDialogs } from "@/hooks/use-project-dialogs"

export function EditorShell() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const dialogs = useProjectDialogs()

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
        <EditorHome onCreateProject={dialogs.openCreateDialog} />
        <ProjectSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          projects={dialogs.projects}
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
        slug={dialogs.slug}
        canSubmit={dialogs.canCreate}
        isSubmitting={dialogs.isSubmitting}
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
        onSubmit={dialogs.renameProject}
      />
      <DeleteProjectDialog
        open={dialogs.activeDialog === "delete"}
        onOpenChange={handleOpenChange}
        projectName={dialogs.targetProject?.name ?? ""}
        isSubmitting={dialogs.isSubmitting}
        onConfirm={dialogs.deleteProject}
      />
    </div>
  )
}

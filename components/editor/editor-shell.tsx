"use client"

import { useState } from "react"

import { AiSidebar } from "@/components/editor/ai-sidebar"
import { CanvasPlaceholder } from "@/components/editor/canvas-placeholder"
import { CreateProjectDialog } from "@/components/editor/create-project-dialog"
import { DeleteProjectDialog } from "@/components/editor/delete-project-dialog"
import { EditorHome } from "@/components/editor/editor-home"
import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { RenameProjectDialog } from "@/components/editor/rename-project-dialog"
import { ShareDialog } from "@/components/editor/share-dialog"
import { WorkspaceActions } from "@/components/editor/workspace-actions"
import { useProjectActions } from "@/hooks/use-project-actions"
import { useShareDialog } from "@/hooks/use-share-dialog"
import { cn } from "@/lib/utils"
import type { EditorProjects, ProjectMembership } from "@/types/project"

interface EditorShellProps extends EditorProjects {
  /** The open workspace's project and the user's role. Omit on the editor home. */
  workspace?: ProjectMembership
}

export function EditorShell({
  ownedProjects,
  sharedProjects,
  workspace,
}: EditorShellProps) {
  const activeProject = workspace?.project
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(false)
  const dialogs = useProjectActions({ activeProjectId: activeProject?.id })
  const share = useShareDialog(activeProject?.id)

  function handleOpenChange(open: boolean) {
    if (!open) dialogs.closeDialog()
  }

  return (
    <div className="flex h-screen flex-col bg-base">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
        projectName={activeProject?.name}
        actions={
          activeProject && (
            <WorkspaceActions
              onShare={share.openShareDialog}
              isAiSidebarOpen={isAiSidebarOpen}
              onToggleAiSidebar={() => setIsAiSidebarOpen((open) => !open)}
            />
          )
        }
      />
      <main className="relative flex-1 overflow-hidden">
        {activeProject ? (
          // From `lg` the canvas makes room for open sidebars; below that
          // they float over it.
          <div
            className={cn(
              "absolute inset-3 transition-[left,right] duration-200 ease-out",
              isSidebarOpen && "lg:left-78",
              isAiSidebarOpen && "lg:right-86"
            )}
          >
            <CanvasPlaceholder />
          </div>
        ) : (
          <EditorHome onCreateProject={dialogs.openCreateDialog} />
        )}
        <ProjectSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          ownedProjects={ownedProjects}
          sharedProjects={sharedProjects}
          activeProjectId={activeProject?.id}
          onCreateProject={dialogs.openCreateDialog}
          onRenameProject={dialogs.openRenameDialog}
          onDeleteProject={dialogs.openDeleteDialog}
        />
        {activeProject && <AiSidebar isOpen={isAiSidebarOpen} />}
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
      {workspace && (
        <ShareDialog
          open={share.isOpen}
          onOpenChange={(open) => {
            if (!open) share.closeShareDialog()
          }}
          canManage={workspace.role === "owner"}
          owner={share.owner}
          collaborators={share.collaborators}
          isLoading={share.isLoading}
          email={share.email}
          onEmailChange={share.setEmail}
          canInvite={share.canInvite}
          isInviting={share.isInviting}
          removingId={share.removingId}
          error={share.error}
          isCopied={share.isCopied}
          onInvite={share.inviteCollaborator}
          onRemove={share.removeCollaborator}
          onCopyLink={share.copyProjectLink}
        />
      )}
    </div>
  )
}

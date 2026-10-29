import { useState } from "react"
import { useRouter } from "next/navigation"

import { readApiError } from "@/lib/api"
import { createProjectIdSuffix, toProjectId } from "@/lib/project-id"
import type { Project } from "@/types/project"

export type ProjectDialogType = "create" | "rename" | "delete"

const NETWORK_ERROR = "Couldn’t reach the server. Check your connection."

interface UseProjectActionsOptions {
  /** The open workspace, if any. Deleting it redirects to `/editor`. */
  activeProjectId?: string
}

/**
 * Dialog, form, and request state for creating, renaming, and deleting
 * projects through the project API.
 */
export function useProjectActions({
  activeProjectId,
}: UseProjectActionsOptions = {}) {
  const router = useRouter()
  const [activeDialog, setActiveDialog] = useState<ProjectDialogType | null>(
    null
  )
  // Kept after close so the dialog content doesn't blank out mid-animation.
  const [targetProject, setTargetProject] = useState<Project | null>(null)
  const [name, setName] = useState("")
  const [suffix, setSuffix] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // The new project's ID, which is also its Liveblocks room ID.
  const roomId = toProjectId(name, suffix)
  const trimmedName = name.trim()

  function openDialog(type: ProjectDialogType, project: Project | null) {
    setTargetProject(project)
    setName(project?.name ?? "")
    setError(null)
    setActiveDialog(type)
  }

  function openCreateDialog() {
    setSuffix(createProjectIdSuffix())
    openDialog("create", null)
  }

  function openRenameDialog(project: Project) {
    openDialog("rename", project)
  }

  function openDeleteDialog(project: Project) {
    openDialog("delete", project)
  }

  function closeDialog() {
    if (isSubmitting) return
    setActiveDialog(null)
  }

  function updateName(value: string) {
    setName(value)
    setError(null)
  }

  /** Sends a request; closes the dialog on success, shows the error otherwise. */
  async function submit(url: string, init: RequestInit, onSuccess: () => void) {
    setIsSubmitting(true)
    setError(null)
    try {
      const response = await fetch(url, init)
      if (!response.ok) {
        setError(await readApiError(response))
        // Only create returns 409: the room ID is taken, so pick a new one.
        if (response.status === 409) setSuffix(createProjectIdSuffix())
        return
      }
      setActiveDialog(null)
      onSuccess()
    } catch {
      setError(NETWORK_ERROR)
    } finally {
      setIsSubmitting(false)
    }
  }

  const canCreate = roomId.length > 0 && !isSubmitting
  const canRename =
    trimmedName.length > 0 &&
    trimmedName !== targetProject?.name &&
    !isSubmitting

  function createProject() {
    if (!canCreate) return
    const id = roomId
    return submit(
      "/api/projects",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name: trimmedName }),
      },
      () => router.push(`/editor/${id}`)
    )
  }

  function renameProject() {
    if (!canRename || !targetProject) return
    return submit(
      `/api/projects/${encodeURIComponent(targetProject.id)}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName }),
      },
      () => router.refresh()
    )
  }

  function deleteProject() {
    if (isSubmitting || !targetProject) return
    const isActive = targetProject.id === activeProjectId
    return submit(
      `/api/projects/${encodeURIComponent(targetProject.id)}`,
      { method: "DELETE" },
      () => (isActive ? router.replace("/editor") : router.refresh())
    )
  }

  return {
    activeDialog,
    targetProject,
    name,
    setName: updateName,
    roomId,
    isSubmitting,
    error,
    canCreate,
    canRename,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
    closeDialog,
    createProject,
    renameProject,
    deleteProject,
  }
}

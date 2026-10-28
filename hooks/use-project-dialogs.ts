import { useState } from "react"

import { mockProjects } from "@/lib/mock-projects"
import { slugify } from "@/lib/slug"
import type { Project } from "@/types/project"

export type ProjectDialogType = "create" | "rename" | "delete"

/**
 * Dialog, form, and loading state for the project dialogs. Changes apply to
 * an in-memory copy of the mock data only — nothing is persisted.
 */
export function useProjectDialogs() {
  const [projects, setProjects] = useState<Project[]>(mockProjects)
  const [activeDialog, setActiveDialog] = useState<ProjectDialogType | null>(
    null
  )
  // Kept after close so the dialog content doesn't blank out mid-animation.
  const [targetProject, setTargetProject] = useState<Project | null>(null)
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const slug = slugify(name)
  const trimmedName = name.trim()

  function openCreateDialog() {
    setTargetProject(null)
    setName("")
    setActiveDialog("create")
  }

  function openRenameDialog(project: Project) {
    setTargetProject(project)
    setName(project.name)
    setActiveDialog("rename")
  }

  function openDeleteDialog(project: Project) {
    setTargetProject(project)
    setActiveDialog("delete")
  }

  function closeDialog() {
    if (isSubmitting) return
    setActiveDialog(null)
  }

  async function submit(action: () => void | Promise<void>) {
    setIsSubmitting(true)
    try {
      await action()
      setActiveDialog(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  const canCreate = slug.length > 0 && !isSubmitting
  const canRename =
    trimmedName.length > 0 &&
    trimmedName !== targetProject?.name &&
    !isSubmitting

  function createProject() {
    if (!canCreate) return
    return submit(() => {
      setProjects((current) => [
        ...current,
        { id: crypto.randomUUID(), name: trimmedName, slug, role: "owner" },
      ])
    })
  }

  function renameProject() {
    if (!canRename || !targetProject) return
    const { id } = targetProject
    return submit(() => {
      setProjects((current) =>
        current.map((project) =>
          project.id === id ? { ...project, name: trimmedName } : project
        )
      )
    })
  }

  function deleteProject() {
    if (isSubmitting || !targetProject) return
    const { id } = targetProject
    return submit(() => {
      setProjects((current) => current.filter((project) => project.id !== id))
    })
  }

  return {
    projects,
    activeDialog,
    targetProject,
    name,
    setName,
    slug,
    isSubmitting,
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

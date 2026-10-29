import { Suspense } from "react"
import { notFound } from "next/navigation"
import { auth } from "@clerk/nextjs/server"

import { EditorShell } from "@/components/editor/editor-shell"
import { loadEditorProjects } from "@/lib/editor-projects"

type WorkspaceParams = PageProps<"/editor/[projectId]">["params"]

export default function WorkspacePage({
  params,
}: PageProps<"/editor/[projectId]">) {
  return (
    <Suspense>
      <Workspace params={params} />
    </Suspense>
  )
}

async function Workspace({ params }: { params: WorkspaceParams }) {
  const { userId } = await auth.protect()
  const [{ projectId }, projects] = await Promise.all([
    params,
    loadEditorProjects(userId),
  ])

  // Only the owner or a collaborator may open a workspace.
  const isMember = [...projects.ownedProjects, ...projects.sharedProjects].some(
    (project) => project.id === projectId
  )

  if (!isMember) {
    notFound()
  }

  return <EditorShell {...projects} activeProjectId={projectId} />
}

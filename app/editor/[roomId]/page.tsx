import { Suspense } from "react"
import { auth } from "@clerk/nextjs/server"

import { AccessDenied } from "@/components/editor/access-denied"
import { EditorShell } from "@/components/editor/editor-shell"
import { loadEditorProjects } from "@/lib/editor-projects"
import { checkProjectAccess, getCurrentIdentity } from "@/lib/project-access"

type WorkspaceParams = PageProps<"/editor/[roomId]">["params"]

export default function WorkspacePage({
  params,
}: PageProps<"/editor/[roomId]">) {
  return (
    <Suspense>
      <Workspace params={params} />
    </Suspense>
  )
}

async function Workspace({ params }: { params: WorkspaceParams }) {
  const identity = await getCurrentIdentity()

  if (!identity) {
    const { redirectToSignIn } = await auth()
    return redirectToSignIn()
  }

  const { roomId } = await params
  const membership = await checkProjectAccess(roomId, identity)

  // Missing and unauthorized projects look the same.
  if (!membership) {
    return <AccessDenied />
  }

  const projects = await loadEditorProjects(identity)

  return <EditorShell {...projects} workspace={membership} />
}

import { Suspense } from "react"
import { auth } from "@clerk/nextjs/server"

import { EditorShell } from "@/components/editor/editor-shell"
import { loadEditorProjects } from "@/lib/editor-projects"
import { getCurrentIdentity } from "@/lib/project-access"

export default function EditorPage() {
  return (
    <Suspense>
      <EditorHomePage />
    </Suspense>
  )
}

async function EditorHomePage() {
  const identity = await getCurrentIdentity()

  if (!identity) {
    const { redirectToSignIn } = await auth()
    return redirectToSignIn()
  }

  const projects = await loadEditorProjects(identity)

  return <EditorShell {...projects} />
}

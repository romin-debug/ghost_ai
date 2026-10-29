import { Suspense } from "react"
import { auth } from "@clerk/nextjs/server"

import { EditorShell } from "@/components/editor/editor-shell"
import { loadEditorProjects } from "@/lib/editor-projects"

export default function EditorPage() {
  return (
    <Suspense>
      <EditorHomePage />
    </Suspense>
  )
}

async function EditorHomePage() {
  const { userId } = await auth.protect()
  const projects = await loadEditorProjects(userId)

  return <EditorShell {...projects} />
}

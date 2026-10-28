import { Suspense } from "react"
import { auth } from "@clerk/nextjs/server"

import { EditorShell } from "@/components/editor/editor-shell"

export default function EditorPage() {
  return (
    <Suspense>
      <ProtectedEditor />
    </Suspense>
  )
}

async function ProtectedEditor() {
  await auth.protect()

  return <EditorShell />
}

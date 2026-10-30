import Link from "next/link"
import { ArrowLeft, Lock } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"

/** Shown for workspaces that don't exist or that the user can't open. */
export function AccessDenied() {
  return (
    <main className="flex h-screen flex-col items-center justify-center gap-4 bg-base px-6 text-center">
      <Lock className="size-8 text-copy-faint" />
      <div className="flex max-w-sm flex-col gap-2">
        <h1 className="font-heading text-base font-medium text-copy-primary">
          You don’t have access to this project
        </h1>
        <p className="text-sm text-copy-muted">
          It may have been deleted, or it hasn’t been shared with you.
        </p>
      </div>
      <Link href="/editor" className={buttonVariants({ variant: "outline" })}>
        <ArrowLeft className="size-4" data-icon="inline-start" />
        Back to projects
      </Link>
    </main>
  )
}

import { currentUser } from "@clerk/nextjs/server"

import { listOwnedProjects, listSharedProjects } from "@/lib/projects"
import type { EditorProjects, Project } from "@/types/project"

function toProject({ id, name }: Project): Project {
  return { id, name }
}

/**
 * Owned and shared projects for the signed-in user's sidebar. Sharing matches
 * collaborator entries against the user's verified email addresses only.
 */
export async function loadEditorProjects(
  userId: string
): Promise<EditorProjects> {
  const user = await currentUser()
  const emails =
    user?.emailAddresses
      .filter((email) => email.verification?.status === "verified")
      .map((email) => email.emailAddress) ?? []

  const [owned, shared] = await Promise.all([
    listOwnedProjects(userId),
    listSharedProjects(userId, emails),
  ])

  return {
    ownedProjects: owned.map(toProject),
    sharedProjects: shared.map(toProject),
  }
}

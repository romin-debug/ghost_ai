import type { CurrentIdentity } from "@/lib/project-access"
import { listOwnedProjects, listSharedProjects } from "@/lib/projects"
import type { EditorProjects, Project } from "@/types/project"

function toProject({ id, name }: Project): Project {
  return { id, name }
}

/**
 * Owned and shared projects for the signed-in user's sidebar. Sharing matches
 * collaborator entries against the user's verified primary email, the same
 * rule `checkProjectAccess` uses to open a workspace.
 */
export async function loadEditorProjects({
  userId,
  primaryEmail,
}: CurrentIdentity): Promise<EditorProjects> {
  const [owned, shared] = await Promise.all([
    listOwnedProjects(userId),
    listSharedProjects(userId, primaryEmail ? [primaryEmail] : []),
  ])

  return {
    ownedProjects: owned.map(toProject),
    sharedProjects: shared.map(toProject),
  }
}

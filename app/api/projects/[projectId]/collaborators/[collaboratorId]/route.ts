import { auth } from "@clerk/nextjs/server"

import { apiError, projectAccessError } from "@/lib/api"
import { removeCollaborator } from "@/lib/collaborators"
import { getProjectAccess } from "@/lib/projects"

type CollaboratorRouteContext =
  RouteContext<"/api/projects/[projectId]/collaborators/[collaboratorId]">

/** Owner only. */
export async function DELETE(_request: Request, ctx: CollaboratorRouteContext) {
  const { userId } = await auth()

  if (!userId) {
    return apiError(401, "Unauthorized")
  }

  const { projectId, collaboratorId } = await ctx.params
  const denied = projectAccessError(await getProjectAccess(projectId, userId))

  if (denied) {
    return denied
  }

  const removed = await removeCollaborator(projectId, collaboratorId)

  if (!removed) {
    return apiError(404, "Collaborator not found.")
  }

  return new Response(null, { status: 204 })
}

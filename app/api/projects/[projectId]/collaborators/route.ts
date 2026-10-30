import { auth } from "@clerk/nextjs/server"

import { apiError, projectAccessError, readJsonBody } from "@/lib/api"
import { parseInviteCollaboratorInput } from "@/lib/collaborator-input"
import { getOwnerProfile, withClerkProfiles } from "@/lib/collaborator-profiles"
import { addCollaborator, listCollaborators } from "@/lib/collaborators"
import { checkProjectAccess, getCurrentIdentity } from "@/lib/project-access"
import { getProjectAccess, getProjectOwnerId } from "@/lib/projects"
import type { ProjectPeople } from "@/types/collaborator"

type CollaboratorsRouteContext =
  RouteContext<"/api/projects/[projectId]/collaborators">

/** Any member (owner or collaborator) can view the list. */
export async function GET(_request: Request, ctx: CollaboratorsRouteContext) {
  const identity = await getCurrentIdentity()

  if (!identity) {
    return apiError(401, "Unauthorized")
  }

  const { projectId } = await ctx.params

  // Non-members get the same response as a missing project.
  if (!(await checkProjectAccess(projectId, identity))) {
    return apiError(404, "Project not found.")
  }

  const [ownerId, records] = await Promise.all([
    getProjectOwnerId(projectId),
    listCollaborators(projectId),
  ])

  // Deleted between the access check and the reads.
  if (!ownerId) {
    return apiError(404, "Project not found.")
  }

  const [owner, collaborators] = await Promise.all([
    getOwnerProfile(ownerId),
    withClerkProfiles(records),
  ])

  return Response.json({ owner, collaborators } satisfies ProjectPeople)
}

/** Owner only. */
export async function POST(request: Request, ctx: CollaboratorsRouteContext) {
  const { userId } = await auth()

  if (!userId) {
    return apiError(401, "Unauthorized")
  }

  const json = await readJsonBody(request)

  if (!json.ok) {
    return apiError(400, "Request body must be valid JSON.")
  }

  const input = parseInviteCollaboratorInput(json.body)

  if (!input.ok) {
    return apiError(400, input.error)
  }

  const { projectId } = await ctx.params
  const denied = projectAccessError(await getProjectAccess(projectId, userId))

  if (denied) {
    return denied
  }

  const record = await addCollaborator(projectId, input.data.email)

  if (!record) {
    return apiError(409, `${input.data.email} is already a collaborator.`)
  }

  const [collaborator] = await withClerkProfiles([record])

  return Response.json({ collaborator }, { status: 201 })
}

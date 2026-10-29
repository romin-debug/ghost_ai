import { auth } from "@clerk/nextjs/server"

import { apiError, readJsonBody } from "@/lib/api"
import { parseRenameProjectInput } from "@/lib/project-input"
import {
  type ProjectAccess,
  deleteProject,
  getProjectAccess,
  renameProject,
} from "@/lib/projects"

type ProjectRouteContext = RouteContext<"/api/projects/[projectId]">

/** Maps a failed owner check to its response, or `null` for the owner. */
function accessError(access: ProjectAccess): Response | null {
  switch (access) {
    case "owner":
      return null
    case "forbidden":
      return apiError(403, "Only the project owner can do this.")
    case "not-found":
      return apiError(404, "Project not found.")
  }
}

export async function PATCH(request: Request, ctx: ProjectRouteContext) {
  const { userId } = await auth()

  if (!userId) {
    return apiError(401, "Unauthorized")
  }

  const json = await readJsonBody(request)

  if (!json.ok) {
    return apiError(400, "Request body must be valid JSON.")
  }

  const input = parseRenameProjectInput(json.body)

  if (!input.ok) {
    return apiError(400, input.error)
  }

  const { projectId } = await ctx.params
  const denied = accessError(await getProjectAccess(projectId, userId))

  if (denied) {
    return denied
  }

  const project = await renameProject(projectId, userId, input.data.name)

  if (!project) {
    return apiError(404, "Project not found.")
  }

  return Response.json({ project })
}

export async function DELETE(_request: Request, ctx: ProjectRouteContext) {
  const { userId } = await auth()

  if (!userId) {
    return apiError(401, "Unauthorized")
  }

  const { projectId } = await ctx.params
  const denied = accessError(await getProjectAccess(projectId, userId))

  if (denied) {
    return denied
  }

  const deleted = await deleteProject(projectId, userId)

  if (!deleted) {
    return apiError(404, "Project not found.")
  }

  return new Response(null, { status: 204 })
}

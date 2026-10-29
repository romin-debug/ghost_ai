import { auth } from "@clerk/nextjs/server"

import { apiError, readJsonBody } from "@/lib/api"
import { parseCreateProjectInput } from "@/lib/project-input"
import { createProject, listOwnedProjects } from "@/lib/projects"

export async function GET() {
  const { userId } = await auth()

  if (!userId) {
    return apiError(401, "Unauthorized")
  }

  const projects = await listOwnedProjects(userId)

  return Response.json({ projects })
}

export async function POST(request: Request) {
  const { userId } = await auth()

  if (!userId) {
    return apiError(401, "Unauthorized")
  }

  const json = await readJsonBody(request)

  if (!json.ok) {
    return apiError(400, "Request body must be valid JSON.")
  }

  const input = parseCreateProjectInput(json.body)

  if (!input.ok) {
    return apiError(400, input.error)
  }

  const project = await createProject(userId, input.data)

  if (!project) {
    return apiError(409, "A project with this ID already exists.")
  }

  return Response.json({ project }, { status: 201 })
}

import { Prisma } from "@/app/generated/prisma/client"
import { prisma } from "@/lib/prisma"

const collaboratorSelect = {
  id: true,
  email: true,
} satisfies Prisma.ProjectCollaboratorSelect

export type CollaboratorRecord = Prisma.ProjectCollaboratorGetPayload<{
  select: typeof collaboratorSelect
}>

/** A project's collaborators, oldest invite first. */
export function listCollaborators(projectId: string) {
  return prisma.projectCollaborator.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
    select: collaboratorSelect,
  })
}

/**
 * Adds `email` (already normalized) to the project. Returns `null` if the
 * email is already a collaborator, compared case-insensitively.
 */
export async function addCollaborator(projectId: string, email: string) {
  const existing = await prisma.projectCollaborator.findFirst({
    where: { projectId, email: { equals: email, mode: "insensitive" } },
    select: { id: true },
  })

  if (existing) {
    return null
  }

  try {
    return await prisma.projectCollaborator.create({
      data: { projectId, email },
      select: collaboratorSelect,
    })
  } catch (error) {
    // Lost a race with a concurrent invite for the same email.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return null
    }
    throw error
  }
}

/**
 * Removes a collaborator from the project. Returns `false` if the project has
 * no collaborator with that ID.
 */
export async function removeCollaborator(
  projectId: string,
  collaboratorId: string
) {
  const { count } = await prisma.projectCollaborator.deleteMany({
    where: { id: collaboratorId, projectId },
  })

  return count > 0
}

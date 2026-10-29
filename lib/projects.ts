import { Prisma } from "@/app/generated/prisma/client"
import { prisma } from "@/lib/prisma"
import type { CreateProjectInput } from "@/lib/project-input"

/** Fields exposed by the project API. */
const projectSelect = {
  id: true,
  name: true,
  description: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ProjectSelect

export type ProjectAccess = "owner" | "forbidden" | "not-found"

function isUniqueConstraintViolation(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  )
}

function isRecordNotFound(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  )
}

export function listOwnedProjects(ownerId: string) {
  return prisma.project.findMany({
    where: { ownerId },
    orderBy: { createdAt: "desc" },
    select: projectSelect,
  })
}

/**
 * Creates a project owned by `ownerId`. Returns `null` if `id` is already
 * taken.
 */
export async function createProject(
  ownerId: string,
  { id, name }: CreateProjectInput
) {
  try {
    return await prisma.project.create({
      data: { id, ownerId, name },
      select: projectSelect,
    })
  } catch (error) {
    if (isUniqueConstraintViolation(error)) {
      return null
    }
    throw error
  }
}

/**
 * Projects shared with the user through a collaborator entry for one of
 * their `emails`, excluding projects they own. Newest first.
 */
export function listSharedProjects(userId: string, emails: string[]) {
  if (emails.length === 0) {
    return Promise.resolve([])
  }

  return prisma.project.findMany({
    where: {
      ownerId: { not: userId },
      collaborators: {
        some: { email: { in: emails, mode: "insensitive" } },
      },
    },
    orderBy: { createdAt: "desc" },
    select: projectSelect,
  })
}

/** Whether `userId` owns the project. Only the owner may rename or delete. */
export async function getProjectAccess(
  projectId: string,
  userId: string
): Promise<ProjectAccess> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  })

  if (!project) {
    return "not-found"
  }

  return project.ownerId === userId ? "owner" : "forbidden"
}

/**
 * Renames a project owned by `ownerId`. Returns `null` if no such project
 * exists, e.g. it was deleted after the access check.
 */
export async function renameProject(
  projectId: string,
  ownerId: string,
  name: string
) {
  try {
    return await prisma.project.update({
      where: { id: projectId, ownerId },
      data: { name },
      select: projectSelect,
    })
  } catch (error) {
    if (isRecordNotFound(error)) {
      return null
    }
    throw error
  }
}

/**
 * Deletes a project owned by `ownerId`; collaborators cascade. Returns `false`
 * if no such project exists.
 */
export async function deleteProject(projectId: string, ownerId: string) {
  const { count } = await prisma.project.deleteMany({
    where: { id: projectId, ownerId },
  })

  return count > 0
}

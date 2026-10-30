import { auth, currentUser } from "@clerk/nextjs/server"

import { prisma } from "@/lib/prisma"
import { isValidProjectId } from "@/lib/project-id"
import type { ProjectMembership } from "@/types/project"

/** The signed-in Clerk user, as used for project access checks. */
export interface CurrentIdentity {
  userId: string
  /** Primary email address, or `null` if it is missing or unverified. */
  primaryEmail: string | null
}

/** Returns `null` when signed out. */
export async function getCurrentIdentity(): Promise<CurrentIdentity | null> {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  // An unverified address can't grant collaborator access.
  const user = await currentUser()
  const primary = user?.primaryEmailAddress
  const primaryEmail =
    primary?.verification?.status === "verified" ? primary.emailAddress : null

  return { userId, primaryEmail }
}

/**
 * The project and the user's role on it, if they own it or their primary
 * email is a collaborator (case-insensitive). Returns `null` both when the
 * project doesn't exist and when the user has no access, so callers can't
 * reveal which projects exist.
 */
export async function checkProjectAccess(
  projectId: string,
  { userId, primaryEmail }: CurrentIdentity
): Promise<ProjectMembership | null> {
  if (!isValidProjectId(projectId)) {
    return null
  }

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      OR: [
        { ownerId: userId },
        ...(primaryEmail
          ? [
              {
                collaborators: {
                  some: {
                    email: { equals: primaryEmail, mode: "insensitive" as const },
                  },
                },
              },
            ]
          : []),
      ],
    },
    select: { id: true, name: true, ownerId: true },
  })

  if (!project) {
    return null
  }

  return {
    project: { id: project.id, name: project.name },
    role: project.ownerId === userId ? "owner" : "collaborator",
  }
}

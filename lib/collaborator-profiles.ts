import { type User, clerkClient } from "@clerk/nextjs/server"

import type { CollaboratorRecord } from "@/lib/collaborators"
import type { Collaborator, ProjectOwner } from "@/types/collaborator"

// Clerk's `emailAddress` filter accepts up to 100 addresses per request.
const CLERK_EMAIL_BATCH_SIZE = 100

interface ClerkProfile {
  name: string | null
  imageUrl: string
}

/** Clerk profiles keyed by lowercased verified email address. */
async function findClerkProfiles(
  emails: string[]
): Promise<Map<string, ClerkProfile>> {
  const client = await clerkClient()
  const batches: string[][] = []

  for (let i = 0; i < emails.length; i += CLERK_EMAIL_BATCH_SIZE) {
    batches.push(emails.slice(i, i + CLERK_EMAIL_BATCH_SIZE))
  }

  const results = await Promise.all(
    batches.map((batch) =>
      client.users.getUserList({
        emailAddress: batch,
        limit: CLERK_EMAIL_BATCH_SIZE,
      })
    )
  )

  const profiles = new Map<string, ClerkProfile>()

  for (const user of results.flatMap(({ data }) => data)) {
    const profile = toProfile(user)
    // Only a verified address identifies the person behind an invite.
    for (const address of user.emailAddresses) {
      if (address.verification?.status === "verified") {
        profiles.set(address.emailAddress.toLowerCase(), profile)
      }
    }
  }

  return profiles
}

function toProfile(user: User): ClerkProfile {
  return {
    name: user.fullName ?? user.username ?? null,
    imageUrl: user.imageUrl,
  }
}

/**
 * Adds each collaborator's Clerk display name and avatar. Emails without a
 * Clerk user, or a failed Clerk lookup, fall back to email only.
 */
export async function withClerkProfiles(
  records: CollaboratorRecord[]
): Promise<Collaborator[]> {
  let profiles = new Map<string, ClerkProfile>()

  if (records.length > 0) {
    try {
      profiles = await findClerkProfiles(
        records.map(({ email }) => email.toLowerCase())
      )
    } catch (error) {
      console.error("Failed to load collaborator profiles from Clerk", error)
    }
  }

  return records.map(({ id, email }) => {
    const profile = profiles.get(email.toLowerCase())
    return {
      id,
      email,
      name: profile?.name ?? null,
      imageUrl: profile?.imageUrl ?? null,
    }
  })
}

/**
 * The owner's Clerk name, primary email, and avatar. A missing user or a
 * failed Clerk lookup yields an all-`null` profile.
 */
export async function getOwnerProfile(ownerId: string): Promise<ProjectOwner> {
  try {
    const client = await clerkClient()
    const user = await client.users.getUser(ownerId)
    return {
      ...toProfile(user),
      email: user.primaryEmailAddress?.emailAddress ?? null,
    }
  } catch (error) {
    console.error("Failed to load the project owner from Clerk", error)
    return { name: null, email: null, imageUrl: null }
  }
}

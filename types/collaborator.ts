/** A project collaborator, enriched with their Clerk profile when one exists. */
export interface Collaborator {
  id: string
  email: string
  /** Clerk display name, or `null` when no Clerk user has this email. */
  name: string | null
  /** Clerk avatar URL, or `null` when no Clerk user has this email. */
  imageUrl: string | null
}

/** The project owner's Clerk profile. Fields are `null` if Clerk can't provide them. */
export interface ProjectOwner {
  name: string | null
  email: string | null
  imageUrl: string | null
}

/** Everyone with access to a project, as returned by the collaborators API. */
export interface ProjectPeople {
  owner: ProjectOwner
  collaborators: Collaborator[]
}

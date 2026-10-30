/** A project as listed in the editor sidebar. */
export interface Project {
  /** Also the project's Liveblocks room ID. */
  id: string
  name: string
}

/** The current user's projects, split by their relationship to each. */
export interface EditorProjects {
  ownedProjects: Project[]
  sharedProjects: Project[]
}

export type ProjectRole = "owner" | "collaborator"

/** A project the user can open, and their role on it. */
export interface ProjectMembership {
  project: Project
  role: ProjectRole
}

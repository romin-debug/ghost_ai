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

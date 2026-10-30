import { MAX_PROJECT_ID_LENGTH, isValidProjectId } from "@/lib/project-id"

export const DEFAULT_PROJECT_NAME = "Untitled Project"

export type ParseResult<T> = { ok: true; data: T } | { ok: false; error: string }

export interface CreateProjectInput {
  /** Client-chosen ID, kept equal to the Liveblocks room ID. Generated when omitted. */
  id?: string
  name: string
}

export interface RenameProjectInput {
  name: string
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

/**
 * A missing body, or a missing or blank name, falls back to the default name.
 * A missing `id` lets the database generate one.
 */
export function parseCreateProjectInput(
  body: unknown
): ParseResult<CreateProjectInput> {
  if (body === undefined) {
    return { ok: true, data: { name: DEFAULT_PROJECT_NAME } }
  }

  if (!isRecord(body)) {
    return { ok: false, error: "Request body must be a JSON object." }
  }

  const id = body.id ?? undefined
  const name = body.name ?? undefined

  if (id !== undefined && (typeof id !== "string" || !isValidProjectId(id))) {
    return {
      ok: false,
      error: `\`id\` must be lowercase letters, digits, and single hyphens, at most ${MAX_PROJECT_ID_LENGTH} characters.`,
    }
  }

  if (name !== undefined && typeof name !== "string") {
    return { ok: false, error: "`name` must be a string." }
  }

  return {
    ok: true,
    data: { id, name: name?.trim() || DEFAULT_PROJECT_NAME },
  }
}

export function parseRenameProjectInput(
  body: unknown
): ParseResult<RenameProjectInput> {
  if (!isRecord(body)) {
    return { ok: false, error: "Request body must be a JSON object." }
  }

  const { name } = body

  if (typeof name !== "string" || !name.trim()) {
    return { ok: false, error: "`name` must be a non-empty string." }
  }

  return { ok: true, data: { name: name.trim() } }
}
